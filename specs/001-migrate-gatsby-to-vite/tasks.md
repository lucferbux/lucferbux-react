# Tasks: Migrate Lucferbux Personal Website

**Input**: Design documents from `/specs/001-migrate-gatsby-to-vite/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: Included — US5 explicitly requests testing improvements and CI/CD.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize Vite + React + TypeScript project skeleton with tooling configuration

- [ ] T001 Initialize Vite 6+ project with React + TypeScript template and install core dependencies (react, react-dom, react-router, react-helmet-async, clsx) in package.json
- [ ] T002 Create vite.config.ts with React plugin, path aliases (@/ → src/), and build output to dist/
- [ ] T003 Create index.html entry point at project root with `<div id="root">` and script tag pointing to src/main.tsx
- [ ] T004 Create src/main.tsx with ReactDOM.createRoot rendering the App component
- [ ] T005 [P] Create .env.example with VITE_FIREBASE_API, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
- [ ] T006 [P] Update tsconfig.json for Vite (moduleResolution: bundler, target: ES2020, paths alias @/ → src/*, include src/)
- [ ] T007 [P] Configure package.json scripts: dev, build, preview, type-check (tsc --noEmit), lint, format, deploy (`firebase deploy --only hosting`)
- [ ] T007b [P] Install and configure ESLint with typescript-eslint and eslint-config-prettier; create eslint.config.js (flat config format) with TypeScript + React rules

**Checkpoint**: `npm run dev` starts Vite dev server, `npm run build` produces output in dist/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Install and configure Tailwind CSS v4 with @tailwindcss/vite plugin in vite.config.ts
- [ ] T009 [P] Define custom breakpoints (xs: 450px, sm: 550px, md: 650px, lg: 750px, xl: 1000px, 2xl: 1234px, 3xl: 1440px, 4xl: 2500px) and theme colors (primary #CA8F36, background light/dark, card light/dark) in src/styles/globals.css using Tailwind v4 `@theme` directive — NO tailwind.config.ts file
- [ ] T010 [P] Create src/styles/globals.css with `@import "tailwindcss"` (Tailwind v4 syntax), CSS reset, dark mode CSS custom properties via `@theme`, custom @keyframes animations (fadein, floating, etc.), and a `prefers-color-scheme: light` fallback ensuring correct light-theme defaults when no dark-mode preference is set
- [ ] T011 Set up React Router v7 in src/App.tsx wrapping routes with HelmetProvider, BrowserRouter, and Layout component
- [ ] T012 Create src/routes.tsx with all route definitions: / (Home), /news, /posts, /projects, /privacy, /terms, /blog/:slug, and * → Navigate to /. **Note**: /admin/* routes are defined separately in T107 (US8) to keep Phase 2 free of auth concerns
- [ ] T013 [P] Initialize Firebase modular SDK v11+ in src/firebase.ts (initializeApp, getFirestore, getAuth with environment variables)
- [ ] T014 [P] Migrate data models to src/data/model/News.ts, src/data/model/Post.ts, src/data/model/Project.ts, src/data/model/Work.ts updating Timestamp imports to firebase/firestore modular
- [ ] T015 [P] Create src/data/menuData.ts with navigation items (News, Projects, Posts) and src/data/footerData.ts with footer links
- [ ] T016 [P] Create src/components/common/LoadingSpinner.tsx with Tailwind spinner animation
- [ ] T017 [P] Create src/components/common/ErrorFallback.tsx with error message and retry button using Tailwind
- [ ] T018 [P] Create src/styles/colors.ts with theme color tokens for programmatic use (matching tailwind.config.ts values)
- [ ] T019 [P] Create src/hooks/useMediaQuery.ts custom hook for responsive breakpoint detection

**Checkpoint**: Foundation ready — Tailwind renders, Firebase initializes, Router resolves routes, data models compile. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Vite Project Scaffold & Core Layout Migration (Priority: P1) 🎯 MVP

**Goal**: Replace Gatsby with Vite + React Router. The app skeleton renders with Header, Footer, and all routes resolve to correct page shells.

**Independent Test**: `npm run dev` starts the app. Navigate to /, /news, /posts, /projects, /privacy, /terms — each shows Layout with Header + Footer. Unknown routes redirect to /.

### Implementation for User Story 1

- [ ] T020 [US1] Create src/components/layout/Layout.tsx with Header, Outlet (react-router), Footer composition and dark mode body class management
- [ ] T021 [P] [US1] Create src/components/layout/Header.tsx with logo, navigation links from menuData.ts, mobile collapse behavior using Tailwind responsive classes
- [ ] T022 [P] [US1] Create src/components/layout/Footer.tsx with navigation links from footerData.ts, privacy/terms links, social buttons, and copyright text using Tailwind
- [ ] T023 [P] [US1] Create src/components/layout/SEO.tsx using react-helmet-async with configurable title, description, OpenGraph, and Twitter Card meta tags. **Scope**: This task creates the reusable SEO component; per-page unique metadata is applied in T095 (US6)
- [ ] T024 [P] [US1] Create src/pages/HomePage.tsx shell importing HeroSection, NewsSectionHome, PostsProjectSection, AboutMeSection placeholders
- [ ] T025 [P] [US1] Create src/pages/NewsPage.tsx shell with SEO and NewsSection placeholder
- [ ] T026 [P] [US1] Create src/pages/PostsPage.tsx shell with SEO and PostSection placeholder
- [ ] T027 [P] [US1] Create src/pages/ProjectsPage.tsx shell with SEO and ProjectSection placeholder
- [ ] T028 [P] [US1] Create src/pages/PrivacyPage.tsx shell with SEO and PrivacySection placeholder
- [ ] T029 [P] [US1] Create src/pages/TermsPage.tsx shell with SEO and TermsSection placeholder
- [ ] T030 [P] [US1] Create src/pages/BlogPostPage.tsx shell with useParams for :slug and BlogPost placeholder
- [ ] T031 [P] [US1] Create src/pages/NotFoundPage.tsx that redirects to / using Navigate component
- [ ] T032 [US1] Wire all page components into src/routes.tsx and verify every route renders inside Layout

**Checkpoint**: All 8 routes render correct page shells inside Layout. Header shows logo + 3 nav links. Footer shows links and copyright. 404 redirects to /.

---

## Phase 4: User Story 2 — Styled-Components to Tailwind CSS Migration (Priority: P1)

**Goal**: Every visual component uses Tailwind CSS utility classes. Zero styled-components remain. Visual output is visually consistent with the current Gatsby site (verified by manual side-by-side review at each breakpoint).

**Independent Test**: Compare each page visually against the current site. Toggle OS dark mode — all components switch correctly. Test at breakpoints 450px, 650px, 1000px, 1440px.

### Implementation for User Story 2

- [ ] T033 [P] [US2] Install lottie-react and react-tilt as dependencies, then create src/components/home/HeroSection.tsx with Tailwind — Lottie animation (lottie-react), typewriter effect, parallax tilt (react-tilt), and responsive layout
- [ ] T034 [P] [US2] Create src/components/backgrounds/WaveHero.tsx with Tailwind — SVG wave with dark mode color switching
- [ ] T035 [P] [US2] Create src/components/backgrounds/WaveBody.tsx, WaveFooter.tsx, WaveNewsHome.tsx, WavePostHome.tsx, WaveResumeeHome.tsx, WaveShort.tsx with Tailwind and dark mode support
- [ ] T036 [P] [US2] Create src/components/buttons/NavButton.tsx and NavButtonExternal.tsx with Tailwind — icon + text, responsive collapse at xs breakpoint
- [ ] T037 [P] [US2] Create src/components/buttons/FlatButton.tsx, FlatButtonLink.tsx, SocialButton.tsx, ResumeeButton.tsx with Tailwind
- [ ] T038 [P] [US2] Create src/components/cards/NewsCard.tsx with Tailwind — image, title_en, description_en, url link, hover effects
- [ ] T039 [P] [US2] Create src/components/cards/NewsCardCollapsed.tsx and NewsCardDetail.tsx with Tailwind
- [ ] T040 [P] [US2] Create src/components/cards/PostCard.tsx with Tailwind — image, title_en, description_en, link, optional internalLink
- [ ] T041 [P] [US2] Create src/components/cards/ProjectCard.tsx with Tailwind — image, title_en, description_en, tags array, link
- [ ] T042 [P] [US2] Create src/components/cards/ResumeeCard.tsx, ResumeeCardRow.tsx, and ResumeeHeader.tsx with Tailwind — avatar, name_en, job_en, description_en
- [ ] T043 [P] [US2] Create src/components/home/NewsSectionHome.tsx with Tailwind — grid of NewsCard items with wave background
- [ ] T044 [P] [US2] Create src/components/home/PostsProjectSection.tsx with Tailwind — latest post + featured projects layout
- [ ] T045 [P] [US2] Create src/components/home/AboutMeSection.tsx with Tailwind — work experience timeline with ResumeeCards
- [ ] T046 [P] [US2] Create src/components/news/NewsSection.tsx with Tailwind — full news list with NewsCardCollapsed items
- [ ] T047 [P] [US2] Create src/components/posts/PostSection.tsx with Tailwind — post grid with PostCard items
- [ ] T048 [P] [US2] Create src/components/projects/ProjectSection.tsx with Tailwind — project grid with ProjectCard items
- [ ] T049 [P] [US2] Create src/components/text/InfoBox.tsx with Tailwind — icon + title + description informational box
- [ ] T050 [P] [US2] Create src/components/terms/PrivacySection.tsx and src/components/terms/TermsSection.tsx with Tailwind — legal content layout
- [ ] T051 [P] [US2] Create src/components/animations/MockupAnimation.tsx with Tailwind — animated device mockup with parallax
- [ ] T052 [US2] Verify dark mode across all components — toggle prefers-color-scheme, validate backgrounds, text, cards, waves, and buttons switch correctly
- [ ] T053 [US2] Verify responsive behavior at all breakpoints (450px, 550px, 650px, 750px, 1000px, 1234px, 1440px) — header collapse, grid layouts, typography scaling

**Checkpoint**: Every component uses Tailwind. `grep -r "styled-components" src/` returns zero results. Visual comparison with current site shows no regressions.

---

## Phase 5: User Story 3 — Firebase SDK Modernization (Priority: P2)

**Goal**: All Firestore data fetching uses Firebase JS SDK v11+ modular imports. reactfire is removed. Real-time data flows work for all four collections.

**Independent Test**: Home page loads news (6), projects (2 featured), post (1 latest), work (all). News/Posts/Projects pages show all items from their respective collections.

### Implementation for User Story 3

- [ ] T054 [P] [US3] Create src/hooks/useFirestoreCollection.ts generic hook with onSnapshot, typed generics, loading/error states, and optional QueryConstraint[] parameter
- [ ] T055 [P] [US3] Create src/hooks/useFirestoreDocument.ts generic hook for single document fetching with getDoc
- [ ] T056 [US3] Wire NewsSectionHome.tsx to Firestore — collection("intro"), orderBy("timestamp", "desc"), limit(6) via useFirestoreCollection<News>
- [ ] T057 [US3] Wire PostsProjectSection.tsx to Firestore — collection("patent") orderBy("date", "desc") limit(1) and collection("project") where("featured", "==", true) limit(2)
- [ ] T058 [US3] Wire AboutMeSection.tsx to Firestore — collection("team"), orderBy("importance", "asc") via useFirestoreCollection<Work>
- [ ] T059 [US3] Wire NewsSection.tsx (NewsPage) to Firestore — collection("intro"), orderBy("timestamp", "desc") via useFirestoreCollection<News>
- [ ] T060 [US3] Wire PostSection.tsx (PostsPage) to Firestore — collection("patent"), orderBy("date", "desc") via useFirestoreCollection<Post>
- [ ] T061 [US3] Wire ProjectSection.tsx (ProjectsPage) to Firestore — collection("project"), orderBy("date", "desc") via useFirestoreCollection<Project>
- [ ] T062 [US3] Add LoadingSpinner and ErrorFallback states to all Firestore-connected components for graceful degradation. Use native `loading="lazy"` on `<img>` elements and constrain max-dimensions for large images
- [ ] T063 [US3] Remove reactfire dependency from package.json and verify zero reactfire imports remain

**Checkpoint**: All pages display live Firestore data. Browser console shows zero Firebase errors. `npm ls reactfire` returns empty.

---

## Phase 6: User Story 4 — Markdown Blog Migration (Priority: P2)

**Goal**: Blog posts render at /blog/:slug with markdown content, syntax highlighting, and CodePen embeds, replacing Gatsby's markdown pipeline.

**Independent Test**: Navigate to /blog/first-steps-redux, /blog/markdown-blog-gatsby, /blog/react-solid — each shows title, date, featured image, and formatted content with syntax highlighting.

### Implementation for User Story 4

- [ ] T064 [P] [US4] Install react-markdown, remark-gfm, rehype-prism-plus, and gray-matter as dependencies in package.json
- [ ] T065 [P] [US4] Create src/components/blog/BlogPost.tsx with react-markdown rendering, remark-gfm for GitHub Flavored Markdown, and rehype-prism-plus for syntax highlighting
- [ ] T066 [US4] Implement frontmatter parsing and markdown loading in src/pages/BlogPostPage.tsx using Vite ?raw imports and gray-matter, mapping :slug param to src/content/*.md files. **⚠️ Slug resolution MUST use the `slug` field from gray-matter frontmatter, NOT the filename** (e.g., file `first-step-redux.md` has slug `/first-steps-redux`)
- [ ] T067 [US4] Create custom rehype plugin or BlogPost subcomponent for CodePen embed detection — converts CodePen URLs to responsive iframes
- [ ] T068 [US4] Create src/styles/blog.css with PrismJS-compatible syntax highlighting theme, markdown element styling (headings, paragraphs, lists, links, images, blockquotes, tables, code blocks)
- [ ] T069 [US4] Verify all 3 blog posts render correctly: /blog/first-steps-redux, /blog/markdown-blog-gatsby, /blog/react-solid — validate title, date, featured image, code highlighting, and link behavior
- [ ] T070 [US4] Handle invalid blog slugs — redirect to NotFoundPage when no matching markdown file exists

**Checkpoint**: All 3 blog posts render with correct formatting, syntax highlighting, and CodePen embeds. Invalid slugs redirect to /.

---

## Phase 7: User Story 5 — Testing Improvements & CI/CD (Priority: P2)

**Goal**: Comprehensive test suite with Vitest + React Testing Library. CI/CD pipeline validates every PR with lint, type-check, test, and build steps.

**Independent Test**: `npm run test` passes all tests (>30 test cases). CI workflow runs successfully on push/PR.

### Implementation for User Story 5

- [ ] T071 [P] [US5] Install vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, and msw as devDependencies in package.json
- [ ] T072 [P] [US5] Create vitest.config.ts with jsdom environment, setup file path, coverage configuration, and path alias matching vite.config.ts
- [ ] T073 [P] [US5] Create tests/setup.ts importing @testing-library/jest-dom matchers and configuring MSW server (beforeAll/afterEach/afterAll)
- [ ] T074 [P] [US5] Create tests/mocks/firebase.ts with mock implementations for initializeApp, getFirestore, collection, query, onSnapshot, getDocs
- [ ] T075 [P] [US5] Create tests/mocks/handlers.ts with MSW handlers simulating Firestore REST responses for intro, patent, project, and team collections
- [ ] T076 [P] [US5] Migrate and create tests/unit/components/NewsCard.test.tsx — verify rendering with News props, link behavior, image display
- [ ] T077 [P] [US5] Migrate and create tests/unit/components/PostCard.test.tsx — verify rendering with Post props, link behavior, optional internalLink
- [ ] T078 [P] [US5] Migrate and create tests/unit/components/ProjectCard.test.tsx — verify rendering with Project props, tags display, link behavior
- [ ] T079 [P] [US5] Migrate and create tests/unit/components/Header.test.tsx — verify logo, nav links, responsive behavior
- [ ] T080 [P] [US5] Migrate and create tests/unit/components/SEO.test.tsx — verify meta tags render correctly with react-helmet-async
- [ ] T081 [P] [US5] Create tests/unit/components/Footer.test.tsx — verify footer links, privacy/terms links, social buttons
- [ ] T082 [P] [US5] Create tests/unit/components/InfoBox.test.tsx — verify icon, title, description rendering
- [ ] T083 [P] [US5] Create tests/unit/hooks/useFirestoreCollection.test.ts — verify data fetching, loading states, error handling with mocked Firebase
- [ ] T084 [P] [US5] Create tests/integration/HomePage.test.tsx — verify all home sections render with mocked Firestore data
- [ ] T085 [P] [US5] Create tests/integration/NewsPage.test.tsx — verify news list renders with mocked data
- [ ] T086 [P] [US5] Create tests/integration/PostsPage.test.tsx — verify posts grid renders with mocked data
- [ ] T087 [P] [US5] Create tests/integration/ProjectsPage.test.tsx — verify projects grid renders with mocked data
- [ ] T088 [US5] Create .github/workflows/ci.yml — trigger on push/PR to main, steps: checkout, setup Node 20, npm ci, lint, type-check, test, build
- [ ] T089 [P] [US5] Create .github/workflows/deploy.yml — trigger on push to main after CI passes, deploy dist/ to Firebase Hosting
- [ ] T090 [US5] Add test and test:coverage scripts to package.json, verify `npm run test` passes all >30 test cases

**Checkpoint**: `npm run test` passes all tests. CI pipeline runs lint → type-check → test → build. All 5 existing test suites migrated and passing.

---

## Phase 8: User Story 6 — PWA & SEO Preservation (Priority: P3)

**Goal**: Site functions as a Progressive Web App with offline capabilities, installability, and correct SEO metadata on all pages.

**Independent Test**: Lighthouse PWA score ≥ 90. Site is installable on mobile. Page source includes correct meta tags.

### Implementation for User Story 6

- [ ] T091 [P] [US6] Install vite-plugin-pwa as devDependency and configure in vite.config.ts with Workbox generateSW strategy
- [ ] T092 [P] [US6] Configure PWA manifest in vite-plugin-pwa options: name "Lucferbux Web", short_name "Lucferbux", theme_color #CA8F36, background_color #F2F6FF, display standalone, icons from static/images/logos/
- [ ] T093 [US6] Configure service worker caching strategies — CacheFirst for static assets (images, fonts, CSS, JS), NetworkFirst for Firestore API calls
- [ ] T094 [US6] Ensure SEO component (src/components/layout/SEO.tsx) provides page-specific title, description, OpenGraph (og:title, og:description, og:image, og:url), and Twitter Card (twitter:card, twitter:title, twitter:description) meta tags. **Scope**: Verify/extend the SEO component created in T023 (US1) with any missing PWA-specific meta tags
- [ ] T095 [US6] Add SEO component with unique metadata to all page components (HomePage, NewsPage, PostsPage, ProjectsPage, PrivacyPage, TermsPage, BlogPostPage). **Scope**: Define per-page titles, descriptions, and OG images — the SEO component itself is from T023
- [ ] T096 [US6] Validate Lighthouse Performance ≥ 90 and PWA ≥ 90 scores on production build

**Checkpoint**: Site is installable as PWA. All pages have correct meta tags. Lighthouse scores meet targets.

---

## Phase 9: User Story 7 — Agentic Configuration (Priority: P3)

**Goal**: Repository includes AI agent configuration files so coding assistants understand the post-migration project.

**Independent Test**: Reading AGENTS.md provides complete project context — tech stack, directory structure, conventions, testing approach.

### Implementation for User Story 7

- [ ] T097 [P] [US7] Create AGENTS.md at project root with: project description, tech stack (Vite + React + Tailwind + Firebase v11+), directory structure, coding conventions (TypeScript strict, Tailwind utilities, modular Firebase), testing guidelines (Vitest + RTL), and deployment instructions
- [ ] T098 [P] [US7] Create .github/copilot-instructions.md with Copilot-specific patterns: component structure (functional + Tailwind), hook patterns (useFirestoreCollection), Tailwind class conventions, Firebase modular import patterns, and test file structure

**Checkpoint**: AGENTS.md and copilot-instructions.md exist with accurate, comprehensive content aligned to the post-migration stack.

---

## Phase 10: User Story 8 — Admin Section with Firebase Auth (Priority: P4)

**Goal**: Protected /admin route with Firebase Auth login. CRUD operations for all four Firestore collections (intro, patent, project, team).

**Independent Test**: Navigate to /admin → see login form. Login with valid credentials → dashboard. Create, edit, delete items in each collection. Logout → redirected to login.

### Implementation for User Story 8

- [ ] T099 [P] [US8] Create src/hooks/useAuth.ts with signInWithEmailAndPassword, signOut, onAuthStateChanged listener, and auth state (user, loading, error) using Firebase Auth v11+ modular imports
- [ ] T100 [P] [US8] Create src/components/admin/LoginForm.tsx with email/password inputs, submit handler calling useAuth.signIn, error display, and Tailwind styling
- [ ] T101 [US8] Create src/components/admin/AdminLayout.tsx with auth guard — redirect to LoginForm if not authenticated, render Outlet with admin nav if authenticated
- [ ] T102 [US8] Create src/components/admin/Dashboard.tsx with links to manage each collection: News (intro), Posts (patent), Projects (project), Work (team)
- [ ] T103 [P] [US8] Create src/components/admin/NewsEditor.tsx with list/create/edit/delete UI for intro collection using addDoc, updateDoc, deleteDoc from firebase/firestore
- [ ] T104 [P] [US8] Create src/components/admin/PostEditor.tsx with list/create/edit/delete UI for patent collection using addDoc, updateDoc, deleteDoc from firebase/firestore
- [ ] T105 [P] [US8] Create src/components/admin/ProjectEditor.tsx with list/create/edit/delete UI for project collection using addDoc, updateDoc, deleteDoc from firebase/firestore
- [ ] T106 [P] [US8] Create src/components/admin/WorkEditor.tsx with list/create/edit/delete UI for team collection using addDoc, updateDoc, deleteDoc from firebase/firestore
- [ ] T107 [US8] Add /admin routes to src/routes.tsx: /admin (AdminLayout), /admin/login (LoginForm), /admin/dashboard (Dashboard), /admin/news (NewsEditor), /admin/posts (PostEditor), /admin/projects (ProjectEditor), /admin/work (WorkEditor). **Note**: These routes extend the route file created in T012 — the /admin/* placeholder is intentionally omitted from T012 to keep Phase 2 auth-free
- [ ] T108 [US8] Implement auth token expiry handling — detect expired tokens and prompt re-authentication in AdminLayout
- [ ] T109 [P] [US8] Create tests/unit/hooks/useAuth.test.ts — verify sign in, sign out, auth state changes with mocked Firebase Auth
- [ ] T110 [P] [US8] Create tests/integration/AdminFlow.test.tsx — verify login flow, dashboard navigation, CRUD operations, and logout with mocked Firebase

**Checkpoint**: Admin section fully functional. Login/logout works. CRUD for all 4 collections works. Auth guard prevents unauthorized access.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup legacy files, validate bundle, finalize deployment configuration

- [ ] T111 [P] Remove Gatsby files: gatsby-config.js, gatsby-node.js, gatsby-browser.js, gatsby-ssr.js
- [ ] T112 [P] Remove Jest/testing legacy files: jest-preprocess.js, jest.config.js, loadershim.js, setup-test-env.js
- [ ] T113 [P] Remove __mocks__/gatsby.js and __mocks__/file-mock.js
- [ ] T114 [P] Remove styled-components files: src/components/styles/GlobalStyle.ts, src/components/styles/ColorStyles.ts, src/components/styles/TextStyles.ts
- [ ] T115 [P] Remove src/components/test/FirebaseTest.tsx debug utility
- [ ] T116 [P] Remove old public/ directory (Gatsby build output — Vite uses dist/)
- [ ] T117 Remove all Gatsby, styled-components, and reactfire dependencies from package.json and run npm install
- [ ] T118 Verify zero Gatsby imports, zero styled-components imports, and zero reactfire imports across entire codebase
- [ ] T119 [P] Create firebase.json with hosting configuration targeting dist/ directory, rewrites for SPA (all routes → /index.html), and cache headers
- [ ] T120 Validate production bundle size < 500KB gzipped (npm run build, check dist/ output)
- [ ] T121 Run full quickstart.md validation checklist — verify all phases pass
- [ ] T122 Verify end-to-end deployment to Firebase Hosting with `firebase deploy --only hosting`

**Checkpoint**: Zero legacy dependencies. Bundle < 500KB. All quickstart.md checks pass. Production deployment succeeds.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Foundational (Phase 2)
- **US2 (Phase 4)**: Depends on Foundational (Phase 2) — **can run in parallel with US1**
- **US3 (Phase 5)**: Depends on Foundational (Phase 2) — optimal after US1 + US2 for wiring data into styled components
- **US4 (Phase 6)**: Depends on Foundational (Phase 2) — optimal after US2 for blog CSS
- **US5 (Phase 7)**: Depends on Foundational (Phase 2) — optimal after US1–US4 so components exist to test
- **US6 (Phase 8)**: Depends on US1 (Layout/SEO must exist)
- **US7 (Phase 9)**: Depends on Foundational (Phase 2) — can run anytime after foundation
- **US8 (Phase 10)**: Depends on US3 (Firebase hooks must exist) — should be last feature story
- **Polish (Phase 11)**: Depends on ALL user stories being complete

### User Story Dependencies

```
Phase 1: Setup
    │
