# AGENTS.md — Lucferbux Personal Website

> Single source of truth for AI coding agents working in this repo.
> `CLAUDE.md` and `.github/copilot-instructions.md` are thin pointers at this file — keep the
> content here so they can't drift.

## Project Description

Personal website and PWA for Lucas Fernández Aragón (`lucferbux.dev`), built with Vite +
React 18 as a single-page application. Displays news, blog posts, projects, teaching material
and a résumé section. Dynamic data lives in Cloud Firestore; blog posts are static Markdown
files loaded at build time. Includes a Firebase Auth-protected admin section for CRUD on the
Firestore collections.

## Tech Stack

| Layer                  | Technology                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------- |
| Build                  | Vite 7                                                                             |
| UI                     | React 18, TypeScript 5 (strict)                                                    |
| Styling                | Tailwind CSS v4 (CSS-based `@theme` config — there is **no** `tailwind.config.js`) |
| Routing                | React Router v7                                                                    |
| Backend                | Firebase JS SDK v12 (modular imports only)                                         |
| Database               | Cloud Firestore                                                                    |
| Auth                   | Firebase Authentication (email/password)                                           |
| Blog                   | react-markdown + remark-gfm + rehype-prism-plus                                    |
| Unit/integration tests | Vitest 4 + React Testing Library                                                   |
| Visual regression      | Playwright (`tests/visual/`)                                                       |
| PWA                    | vite-plugin-pwa (Workbox `generateSW`)                                             |
| CI                     | GitHub Actions (`ci.yml`)                                                          |
| **Deploy**             | **Netlify** (`netlify.toml`) — _not_ Firebase Hosting                              |

---

## ⚠️ Landmines

Read this section before changing anything. Each item has bitten someone.

### 1. Tailwind breakpoints are redefined

`src/styles/globals.css` overrides the entire default scale:

```
xs 450 · sm 550 · md 650 · lg 750 · xl 1000 · 2xl 1234 · 3xl 1440 · 4xl 2500
```

`sm:` / `md:` / `lg:` / `xl:` mean **nothing like stock Tailwind**. Any snippet copied from
Tailwind docs, another project, or a model's memory will target the wrong viewport. Always
check the token list before writing a responsive class.

### 2. The codebase is desktop-first

~216 `max-*` usages versus ~84 min-width ones, plus ~35 one-off arbitrary breakpoints
(`max-[870px]`, `max-[948px]`, `min-[1700px]`, …). Roughly 25 distinct thresholds in a site
that declares 8. When editing responsive behaviour, match the surrounding direction — mixing
`max-` and `min-` in the same component produces overlap bugs that only appear at one width.

### 3. Home sections are fixed-height with `overflow-hidden`

`NewsSectionHome` (`h-[1000px]`), `PostsProjectSection` (`h-[1150px]`), `AboutMeSection`
(`h-[1000px]`), `Footer` (`h-[440px] pt-[250px]`) — each a `relative` box that must exactly
contain both its content and an absolutely-positioned stack of wave SVGs. **Adding content
does not grow the section; it clips silently.** If content must grow, the height ladder at
every breakpoint has to grow with it.

### 4. `MockupAnimation` is the most fragile component in the repo

`src/components/animations/MockupAnimation.tsx` has seven overlapping `max-[Npx]`
scale/translate rules in source order plus seven absolutely-positioned floating PNGs. The
declared intent and the actual cascade already diverge at small widths. Do not refactor it
casually; verify against the visual baseline at every width.

### 5. Dark mode is three cooperating mechanisms

There is **no `.dark` class and no toggle** — it is `prefers-color-scheme` only, implemented
three ways at once:

1. `dark:` utilities (~71 occurrences),
2. raw `@media (prefers-color-scheme: dark)` blocks in `globals.css` and `blog.css`,
3. CSS `content:` URL swaps to separate `-dark.svg` wave assets.

Changing one without the others desyncs the page. Introducing a manual theme toggle means
rewriting all three — treat it as its own project.

### 6. Firestore collection names are legacy and misleading

| UI concept    | Firestore collection |
| ------------- | -------------------- |
| News          | `intro`              |
| Posts         | `patent`             |
| Projects      | `project`            |
| Work / Résumé | `team`               |
| Teaching      | `teaching`           |

### 7. Bilingual field convention

