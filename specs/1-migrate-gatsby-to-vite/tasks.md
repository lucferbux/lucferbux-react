# Tasks: Migrate Lucferbux Personal Website

**Input**: Design documents from `specs/1-migrate-gatsby-to-vite/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US8)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the Vite project alongside existing Gatsby code, install all target dependencies, and configure the build toolchain.

- [ ] T001 Initialize Vite project with React + TypeScript template: create `index.html`, `vite.config.ts`, update `tsconfig.json` for Vite compatibility
- [ ] T002 Install core dependencies: `react`, `react-dom`, `react-router-dom@7`, `firebase@11+`, `tailwindcss@4`, `@tailwindcss/vite`, `react-helmet-async`, `react-markdown`, `remark-gfm`, `rehype-prism-plus`, `vite-plugin-pwa`, `lottie-web`, `typewriter-effect`, `react-parallax-tilt`, `clsx`
- [ ] T003 [P] Install dev dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `msw`, `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`, `@types/react`, `@types/react-dom`
- [ ] T004 [P] Create `vitest.config.ts` with jsdom environment, setup files, and path aliases
- [ ] T005 [P] Create `tests/setup.ts` with RTL matchers and MSW server setup
- [ ] T006 [P] Create `.env.example` with `VITE_FIREBASE_API`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- [ ] T007 [P] Create `.env` (gitignored) with actual Firebase config values from current `gatsby-browser.js`
- [ ] T008 [P] Create `eslint.config.js` with React + TypeScript rules and Prettier integration
- [ ] T009 Update `package.json` scripts: `dev` → `vite`, `build` → `vite build`, `preview` → `vite preview`, `test` → `vitest`, `test:ui` → `vitest --ui`, `lint` → `eslint src/`, `type-check` → `tsc --noEmit`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story-specific component work begins.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T010 Create `src/main.tsx` entry point: render `<App />` into `#root` with `<BrowserRouter>` and `<HelmetProvider>`
- [ ] T011 Create `src/App.tsx` root component: Firebase initialization provider, route definitions, error boundary
- [ ] T012 Create `src/firebase.ts`: initialize Firebase app with modular SDK (`initializeApp`, `getFirestore`, `getAuth`) using `import.meta.env.VITE_*` variables
- [ ] T013 Create `src/routes.tsx`: define all routes (`/`, `/news`, `/posts`, `/projects`, `/privacy`, `/terms`, `/blog/:slug`, `/admin/*`, `*` → redirect to `/`)
- [ ] T014 [P] Install and configure Tailwind CSS v4: create `src/styles/globals.css` with `@import "tailwindcss"`, add `@tailwindcss/vite` plugin to `vite.config.ts`
- [ ] T015 [P] Create `tailwind.config.ts` with custom screens (xs:450px, sm:550px, md:650px, lg:750px, xl:1000px, 2xl:1234px, 3xl:1440px, 4xl:2500px), theme colors from `ColorStyles.ts`, and dark mode `media` strategy
- [ ] T016 [P] Create `src/styles/colors.ts`: export theme color tokens extracted from current `ColorStyles.ts` for programmatic use in components
- [ ] T017 [P] Copy `src/data/model/` (News.ts, Post.ts, Project.ts, Work.ts) to new structure — these remain unchanged
- [ ] T018 [P] Copy `src/data/menuData.ts` and `src/data/footerData.ts` — update imports (remove Gatsby `Link` references, use React Router `Link`)
- [ ] T019 Create custom Firestore hooks in `src/hooks/useFirestoreCollection.ts`: wrapper around `onSnapshot` + `collection` + `query` + `orderBy` + `where` + `limit` that returns `{ data, loading, error }` — replaces `useFirestoreCollectionData` from reactfire
- [ ] T020 [P] Create `src/hooks/useFirestoreDocument.ts`: single document hook for admin edit flows
- [ ] T021 [P] Create `src/components/common/LoadingSpinner.tsx`: reusable loading indicator with Tailwind
- [ ] T022 [P] Create `src/components/common/ErrorFallback.tsx`: reusable error boundary component with Tailwind
- [ ] T023 Copy all static assets: move `static/images/` to `public/images/`, move `src/assets/` to `src/assets/` (same path), move `src/content/` markdown files