Phase 2: Foundational
    │
    ├──── Phase 3: US1 (Scaffold) ──┐
    │         │                      │
    ├──── Phase 4: US2 (Tailwind) ──┤── Phase 5: US3 (Firebase)
    │                                │         │
    ├──── Phase 9: US7 (Agentic)    │         ├── Phase 6: US4 (Blog)
    │                                │         │
    │                                │         └── Phase 10: US8 (Admin)
    │                                │
    │                           Phase 7: US5 (Testing) ←── best after US1–US4
    │                                │
    │                           Phase 8: US6 (PWA/SEO)
    │                                │
    └────────────────────────────────┘
                    │
              Phase 11: Polish
```

### Within Each User Story

- Models/hooks before component wiring
- Core implementation before integration verification
- Verification/validation tasks last
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1**: T005, T006, T007 can run in parallel
**Phase 2**: T009, T010, T013, T014, T015, T016, T017, T018, T019 can all run in parallel (after T008)
**Phase 3 (US1)**: T021–T031 can all run in parallel; T032 (wiring) must be last
**Phase 4 (US2)**: T033–T051 can all run in parallel; T052/T053 (verification) must be last
**Phase 5 (US3)**: T054/T055 in parallel; then T056–T061 in parallel; T062/T063 last
**Phase 6 (US4)**: T064/T065 in parallel; T066–T070 sequential
**Phase 7 (US5)**: T071–T075 setup in parallel; T076–T087 test files all in parallel; T088/T089 in parallel; T090 last
**Phase 8 (US6)**: T091/T092 in parallel; T093–T096 sequential
**Phase 9 (US7)**: T097/T098 fully parallel
**Phase 10 (US8)**: T099/T100 in parallel; T103–T106 editor components in parallel; T109/T110 tests in parallel
**Phase 11**: T111–T116 all in parallel; T117–T122 sequential

---

## Parallel Example: User Story 2 (Largest Story)

```bash
# Launch all component files in parallel (different files, no dependencies):
Task T033: "Create HeroSection.tsx"
Task T034: "Create WaveHero.tsx"
Task T035: "Create remaining Wave components"
Task T036: "Create NavButton components"
Task T037: "Create FlatButton/SocialButton components"
Task T038: "Create NewsCard.tsx"
Task T039: "Create NewsCardCollapsed/Detail"
Task T040: "Create PostCard.tsx"
Task T041: "Create ProjectCard.tsx"
Task T042: "Create ResumeeCard components"
Task T043: "Create NewsSectionHome.tsx"
Task T044: "Create PostsProjectSection.tsx"
Task T045: "Create AboutMeSection.tsx"
Task T046: "Create NewsSection.tsx"
Task T047: "Create PostSection.tsx"
Task T048: "Create ProjectSection.tsx"
Task T049: "Create InfoBox.tsx"
Task T050: "Create PrivacySection/TermsSection"
Task T051: "Create MockupAnimation.tsx"

