#!/usr/bin/env node
/**
 * Mirror the generated post banners into Firebase Storage.
 *
 * Optional. By default the banners live in `public/images/banners/` and are
 * served by Netlify, which needs no credentials and is precached by the service
 * worker. Use this if you would rather host them in Storage — for example so
 * that the admin can point a post at one without a redeploy.
 *
 *   node scripts/upload-banners.mjs            # dry run
 *   node scripts/upload-banners.mjs --apply
 */
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { getStorage } from "firebase-admin/storage";
import { initAdmin } from "./lib/adminApp.mjs";

const SOURCE_DIR = resolve(process.cwd(), "public/images/banners");
const DESTINATION_PREFIX = "banners";

const apply = process.argv.includes("--apply");

initAdmin();
const bucket = getStorage().bucket();

let files;
try {
  files = readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".svg"));
} catch {
  console.error(
    `No banners found in ${SOURCE_DIR}. Run scripts/generate-banners.mjs first.`
  );
  process.exit(1);
}

if (!apply) {
  console.log("Dry run — nothing will be uploaded. Pass --apply to commit.\n");
}

for (const file of files) {
  const destination = `${DESTINATION_PREFIX}/${file}`;
  console.log(`  ${file} -> gs://${bucket.name}/${destination}`);

  if (!apply) continue;

  await bucket.upload(join(SOURCE_DIR, file), {
    destination,
    metadata: {
      contentType: "image/svg+xml",
      // Banners are immutable: the generator is deterministic and the filename
      // is the slug, so a changed banner means a changed slug.
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  await bucket.file(destination).makePublic();

  console.log(
    `    https://storage.googleapis.com/${bucket.name}/${destination}`
  );
}

console.log(
  `\n${files.length} banner${files.length === 1 ? "" : "s"}${apply ? " uploaded" : " would be uploaded"}`
);