**Checkpoint**: Foundation ready — Vite builds, routes resolve, Firebase connects, Tailwind generates styles.

---

## Phase 3: User Story 1 — Vite Project Scaffold & Core Layout Migration (Priority: P1) 🎯 MVP

**Goal**: The application shell (Layout, Header, Footer, SEO) renders correctly with React Router navigation on all routes.

**Independent Test**: `npm run dev` serves the app, all routes show the correct page shell with Header and Footer, navigation links work.

### Implementation for User Story 1

- [ ] T024 [US1] Migrate `src/components/layout/Layout.tsx`: replace Gatsby-specific imports, use Tailwind classes instead of styled-components, render `<Header>`, `<main>{children}</main>`, `<Footer>` with `<Outlet>` pattern from React Router
- [ ] T025 [US1] Migrate `src/components/layout/Header.tsx`: replace Gatsby `<Link>` with React Router `<Link>`, replace styled-components with Tailwind classes, preserve mobile collapse behavior, use `menuData` for nav items
- [ ] T026 [US1] Migrate `src/components/layout/Footer.tsx`: replace Gatsby `<Link>` with React Router `<Link>`, replace styled-components with Tailwind, use `footerData` for links, preserve wave background
- [ ] T027 [US1] Migrate `src/components/layout/SEO.tsx`: replace `react-helmet` with `react-helmet-async`, remove GraphQL `useStaticQuery`, pass site metadata as props or constants, preserve OpenGraph and Twitter Card meta tags
- [ ] T028 [P] [US1] Create `src/styles/layout.css`: migrate CSS reset from current `layout.css`, integrate with Tailwind `@layer base`
- [ ] T029 [US1] Create page shells for all routes in `src/pages/`: `HomePage.tsx`, `NewsPage.tsx`, `PostsPage.tsx`, `ProjectsPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `BlogPostPage.tsx`, `NotFoundPage.tsx` — each wraps content in `<Layout>` + `<SEO>`
- [ ] T030 [US1] Implement `NotFoundPage.tsx` (`/404`): redirect to `/` via `useNavigate()` in `useEffect`, matching current behavior
- [ ] T031 [US1] Wire all pages into `src/routes.tsx` with React Router `<Route>` elements

**Checkpoint**: App skeleton renders on all routes with Header, Footer, and correct navigation.

---

## Phase 4: User Story 2 — Styled-Components to Tailwind CSS Migration (Priority: P1)

**Goal**: All visual components use Tailwind CSS. Zero styled-components remain. Visual output matches the current site pixel-for-pixel.

**Independent Test**: Side-by-side visual comparison of every page, dark mode toggle, and responsive breakpoints matches the Gatsby version.

### Implementation for User Story 2

- [ ] T032 [P] [US2] Migrate `src/components/backgrounds/WaveHero.tsx`: replace styled-components with Tailwind classes, preserve dark mode SVG swap via `dark:` variant or CSS `content:` in globals.css
- [ ] T033 [P] [US2] Migrate `src/components/backgrounds/WaveBody.tsx`: Tailwind classes, dark mode support
- [ ] T034 [P] [US2] Migrate `src/components/backgrounds/WaveFooter.tsx`: Tailwind classes, dark mode support
- [ ] T035 [P] [US2] Migrate `src/components/backgrounds/WaveNewsHome.tsx`: Tailwind classes, dark mode support
- [ ] T036 [P] [US2] Migrate `src/components/backgrounds/WavePostHome.tsx`: Tailwind classes, dark mode support
- [ ] T037 [P] [US2] Migrate `src/components/backgrounds/WaveResumeeHome.tsx`: Tailwind classes, dark mode support
- [ ] T038 [P] [US2] Migrate `src/components/backgrounds/WaveShort.tsx`: Tailwind classes, dark mode support
- [ ] T039 [P] [US2] Migrate `src/components/buttons/NavButton.tsx`: replace Gatsby `<Link>` with React Router `<Link>`, Tailwind classes, preserve collapse behavior on mobile
- [ ] T040 [P] [US2] Migrate `src/components/buttons/NavButtonExternal.tsx`: Tailwind classes, preserve `target="_blank"` behavior
- [ ] T041 [P] [US2] Migrate `src/components/buttons/FlatButton.tsx`: Tailwind classes, preserve pill-shape and icon styling
- [ ] T042 [P] [US2] Migrate `src/components/buttons/FlatButtonLink.tsx`: replace Gatsby `<Link>` with React Router `<Link>`, Tailwind classes
- [ ] T043 [P] [US2] Migrate `src/components/buttons/SocialButton.tsx`: Tailwind classes, preserve gradient background and hover/active elevation effects
- [ ] T044 [P] [US2] Migrate `src/components/buttons/ResumeeButton.tsx`: Tailwind classes
- [ ] T045 [P] [US2] Migrate `src/components/cards/NewsCard.tsx`: Tailwind classes, replace GatsbyImage with native `<img>` with lazy loading, preserve loading GIF placeholder
- [ ] T046 [P] [US2] Migrate `src/components/cards/NewsCardCollapsed.tsx`: Tailwind classes, preserve overlaid text on image
- [ ] T047 [P] [US2] Migrate `src/components/cards/NewsCardDetail.tsx`: Tailwind classes, preserve RTL inversion for alternating layout, mobile/desktop component swap
- [ ] T048 [P] [US2] Migrate `src/components/cards/PostCard.tsx`: Tailwind classes, replace Gatsby `<Link>` with React Router `<Link>`, preserve blurred background image effect
- [ ] T049 [P] [US2] Migrate `src/components/cards/ProjectCard.tsx`: Tailwind classes, preserve version badge, FEATURED caption, and technology tags with icons
- [ ] T050 [P] [US2] Migrate `src/components/cards/ResumeeCard.tsx`: Tailwind classes, preserve two-column layout with scrollable work entries
- [ ] T051 [P] [US2] Migrate `src/components/cards/ResumeeCardRow.tsx`: Tailwind classes, preserve 3-line description clamp
- [ ] T052 [P] [US2] Migrate `src/components/cards/ResumeeHeader.tsx`: Tailwind classes, replace GatsbyImage with native `<img>` for avatar
- [ ] T053 [P] [US2] Migrate `src/components/text/InfoBox.tsx`: Tailwind classes, preserve darkColor prop behavior
- [ ] T054 [P] [US2] Migrate `src/components/animations/MockupAnimation.tsx`: Tailwind classes, replace GatsbyImage/GraphQL with native `<img>` imports, preserve CSS positioning
- [ ] T055 [P] [US2] Migrate `src/components/home/HeroSection.tsx`: Tailwind classes, preserve typewriter effect and social links
- [ ] T056 [P] [US2] Migrate `src/components/home/NewsSectionHome.tsx`: Tailwind classes, update Firestore hook to new custom hook, preserve horizontal scroll
- [ ] T057 [P] [US2] Migrate `src/components/home/PostsProjectSection.tsx`: Tailwind classes, update Firestore hook, preserve parallax tilt on PostCard
- [ ] T058 [P] [US2] Migrate `src/components/home/AboutMeSection.tsx`: Tailwind classes, update Firestore hook
- [ ] T059 [P] [US2] Migrate `src/components/news/NewsSection.tsx`: Tailwind classes, update Firestore hook, preserve alternating inversion layout
- [ ] T060 [P] [US2] Migrate `src/components/posts/PostSection.tsx`: Tailwind classes, update Firestore hook
- [ ] T061 [P] [US2] Migrate `src/components/projects/ProjectSection.tsx`: Tailwind classes, update Firestore hook, preserve responsive grid (4→3→2→1 columns)
- [ ] T062 [P] [US2] Migrate `src/components/terms/PrivacySection.tsx`: Tailwind classes
- [ ] T063 [P] [US2] Migrate `src/components/terms/TermsSection.tsx`: Tailwind classes
- [ ] T064 [US2] Remove all styled-components files: delete `src/components/styles/GlobalStyle.ts`, `src/components/styles/ColorStyles.ts`, `src/components/styles/TextStyles.ts`
- [ ] T065 [US2] Remove `styled-components`, `babel-plugin-styled-components`, `gatsby-plugin-styled-components`, `@types/styled-components` from `package.json`

**Checkpoint**: Every page visually matches the current site. `grep -r "styled-components" src/` returns zero results.

---

## Phase 5: User Story 3 — Firebase SDK Modernization (Priority: P2)

**Goal**: Firebase SDK v8 + reactfire v3 fully replaced with Firebase JS SDK v11+ modular imports. All Firestore queries work.

**Independent Test**: All four collection pages (News, Posts, Projects, Home with About Me) display live Firestore data correctly.

### Implementation for User Story 3

- [ ] T066 [US3] Finalize `src/firebase.ts`: ensure modular initialization with `initializeApp`, `getFirestore`, `getAuth` using `import.meta.env` variables
- [ ] T067 [US3] Update `src/hooks/useFirestoreCollection.ts`: verify all query patterns used in the app (orderBy, where, limit) work with modular SDK
- [ ] T068 [US3] Update all home section components to use new Firestore hooks: `NewsSectionHome` (limit 6 from `intro`), `PostsProjectSection` (1 post + 2 featured projects), `AboutMeSection` (work from `team`)
- [ ] T069 [US3] Update `NewsSection.tsx` to use new Firestore hook (all from `intro`, orderBy timestamp desc)
- [ ] T070 [US3] Update `PostSection.tsx` to use new Firestore hook (all from `patent`, orderBy date desc)
- [ ] T071 [US3] Update `ProjectSection.tsx` to use new Firestore hook (all from `project`, orderBy date desc)
- [ ] T072 [US3] Remove `reactfire` and `firebase@8` from `package.json`, remove `gatsby-browser.js` and `gatsby-ssr.js` Firebase wrapper code
- [ ] T073 [US3] Remove SSR guards (`typeof window === "undefined"` checks) — no longer needed in SPA

**Checkpoint**: All data-driven pages show live Firestore content. No `reactfire` or Firebase v8 imports remain.

---

## Phase 6: User Story 4 — Markdown Blog Migration (Priority: P2)

**Goal**: Blog posts render from local markdown files with syntax highlighting and proper styling, without Gatsby's markdown pipeline.

**Independent Test**: Navigate to `/blog/first-steps-redux`, `/blog/markdown-blog-gatsby`, `/blog/react-solid` — content renders correctly with code highlighting.

### Implementation for User Story 4

- [ ] T074 [P] [US4] Configure Vite to import `.md` files as raw strings: add `assetsInclude` or a custom plugin in `vite.config.ts`
- [ ] T075 [US4] Create `src/components/blog/BlogPost.tsx`: accept slug parameter, dynamically import the matching markdown file, parse frontmatter (title, date, featuredImage), render with `react-markdown` + `remark-gfm` + `rehype-prism-plus`
- [ ] T076 [P] [US4] Create `src/styles/blog.css`: define CSS classes matching current markdown class mappings (title-blog, subtitle-blog, paragraph-blog, link-blog, list-blog-unordered, list-blog-ordered, image-container-blog, strong-blog) using Tailwind `@apply` directives
- [ ] T077 [US4] Create `src/pages/BlogPostPage.tsx`: read `:slug` from route params, pass to `BlogPost` component, wrap in Layout + SEO + WaveBody background
- [ ] T078 [US4] Add CodePen embed support: create a custom rehype plugin or component that renders CodePen iframes from markdown links

**Checkpoint**: All 3 blog posts render with correct formatting, syntax highlighting, and CodePen embeds.

---

## Phase 7: User Story 5 — Testing Improvements & CI/CD (Priority: P2)

**Goal**: Comprehensive test suite with Vitest, all existing tests migrated and passing, new tests added, enhanced CI/CD pipeline.

**Independent Test**: `npm run test` passes with >30 test cases. CI pipeline runs lint, type-check, test, and build.

### Implementation for User Story 5

- [ ] T079 [P] [US5] Migrate `cards/__tests__/NewsCardTest.tsx` to `tests/unit/components/NewsCard.test.tsx`: update for Vitest, remove Gatsby mocks, use React Router `MemoryRouter`
- [ ] T080 [P] [US5] Migrate `cards/__tests__/PostCardTest.tsx` to `tests/unit/components/PostCard.test.tsx`
- [ ] T081 [P] [US5] Migrate `cards/__tests__/ProjectCardTest.tsx` to `tests/unit/components/ProjectCard.test.tsx`
- [ ] T082 [P] [US5] Migrate `layout/__tests__/HeaderTest.tsx` to `tests/unit/components/Header.test.tsx`
- [ ] T083 [P] [US5] Migrate `layout/__tests__/SEOTest.tsx` to `tests/unit/components/SEO.test.tsx`
- [ ] T084 [P] [US5] Create new unit test `tests/unit/components/Footer.test.tsx`: verify footer links, wave background rendering
- [ ] T085 [P] [US5] Create new unit test `tests/unit/components/InfoBox.test.tsx`: verify title, description, CTA button rendering
- [ ] T086 [P] [US5] Create new unit test `tests/unit/components/HeroSection.test.tsx`: verify typewriter text, social links
- [ ] T087 [P] [US5] Create new unit test `tests/unit/components/MockupAnimation.test.tsx`: verify all animation images render
- [ ] T088 [P] [US5] Create new unit tests for button components: `tests/unit/components/NavButton.test.tsx`, `tests/unit/components/SocialButton.test.tsx`, `tests/unit/components/FlatButton.test.tsx`
- [ ] T089 [P] [US5] Create new unit test `tests/unit/hooks/useFirestoreCollection.test.ts`: verify loading, data, error states with mocked Firestore
- [ ] T090 [P] [US5] Create `tests/mocks/firebase.ts` and `tests/mocks/handlers.ts`: MSW handlers for mocking Firestore REST API responses
- [ ] T091 [P] [US5] Create integration test `tests/integration/HomePage.test.tsx`: verify all four home sections render with mocked Firestore data
- [ ] T092 [P] [US5] Create integration test `tests/integration/NewsPage.test.tsx`: verify news list renders with mocked data
- [ ] T093 [P] [US5] Create integration test `tests/integration/PostsPage.test.tsx`: verify posts list renders with mocked data
- [ ] T094 [P] [US5] Create integration test `tests/integration/ProjectsPage.test.tsx`: verify projects grid renders with mocked data
- [ ] T095 [US5] Update `.github/workflows/ci.yml` (rename from `testing.yml`): add steps for lint (`eslint`), type-check (`tsc --noEmit`), test (`vitest run`), build (`vite build`), with Node.js 20+
- [ ] T096 [US5] Create `.github/workflows/deploy.yml`: deploy to Firebase Hosting on merge to `main` after CI passes

**Checkpoint**: `npm run test` reports >30 passing tests. CI pipeline runs all 4 steps on PRs.

---

## Phase 8: User Story 6 — PWA & SEO Preservation (Priority: P3)

**Goal**: Site functions as a PWA with correct manifest, service worker, and SEO metadata.

**Independent Test**: Lighthouse PWA ≥ 90, site installs as PWA, meta tags present on all pages.

### Implementation for User Story 6

- [ ] T097 [P] [US6] Configure `vite-plugin-pwa` in `vite.config.ts`: manifest (name: "Lucferbux Web", short_name: "Lucferbux", theme_color: "#CA8F36", background_color: "#F2F6FF", display: "standalone"), workbox runtime caching, icon configuration
- [ ] T098 [P] [US6] Move and update PWA icons: ensure `static/images/logos/logo-icon.svg` is referenced correctly, add PNG icons at required sizes (192x192, 512x512)
- [ ] T099 [US6] Create `public/noscript.html` or inline `<noscript>` block in `index.html`: preserve the JavaScript-required message with gold gradient background from current `gatsby-ssr.js`
- [ ] T100 [US6] Verify and update SEO component: ensure all pages pass correct title, description, OpenGraph, and Twitter Card meta tags to `react-helmet-async`
- [ ] T101 [US6] Test PWA functionality: verify installability, offline cache, and manifest correctness

**Checkpoint**: Lighthouse PWA audit ≥ 90. Site installs on mobile. All pages have correct meta tags.

---

## Phase 9: User Story 7 — Agentic Configuration (Priority: P3)

**Goal**: Repository includes comprehensive AI agent configuration files.

**Independent Test**: `AGENTS.md` and `.github/copilot-instructions.md` contain accurate, complete information about the target stack.

### Implementation for User Story 7

- [ ] T102 [P] [US7] Create `AGENTS.md` at repo root: project description, target tech stack (Vite + React + Tailwind + Firebase v11+), directory structure, component patterns, Firebase integration patterns, testing conventions, commit conventions, Tailwind usage guidelines
- [ ] T103 [P] [US7] Create `.github/copilot-instructions.md`: Copilot-specific instructions for code generation (component structure, Tailwind class patterns, Firebase hook usage, TypeScript strict mode, test file conventions)
- [ ] T104 [US7] Update `README.md`: reflect new tech stack, development setup instructions (Vite commands), deployment process, contribution guidelines

**Checkpoint**: AI agents can understand and contribute to the project using the configuration files.

---

## Phase 10: User Story 8 — Admin Section with Firebase Auth (Priority: P4)

**Goal**: Protected admin area with CRUD for all Firestore collections.

**Independent Test**: Login at `/admin` → dashboard → create/read/update/delete news items, posts, projects, and work entries.

### Implementation for User Story 8

- [ ] T105 [US8] Create `src/hooks/useAuth.ts`: Firebase Auth hook wrapping `onAuthStateChanged`, `signInWithEmailAndPassword`, `signOut` — returns `{ user, loading, signIn, signOut }`
- [ ] T106 [US8] Create `src/components/admin/LoginForm.tsx`: email/password form, error display, loading state, Tailwind-styled
- [ ] T107 [US8] Create `src/components/admin/AdminLayout.tsx`: protected layout that checks auth state, redirects to login if unauthenticated, renders admin nav + `<Outlet>`
- [ ] T108 [US8] Create `src/components/admin/Dashboard.tsx`: overview page with links to manage each collection (News, Posts, Projects, Work), item counts
- [ ] T109 [P] [US8] Create `src/components/admin/NewsEditor.tsx`: list all news from `intro` collection, create/edit form (title, title_en, description, description_en, url, image, timestamp), delete with confirmation
- [ ] T110 [P] [US8] Create `src/components/admin/PostEditor.tsx`: list all posts from `patent` collection, create/edit form (title, title_en, description, description_en, link, image, date, internalLink), delete with confirmation
- [ ] T111 [P] [US8] Create `src/components/admin/ProjectEditor.tsx`: list all projects from `project` collection, create/edit form (title, title_en, description, description_en, link, tags, featured, date, version), delete with confirmation
- [ ] T112 [P] [US8] Create `src/components/admin/WorkEditor.tsx`: list all work entries from `team` collection, create/edit form (avatar, icon, name, name_en, description, description_en, job, job_en, importance), delete with confirmation
- [ ] T113 [US8] Add admin routes in `src/routes.tsx`: `/admin` (login), `/admin/dashboard`, `/admin/news`, `/admin/posts`, `/admin/projects`, `/admin/work` — all wrapped in `AdminLayout` protection
- [ ] T114 [P] [US8] Create unit tests: `tests/unit/hooks/useAuth.test.ts`, `tests/unit/components/LoginForm.test.tsx`
- [ ] T115 [P] [US8] Create integration test `tests/integration/AdminFlow.test.tsx`: verify login → dashboard → CRUD flow with mocked Firebase Auth and Firestore
- [ ] T116 [US8] Configure Firebase Auth in Firebase Console: enable email/password provider, create initial admin user

**Checkpoint**: Admin section fully functional. Login, CRUD for all 4 collections, logout all working.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, removing all Gatsby artifacts, and validating the complete migration.

- [ ] T117 [P] Remove Gatsby files: `gatsby-config.js`, `gatsby-node.js`, `gatsby-browser.js`, `gatsby-ssr.js`
- [ ] T118 [P] Remove Jest/Gatsby test files: `jest-preprocess.js`, `jest.config.js`, `loadershim.js`, `setup-test-env.js`, `__mocks__/gatsby.js`, `__mocks__/file-mock.js`
- [ ] T119 Remove Gatsby dependencies from `package.json`: all `gatsby-*` packages, `babel-plugin-styled-components`, `babel-preset-gatsby`, `babel-jest`, `jest`, `jest-environment-jsdom`, `identity-obj-proxy`, `react-test-renderer`, `prop-types`, `react-helmet`, `react-device-detect`
- [ ] T120 Remove `src/components/test/FirebaseTest.tsx` debug utility
- [ ] T121 [P] Remove old styled-components files if any remain, verify with `grep -r "styled-components\|from.*styled" src/`
- [ ] T122 [P] Remove old Gatsby build output: `public/` directory (Vite outputs to `dist/`)
- [ ] T123 Clean up TypeScript: run `tsc --noEmit` and fix any remaining type errors
- [ ] T124 Run full test suite: `npm run test` — all tests must pass
- [ ] T125 Run production build: `npm run build` — verify bundle size < 500KB gzipped
- [ ] T126 Run Lighthouse audit: verify Performance ≥ 90, PWA ≥ 90
- [ ] T127 Visual regression check: compare every page route against screenshots of current Gatsby site
- [ ] T128 Deploy to Firebase Hosting: `npm run deploy` — verify live site works correctly
- [ ] T129 Update `.specify/memory/constitution.md` if any principles evolved during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 Scaffold (Phase 3)**: Depends on Phase 2
- **US2 Tailwind (Phase 4)**: Depends on Phase 2, can be worked in parallel with US1
- **US3 Firebase (Phase 5)**: Depends on Phase 2, benefits from US1 being done but not blocked
- **US4 Blog (Phase 6)**: Depends on Phase 2, independent of other stories
- **US5 Testing (Phase 7)**: Depends on Phase 2, benefits from US1-US4 completion for integration tests
- **US6 PWA/SEO (Phase 8)**: Depends on US1 (routing) and US2 (styling)
- **US7 Agentic (Phase 9)**: Can start after Phase 2, no code dependencies
- **US8 Admin (Phase 10)**: Depends on US1, US2, US3 (full migration must be stable)
- **Polish (Phase 11)**: Depends on ALL user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    └── Phase 2 (Foundation)
         ├── US1 (Scaffold) ─────────────────────┐
         ├── US2 (Tailwind) ─────── parallel ─────┤
         ├── US3 (Firebase) ─────── parallel ─────┤
         ├── US4 (Blog) ─────────── parallel ─────┤
         ├── US7 (Agentic) ──────── parallel ─────┤
         │                                        │
         │   US6 (PWA/SEO) ── after US1 + US2 ───┤
         │   US5 (Testing) ── after US1-US4 ──────┤
         │                                        │
         │   US8 (Admin) ──── after US1+US2+US3 ──┤
         │                                        │
         └── Phase 11 (Polish) ── after ALL ──────┘
```

