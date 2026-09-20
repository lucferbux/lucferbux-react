#!/usr/bin/env node
/**
 * Seed Firestore from content/seed/.
 *
 * Idempotent by construction: every record carries an explicit `_id` and is
 * written with `setDoc`, so re-running produces no drift. (The admin UI used
 * to only ever `addDoc`, which meant a naive re-run duplicated everything.)
 *
 *   npm run seed                          # dry run — prints a diff, writes nothing
 *   npm run seed -- --apply               # write
 *   npm run seed -- --only project,team   # restrict to some collections
 *   npm run seed -- --emulator --apply    # against the local emulator
 *   npm run seed -- --apply --prune       # also delete documents not in the seed
 *
 * Dry run is the default on purpose: this writes to the live site's data.
 */
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initAdmin } from "./lib/adminApp.mjs";

const SEED_DIR = resolve(process.cwd(), "content/seed");

/**
 * Documents the new content replaces, by collection.
 *
 * Kept as a versioned list rather than a `--prune` sweep because the live
 * collections hold a real archive the curated seed does NOT reproduce: 34
 * published articles, 14 news items and 15 projects. A blanket prune would
 * have deleted all of it. Only genuine duplicates belong here.
 */
function loadSuperseded() {
  try {
    return JSON.parse(readFileSync(join(SEED_DIR, "superseded.json"), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw new Error(`superseded.json is not valid JSON: ${error.message}`);
  }
}

/** Seed file name -> Firestore collection. They are the same; the legacy
 *  collection names (intro, patent, team) are used as the file names too so
 *  there is no second mapping to keep in sync. */
const COLLECTIONS = ["intro", "patent", "project", "team", "teaching"];

/** Fields stored as Firestore timestamps, by collection. */
const TIMESTAMP_FIELDS = {
  intro: ["timestamp"],
  patent: ["date"],
  project: ["date"],
  team: [],
  teaching: [],
};

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};

const apply = flag("apply");
const prune = flag("prune");
const only = value("only")
  ?.split(",")
  .map((s) => s.trim());

if (flag("emulator") && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

function hydrate(collection, record) {
  const { _id, ...rest } = record;
  for (const field of TIMESTAMP_FIELDS[collection] ?? []) {
    if (typeof rest[field] === "string") {
      rest[field] = Timestamp.fromDate(new Date(rest[field]));
    }
  }
  return { id: _id, data: rest };
}

function loadSeed(collection) {
  const path = join(SEED_DIR, `${collection}.json`);
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new Error(`${collection}.json is not valid JSON: ${error.message}`);
  }
}

/** Shallow-ish comparison good enough to report "would change". */
function differs(a, b) {
  return JSON.stringify(normalise(a)) !== JSON.stringify(normalise(b));
}

function normalise(value) {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(normalise);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, normalise(value[k])])
    );
  }
  return value;
}

initAdmin();
const db = getFirestore();

const targets = COLLECTIONS.filter((c) => !only || only.includes(c));
if (targets.length === 0) {
  console.error(
    `No matching collections. Available: ${COLLECTIONS.join(", ")}`
  );
  process.exit(1);
}

console.log(
  apply
    ? `Writing to ${process.env.FIRESTORE_EMULATOR_HOST ?? "LIVE Firestore"}\n`
    : "Dry run — nothing will be written. Pass --apply to commit.\n"
);

const superseded = loadSuperseded();

let created = 0;
let updated = 0;
let unchanged = 0;
let removed = 0;

for (const collection of targets) {
  const seed = loadSeed(collection);
  if (!seed) {
    console.log(`${collection}: no seed file, skipped`);
    continue;
  }

  const existing = new Map();
  const snapshot = await db.collection(collection).get();
  for (const doc of snapshot.docs) existing.set(doc.id, doc.data());

  const batch = db.batch();
  const seenIds = new Set();

  for (const record of seed) {
    if (!record._id) {
      throw new Error(`${collection}.json has a record with no _id`);
    }
    const { id, data } = hydrate(collection, record);
    seenIds.add(id);

    const current = existing.get(id);
    if (!current) {
      console.log(`  + ${collection}/${id}`);
      created += 1;
    } else if (differs(current, data)) {
      const changed = Object.keys(data).filter((k) =>
        differs(current[k], data[k])
      );
      console.log(`  ~ ${collection}/${id}  (${changed.join(", ")})`);
      updated += 1;
    } else {
      unchanged += 1;
      continue;
    }

    if (apply) batch.set(db.collection(collection).doc(id), data);
  }

  // Documents explicitly recorded as replaced by the new content.
  for (const id of superseded[collection] ?? []) {
    if (!existing.has(id)) continue;
    console.log(`  - ${collection}/${id}  (superseded)`);
    removed += 1;
    if (apply) batch.delete(db.collection(collection).doc(id));
  }

  if (prune) {
    for (const id of existing.keys()) {
      if (seenIds.has(id) || (superseded[collection] ?? []).includes(id)) {
        continue;
      }
      console.log(`  - ${collection}/${id}  (not in seed)`);
      removed += 1;
      if (apply) batch.delete(db.collection(collection).doc(id));
    }
  }

  if (apply) await batch.commit();
}

console.log(
  `\n${created} to create, ${updated} to update, ${unchanged} unchanged, ` +
    `${removed} to delete`
);

if (!apply && created + updated + removed > 0) {
  console.log("\nRe-run with --apply to write these changes.");
}
if (!prune) {
  console.log(
    "Documents not in the seed and not listed in superseded.json were left\n" +
      "alone — that is where the existing archive lives. --prune deletes them."
  );
}
