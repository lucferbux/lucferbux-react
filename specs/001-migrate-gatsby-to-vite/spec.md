# Feature Specification: Migrate Lucferbux Personal Website

**Feature Branch**: `001-migrate-gatsby-to-vite`
**Created**: 2026-02-22
**Status**: Draft
**Input**: Migrate personal website from Gatsby + styled-components to Vite + Tailwind CSS, update Firebase SDK, improve testing, add agentic configuration, and build admin section.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vite Project Scaffold & Core Layout Migration (Priority: P1)

As a developer, I want to replace Gatsby with Vite so the project uses a modern, fast build tool while preserving the existing page structure and navigation.

This story covers: initializing a Vite + React + TypeScript project, setting up React Router with the same routes (`/`, `/news`, `/posts`, `/projects`, `/privacy`, `/terms`, `/blog/:slug`, `/404`), migrating the Layout shell (Header, Footer, SEO), and verifying the app skeleton renders correctly.

**Why this priority**: This is the foundational migration step. Nothing else can proceed until the core build system and routing are in place. All other stories depend on having a working Vite + React Router scaffold.

**Independent Test**: The application builds with Vite, all routes resolve to the correct page shells, the Header and Footer render with correct navigation links, and the 404 page redirects to `/`.

**Acceptance Scenarios**:

1. **Given** a clean checkout, **When** I run `npm run dev`, **Then** the Vite dev server starts and serves the application at localhost.
2. **Given** the app is running, **When** I navigate to `/`, **Then** I see the home page with Header (logo + News/Projects/Posts nav) and Footer.
3. **Given** the app is running, **When** I navigate to `/news`, `/posts`, `/projects`, `/privacy`, `/terms`, **Then** each route renders its respective page shell inside the Layout.
4. **Given** the app is running, **When** I navigate to a non-existent route, **Then** I am redirected to `/`.
5. **Given** the project, **When** I run `npm run build`, **Then** the production build completes successfully with no errors.

---

### User Story 2 - Styled-Components to Tailwind CSS Migration (Priority: P1)

As a user, I want the website to look identical to the current version but use Tailwind CSS instead of styled-components, so the project uses modern, maintainable styling.

This story covers: installing and configuring Tailwind CSS v4, migrating the global styles (CSS reset, dark mode, typography system), migrating all styled-components to Tailwind utility classes, and preserving responsive breakpoints and dark mode behavior.

**Why this priority**: Equally critical as US1 — the visual output MUST match the current site. This can be worked on in parallel with US1 since styling is a separate concern from routing/build.

**Independent Test**: Every page visually matches the current Gatsby site. Dark mode via `prefers-color-scheme` works. All responsive breakpoints (450px, 550px, 650px, 750px, 1000px, 1234px, 1440px) produce the correct layouts.

**Acceptance Scenarios**:

1. **Given** the migrated app, **When** I view the home page, **Then** the HeroSection, NewsSectionHome, PostsProjectSection, and AboutMeSection render with visually consistent appearance to the current site (verified by manual side-by-side review).
2. **Given** OS dark mode is enabled, **When** I view any page, **Then** backgrounds, text colors, card styles, and wave SVGs switch to dark variants matching the current behavior.
3. **Given** a mobile viewport (< 450px), **When** I view the header, **Then** nav button text is hidden and only icons show (collapse behavior).
4. **Given** the project, **When** I search for `styled-components` imports, **Then** zero results are found — all styling uses Tailwind.

---

### User Story 3 - Firebase SDK Modernization (Priority: P2)

As a developer, I want to upgrade from Firebase SDK v8 + reactfire v3 to Firebase JS SDK v11+ with modular imports, so the app uses the latest supported Firebase version with tree-shaking.

This story covers: replacing `firebase` v8 package with the modular `firebase` v11+ SDK, replacing `reactfire` hooks with direct modular Firestore calls (or a thin custom hook layer), updating the Firebase configuration, and ensuring all Firestore queries (`intro`, `patent`, `project`, `team`) continue to work.

**Why this priority**: High priority but depends on having the Vite scaffold (US1) in place first. Firebase is the data backbone — must be updated before new features can be built.

**Independent Test**: All four Firestore collections return the same data as before. The News, Posts, Projects, and About Me sections display correctly with live Firestore data.

**Acceptance Scenarios**:

1. **Given** the updated Firebase config, **When** the app loads, **Then** Firebase initializes successfully without errors.
2. **Given** the News page, **When** it renders, **Then** it fetches from the `intro` collection ordered by `timestamp desc` and displays all news items.
3. **Given** the Home page, **When** it renders, **Then** it fetches 6 latest news, 2 featured projects, 1 latest post, and work experience data from Firestore.
4. **Given** the project dependencies, **When** I inspect the bundle, **Then** only the Firebase modules actually used are included (modular tree-shaking verified).
5. **Given** SSR is no longer needed (SPA), **When** the app loads, **Then** Firebase initializes client-side without SSR guards (`typeof window` checks removed).