Historically: **bare field = Spanish, `_en` suffix = English** (`title` / `title_en`).
Current target shape is nested per-locale objects: `{ title: { en, es } }`.
`src/utils/localized.ts` reads **both**, so legacy documents keep working. Never read
`item.title_en` directly in a component — go through the resolver.

### 8. Queries are descriptors, not `QueryConstraint[]`

`useFirestoreCollection(path, query)` takes a serializable `QueryDescriptor`
(`{ where?, orderBy?, limit? }` — see `src/data/source/types.ts`), **not** Firebase
constraint objects:

```ts
useFirestoreCollection<News>("intro", {
  orderBy: [["timestamp", "desc"]],
  limit: 6,
});
```

This is what lets the hook depend on the query honestly and re-subscribe when it changes. An
earlier version took `QueryConstraint[]`, which is a fresh object identity every render, so
it pinned its deps to `[collectionPath]` behind an `eslint-disable` and silently ignored
runtime query changes. Do not reintroduce raw constraints at call sites.

### 9. Prettier does not touch `src/content/`

The blog articles are authored prose. Prettier reflows their paragraphs **and reformats the
code samples inside fenced blocks**, which both edits the teaching material and changes the
rendered page height. `src/content` is in `.prettierignore`; keep it there.

### 10. `npm run preview` is served by a stale service worker

The PWA registers a service worker with `CacheFirst` asset caching, so after a
rebuild the browser keeps serving the **previous** bundle until the worker
updates. Verifying a change against `npm run preview` will silently show you the
old code. Either clear it first:

```js
(await navigator.serviceWorker.getRegistrations()).forEach((r) =>
  r.unregister()
);
(await caches.keys()).forEach((k) => caches.delete(k));
```

or use the visual suite, whose Playwright config sets `serviceWorkers: "block"`.

### 11. Deploying the rules before granting the admin claim locks you out

`firestore.rules` and `storage.rules` require an `admin` custom claim. Run
`npm run set-admin -- <email>` **before** `npm run deploy:rules`, and sign out and
in again afterwards — the claim only reaches the browser with a fresh token.

### 12. Never set a `background-color` on `html`

`body` is the canvas painter (`globals.css`). Giving `html` a background makes it paint the
entire viewport, including overscroll and everything below a short page's content. This was
tried in `70d92b1` and reverted in `88b2d24`. Safari also never reaches `html` while `body`
has a background, so it does not even achieve what it was for — see the page-tint notes
before touching `index.html`, `SEO.tsx` or the body background.

---

## Directory Structure

```
├── netlify.toml              # Deploy config: SPA redirect + cache headers (the live one)
├── firebase.json             # Firestore/Storage rules + indexes (hosting block is legacy)
├── firestore.rules           # Public read, authenticated write
├── storage.rules             # Public read, authenticated write
├── vite.config.ts            # Vite + React + Tailwind + PWA plugins
├── vitest.config.ts          # Unit/integration tests (jsdom, aliases, coverage thresholds)
├── playwright.config.ts      # Visual regression config
├── eslint.config.js          # ESLint 9 flat config (TS + React + jsx-a11y)
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # HelmetProvider + BrowserRouter + LocaleProvider
│   ├── routes.tsx            # Route definitions (locale-prefixed public + admin)
│   ├── firebase.ts           # Firebase init (app, db, auth, storage)
│   ├── i18n/                 # LocaleProvider, useT, typed en/es dictionaries
│   ├── components/
│   │   ├── admin/            # Auth guard + schema-driven CollectionEditor
│   │   ├── animations/       # MockupAnimation — see Landmine 4
│   │   ├── backgrounds/      # Wave SVG stacks (WaveHero, WaveBody, …)
│   │   ├── blog/             # BlogPost markdown renderer, CodePenEmbed
│   │   ├── buttons/ cards/ common/ home/ layout/ news/ posts/ projects/ terms/ text/
│   ├── content/{en,es}/      # Markdown blog posts (YAML frontmatter)
│   ├── data/
│   │   ├── menuData.ts footerData.ts
│   │   ├── source/           # QueryDescriptor + Firestore/fixture data sources
│   │   ├── model/            # TypeScript interfaces
│   │   └── schema/           # CollectionSchema descriptors driving the admin
│   ├── hooks/                # useFirestoreCollection, useAuth, usePageTheme, useMediaQuery
│   ├── styles/               # globals.css (@theme + dark mode), blog.css
│   └── utils/                # parseFrontmatter, localized
├── tests/
│   ├── setup.ts  unit/  integration/
│   └── visual/               # Playwright specs; __screenshots__ is gitignored
├── content/seed/             # Bilingual Firestore seed JSON — the content source of
│                             # truth, and the fixture data for tests and the
│                             # visual baseline. One corpus, three consumers.
├── scripts/                  # seed, set-admin, generate-banners, upload-banners
└── public/                   # favicons, PWA icons, images, wave SVGs
```