# After all components: run verification sequentially
Task T052: "Verify dark mode"
Task T053: "Verify responsive breakpoints"
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup → Vite project initializes
2. Complete Phase 2: Foundational → Tailwind, Router, Firebase, models ready
3. Complete Phase 3: US1 → All routes render with Layout
4. Complete Phase 4: US2 → All components styled with Tailwind
5. **STOP and VALIDATE**: Visual comparison with current site — no regressions
6. This delivers a fully styled, navigable site (static content only)

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 + US2 → Styled scaffold (MVP!) → Visual validation
3. US3 → Live Firestore data → Data validation
4. US4 → Blog works → Content validation
5. US5 → Tests + CI → Quality assurance
6. US6 → PWA + SEO → Production readiness
7. US7 → Agentic config → Developer experience
8. US8 → Admin section → Content management
9. Polish → Cleanup + deploy → Final delivery

### Suggested MVP Scope

**MVP = Phase 1 + Phase 2 + Phase 3 (US1) + Phase 4 (US2)**
This delivers a fully styled, navigable site matching the current visual design, without live data (placeholder content). Validates the core migration is successful before adding Firebase, blog, testing, and admin.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks in the same phase
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- US1 and US2 are both P1 and CAN run in parallel — styling and routing are independent concerns
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: 122 tasks across 11 phases (8 user stories + Setup + Foundational + Polish)
