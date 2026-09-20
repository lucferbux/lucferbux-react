# Seed content

The site's Firestore content, as versioned JSON. One file per collection, named
after the **legacy Firestore collection name** rather than the domain concept —
see the landmine in `AGENTS.md`:

| File            | Collection | Shown as       |
| --------------- | ---------- | -------------- |
| `intro.json`    | `intro`    | News           |
| `patent.json`   | `patent`   | Posts          |
| `project.json`  | `project`  | Projects       |
| `team.json`     | `team`     | Résumé         |
| `teaching.json` | `teaching` | Teaching       |

## Shape

Every record carries an explicit `_id`, which becomes the Firestore document
id. That is what makes seeding idempotent: the script uses `setDoc`, so
re-running changes nothing rather than creating duplicates.

Localized text is a per-locale map:

```json
{
  "_id": "redhat-tech-lead",
  "name": { "en": "Senior Software Engineer", "es": "Senior Software Engineer" },
  "description": { "en": "…", "es": "…" }
}
```

The site reads both this shape and the legacy flat one (`title` holding Spanish,
`title_en` holding English), so the seed can be applied without a coordinated
deploy. See `src/i18n/localized.ts`.

Timestamps are ISO-8601 strings here and are converted by the uploader.

`patent.json` is generated from the markdown in `src/content/{en,es}/` — its
`internalLink` values must match the post slugs, which `npm run seed` does not
verify. Regenerate it after adding a post.

## Applying it

**Dry run is the default.** Nothing is written without `--apply`.

```bash
npm run seed                          # print a per-document diff, write nothing
npm run seed -- --apply               # write
npm run seed -- --only project,team   # a subset
npm run seed -- --apply --prune       # also delete documents not in the seed
```

### Without credentials, against the emulator

You can rehearse the whole thing before anyone hands over a key:

```bash
npm run emulators                     # in one terminal
npm run seed -- --emulator --apply    # in another
npm run seed -- --emulator            # should report zero changes
```

That second dry run reporting "0 to create, 0 to update" is the idempotency
check.

### Against the real project

Credentials are resolved in this order:

1. `FIRESTORE_EMULATOR_HOST` — no credentials needed.
2. `GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json`
3. `scripts/serviceAccount.json` — gitignored.
4. Application Default Credentials (`gcloud auth application-default login`).

Note on ADC: it is a single global file per machine. If you also use `gcloud`
for work, re-running that command replaces those credentials. A service account
key at `scripts/serviceAccount.json` is isolated and does not disturb them.

Get a key from the Firebase console for project **`lucferbux-web-page`**, under
_Project settings → Service accounts → Generate new private key_:

<https://console.firebase.google.com/u/0/project/lucferbux-web-page/settings/serviceaccounts/adminsdk>

## Order of operations

The security rules require an `admin` custom claim, so:

```bash
npm run set-admin -- you@example.com   # 1. grant the claim
npm run deploy:rules                   # 2. deploy the rules
npm run seed -- --apply                # 3. seed
```

Deploying the rules before granting the claim locks everyone out of writing,
including the admin UI. The claim only reaches the browser after a fresh
sign-in.

## Banners

Post banners are generated from the post slug, so they are reproducible and a
given post always gets the same image:

```bash
node scripts/generate-banners.mjs
```

They land in `public/images/banners/` and are served by Netlify, which is why
`featuredImage` is a local path. If you would rather host them in Firebase
Storage, `scripts/upload-banners.mjs` mirrors them there and prints the URLs.