### Within Each User Story

- Models/hooks before components
- Core components before composite components
- Implementation before cleanup/deletion
- All story tasks complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T003-T008 all run in parallel
- **Phase 2**: T014-T023 all run in parallel
- **Phase 4 (US2)**: All component migration tasks (T032-T063) can run in parallel — each is a separate file
- **Phase 5 (US3)**: T068-T071 can run in parallel after T066-T067
- **Phase 6 (US4)**: T074, T076 in parallel
- **Phase 7 (US5)**: All test creation tasks (T079-T094) can run in parallel
- **Phase 10 (US8)**: Editor components (T109-T112) can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 3)

1. Complete Phase 1: Setup (Vite + dependencies)
2. Complete Phase 2: Foundation (routing, Firebase, Tailwind, hooks)
3. Complete Phase 3: US1 — Scaffold (Layout, Header, Footer, SEO, pages)
4. Complete Phase 4: US2 — Tailwind migration (all components)
5. Complete Phase 5: US3 — Firebase v11+ (modular SDK)
6. **STOP and VALIDATE**: App should look and function identically to current site
7. Deploy MVP to Firebase Hosting

### Incremental Delivery After MVP

8. US4: Blog migration → blog posts work
9. US5: Testing → comprehensive test coverage
10. US6: PWA/SEO → production-ready
11. US7: Agentic config → AI agent support
12. US8: Admin section → content management
13. Phase 11: Polish → clean repo, final validation

---

## Notes

- [P] tasks = different files, no dependencies — safe for parallel execution
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total tasks: 129
- Estimated parallel opportunities: ~60% of tasks can run in parallel within their phase