---

## Coding Conventions

### TypeScript

- Strict mode. No `any` — use `unknown` or proper generics.
- `export default function ComponentName()` for components; props `interface` above it.

### Components

- Functional only. `clsx` for conditional classes (there is **no** `tailwind-merge`, so
  conflicting utilities resolve by CSS source order, not intent).

### Tailwind v4

- All theme config lives in `src/styles/globals.css` `@theme` blocks.
- Prefer utilities over `@apply`.
- Prefer the `@theme` tokens over hardcoded `style={{ background: "rgba(66,66,66,0.3)" }}`.
  That literal is the legacy "glass" colour and appears in several older components; new code
  should use the card tokens.

### Firebase (modular SDK)

- Always `import { getFirestore } from "firebase/firestore"`. Never compat or namespace imports.
- `useFirestoreCollection(collectionName, constraints)` — real-time subscription.
- `useAuth()` → `{ user, loading, error, signIn, signOut }`.
- Writes use `setDoc` with deterministic slug IDs where the schema says `idFrom: "slug"`, so
  the admin and `scripts/seed-firestore.mjs` agree on document identity.

### i18n

- All user-facing strings go through `useT()` against the typed dictionaries in `src/i18n/`.
  A missing key is a compile error.
- Firestore text goes through `pick()` in `src/utils/localized.ts`.
- Dates format with `Intl.DateTimeFormat(locale)` — never raw frontmatter strings.

### Testing

- Vitest specs live in `tests/` (not co-located).
- Use `vi.hoisted()` for mock variables referenced in `vi.mock()` factories, and mock Firebase
  modules at the top of the file **before** importing the component under test.
- Wrap in `<HelmetProvider>` + `<MemoryRouter>` + `<LocaleProvider>` when rendering.
- Shared fixtures come from `src/data/fixtures/`.
- MSW is **not** used — it cannot usefully intercept Firestore's WebChannel transport.

---

## Build & Run

```bash
npm install
npm run dev              # Dev server on :5173
npm run dev:fixtures     # Dev server with VITE_FIXTURES=1 (no Firebase credentials needed)
npm run build            # tsc --noEmit && vite build → dist/
npm run preview
npm test                 # Vitest
npm run test:coverage
npm run visual           # Visual regression against your local baseline
npm run visual:baseline  # (Re)generate the baseline — required on a fresh clone
npm run test:visual:update
npm run lint
npm run type-check
npm run format
npm run format:check
```

## Deployment

Two providers, split by concern:

| What                     | Where                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| Site hosting             | **Netlify** — project `lucferbux-webpage`, config in `netlify.toml` |
| Domain                   | `https://lucferbux.dev` (pointed at Netlify)                        |
| Firestore, Storage, Auth | **Firebase** — project `lucferbux-web-page`                         |

**Pushing to `main` deploys the site.** Netlify builds `npm run build` and
publishes `dist/`. There is no deploy workflow in `.github/workflows/`, and the
Firebase Hosting site on the same project is unused — do not add a `hosting`
block back to `firebase.json` or the site ends up served from two places.

`.github/workflows/ci.yml` runs format → lint → type-check → coverage → audit →
build on push and PR.

Firestore and Storage rules deploy separately, and **the order matters**:

```bash
npm run set-admin -- <your-email>   # grant the admin custom claim FIRST
npm run deploy:rules                # firestore rules + indexes + storage rules
```

The rules require `request.auth.token.admin == true`. Deploying them before the
claim exists denies every write, including from the admin UI. The claim only
reaches the browser after a fresh sign-in.

Environment variables (`.env`, see `.env.example`):
`VITE_FIREBASE_API` (note: not `_API_KEY`), `VITE_FIREBASE_AUTH_DOMAIN`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
Optional: `VITE_FIXTURES=1` to run entirely off local fixtures.