---

### User Story 4 - Markdown Blog Migration (Priority: P2)

As a user, I want to continue reading blog posts at `/blog/:slug` with the same content and formatting, migrated from Gatsby's markdown pipeline to a Vite-compatible solution.

This story covers: replacing `gatsby-transformer-remark` with a client-side or build-time markdown renderer (react-markdown + remark/rehype plugins), preserving PrismJS code highlighting, CSS class mappings for markdown elements, and CodePen embeds.

**Why this priority**: Blog is existing content that must be preserved, but it's a self-contained feature that doesn't block other stories.

**Independent Test**: Navigate to `/blog/first-steps-redux`, `/blog/markdown-blog-gatsby`, and `/blog/react-solid` — each renders with correct title, date, featured image, and styled HTML content with syntax highlighting.

**Acceptance Scenarios**:

1. **Given** the blog route `/blog/first-steps-redux`, **When** I navigate to it, **Then** I see the blog post with title, date, featured image, and formatted content.
2. **Given** a blog post with code blocks, **When** the post renders, **Then** PrismJS syntax highlighting is applied correctly.
3. **Given** a blog post with CodePen embeds, **When** the post renders, **Then** the CodePen iframes load correctly.
4. **Given** the markdown content, **When** rendered, **Then** CSS classes for headings, paragraphs, lists, links, and images match the current class mappings.

---

### User Story 5 - Testing Improvements & CI/CD (Priority: P2)

As a developer, I want comprehensive tests and robust CI/CD pipelines so that every change is validated automatically before merge.

This story covers: migrating from Jest to Vitest, migrating existing tests (NewsCard, PostCard, ProjectCard, Header, SEO), adding new unit tests for all migrated components, adding integration tests for Firebase data fetching, and enhancing the GitHub Actions workflow to include lint, type-check, test, and build steps.

**Why this priority**: Testing is critical for safe migration. Can proceed in parallel with other US once the scaffold is ready.

**Independent Test**: `npm run test` passes with >30 test cases (primary metric). Stretch goal: >80% component coverage. CI pipeline runs successfully on PR. All 5 existing test suites pass in the new framework.

**Acceptance Scenarios**:

1. **Given** the migrated test suite, **When** I run `npm run test`, **Then** all tests pass with Vitest.
2. **Given** a PR to `main`, **When** the CI workflow triggers, **Then** it runs lint, type-check, test, and build steps, and reports pass/fail.
3. **Given** each component, **When** its test file runs, **Then** it verifies rendering, props, and user interactions.
4. **Given** a Firebase-dependent component, **When** its integration test runs with mocked Firestore, **Then** it verifies correct data fetching and display.

---

### User Story 6 - PWA & SEO Preservation (Priority: P3)

As a user, I want the site to continue functioning as a Progressive Web App with correct SEO metadata, after the migration.

This story covers: configuring `vite-plugin-pwa` to replace `gatsby-plugin-offline` and `gatsby-plugin-manifest`, preserving the manifest configuration (name, icons, theme colors), migrating SEO from `react-helmet` to a Vite-compatible head management solution, and preserving OpenGraph/Twitter card metadata.

**Why this priority**: Important for production but not blocking core migration work.

**Independent Test**: The site installs as a PWA on mobile. Lighthouse PWA audit passes. Page source includes correct meta tags for SEO.

**Acceptance Scenarios**:

1. **Given** the deployed site, **When** I run a Lighthouse audit, **Then** the PWA score is comparable to the current site.
2. **Given** any page, **When** I inspect the HTML head, **Then** it contains correct title, description, OpenGraph, and Twitter Card meta tags.
3. **Given** the manifest, **When** I inspect it, **Then** it includes the correct name ("Lucferbux Web"), theme color (#CA8F36), icons, and display mode (standalone).

---

### User Story 7 - Agentic Configuration (Priority: P3)

As a developer, I want the repository to include AI agent configuration files so that AI coding assistants can understand and contribute to the project effectively.

This story covers: creating `AGENTS.md` with project architecture, conventions, and development guidelines for the target stack, creating `.github/copilot-instructions.md` with Copilot-specific instructions, and ensuring all configuration is aligned with the post-migration stack.

**Why this priority**: Enabler for future AI-assisted development but not blocking the migration itself.

**Independent Test**: An AI agent reading `AGENTS.md` can understand the project structure, tech stack, and conventions without additional context.

**Acceptance Scenarios**:

1. **Given** the `AGENTS.md` file, **When** an AI agent reads it, **Then** it contains: project description, tech stack (Vite + React + Tailwind + Firebase), directory structure, coding conventions, and testing guidelines.
2. **Given** `.github/copilot-instructions.md`, **When** Copilot uses it, **Then** it follows project-specific patterns for components, styling, and Firebase integration.

---

### User Story 8 - Admin Section with Firebase Auth (Priority: P4)

As a site owner, I want an admin section behind Firebase Authentication where I can view, create, edit, and delete content in Firestore (news, posts, projects, work experience).

This story covers: implementing Firebase Auth (email/password login), creating a protected `/admin` route, building CRUD forms for each Firestore collection (`intro`, `patent`, `project`, `team`), and ensuring proper auth guards.

**Why this priority**: This is net-new functionality that should only be built AFTER the full migration is complete and stable.

**Independent Test**: Log in at `/admin` with valid credentials → see a dashboard with links to manage each content type. Create, read, update, and delete operations work for all four collections.

**Acceptance Scenarios**:

1. **Given** the `/admin` route, **When** I am not authenticated, **Then** I see a login form.
2. **Given** valid credentials, **When** I submit the login form, **Then** I am authenticated and see the admin dashboard.
3. **Given** the admin dashboard, **When** I navigate to "News", **Then** I see a list of all news items from the `intro` collection with options to create, edit, and delete.
4. **Given** the news editor, **When** I create a new news item with title, description, URL, and image, **Then** it is saved to Firestore and appears in the public news page.
5. **Given** any admin CRUD action, **When** performed, **Then** the Firestore data is updated and reflected in the public-facing pages.
6. **Given** an authenticated session, **When** I click logout, **Then** I am signed out and redirected to the login form.

---

### Edge Cases

- What happens when Firestore is unreachable? Components MUST show a loading state and graceful error fallback, not crash.
- What happens when a blog post slug doesn't match any markdown file? The user MUST be redirected to `/404` → `/`.
- What happens when Firebase Auth token expires during an admin session? The user MUST be prompted to re-authenticate.
- What happens when a very large image URL is provided in Firestore? Images MUST have max dimensions and lazy loading.
- What happens on browsers without CSS `prefers-color-scheme` support? The site MUST fall back to light theme.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Application MUST build and serve using Vite with zero Gatsby dependencies.
- **FR-002**: All existing routes (`/`, `/news`, `/posts`, `/projects`, `/privacy`, `/terms`, `/blog/:slug`) MUST be accessible via React Router.
- **FR-003**: All visual components MUST use Tailwind CSS with no styled-components remaining.
- **FR-004**: Dark mode MUST function via `prefers-color-scheme` media query, matching current behavior.
- **FR-005**: All Firestore data fetching MUST use Firebase JS SDK v11+ modular imports.
- **FR-006**: The blog MUST render markdown content with syntax highlighting (PrismJS or equivalent).
- **FR-007**: The site MUST function as a PWA with offline capabilities and installability.
- **FR-008**: SEO metadata (title, description, OpenGraph, Twitter Cards) MUST be present on all pages.
- **FR-009**: All existing tests MUST be migrated to Vitest and pass.
- **FR-010**: CI/CD pipeline MUST run lint, type-check, test, and build on every PR.
- **FR-011**: The admin section MUST require Firebase Authentication (email/password).
- **FR-012**: The admin section MUST provide CRUD operations for all four Firestore collections.
- **FR-013**: The application MUST be deployable to Firebase Hosting.
- **FR-014**: The `AGENTS.md` file MUST describe the target architecture and development conventions.
- **FR-015**: TypeScript strict mode MUST be enforced across all source files.
- **FR-016**: The Lottie animations, typewriter effect, and parallax tilt interactions MUST be preserved.
- **FR-017**: Responsive behavior at all current breakpoints MUST be preserved.

### Key Entities

- **News** (`intro` collection): title, title_en, description, description_en, url, image, timestamp
- **Post** (`patent` collection): title, title_en, description, description_en, link, image, date, internalLink
- **Project** (`project` collection): title, title_en, description, description_en, link, tags, featured, date, version
- **Work** (`team` collection): avatar, icon, name, name_en, description, description_en, job, job_en, importance
- **BlogPost** (local markdown): slug, date, title, featuredImage, body content
- **User** (Firebase Auth - new): uid, email, displayName

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero Gatsby dependencies remain in `package.json` after migration.
- **SC-002**: Zero styled-components imports remain in the codebase after migration.
- **SC-003**: `npm run build` produces a production bundle under 500KB gzipped (excluding images).
- **SC-004**: Vite dev server cold start completes in under 3 seconds.
- **SC-005**: All 8 page routes render correctly and match the current visual design.
- **SC-006**: Firebase SDK bundle size reduces by >50% compared to v8 (tree-shaking benefit).
- **SC-007**: Test suite includes >30 test cases covering all major components and Firebase flows.
- **SC-008**: CI pipeline completes in under 5 minutes.
- **SC-009**: Lighthouse Performance score ≥ 90, PWA score ≥ 90.
- **SC-010**: Admin CRUD operations complete in under 2 seconds per action.
- **SC-011**: The site can be deployed to Firebase Hosting from a single `npm run deploy` command.
