<!--
Sync Impact Report
- Version change: 0.0.0 → 1.0.0
- Initial constitution creation
- Principles established: 6 (UX Preservation, Modern Stack, Firebase Continuity, Testing Discipline, Agentic Readiness, Incremental Delivery)
- Added sections: Core Principles, Technology Stack, Development Workflow, Governance
- Removed sections: none
- Templates requiring updates: ✅ spec-template.md (referenced), ✅ plan-template.md (referenced), ✅ tasks-template.md (referenced)
- Follow-up TODOs: none
-->

# Lucferbux Personal Website Constitution

## Core Principles

### I. UX Preservation (NON-NEGOTIABLE)

The current user experience, visual design, navigation flow, and responsive
behavior MUST remain identical after migration. No user-facing regression is
acceptable. Dark mode via `prefers-color-scheme`, responsive breakpoints,
page transitions, and component layouts MUST be visually consistent
(verified by manual side-by-side review at each breakpoint).
Every page route (`/`, `/news`, `/posts`, `/projects`, `/privacy`, `/terms`,
`/blog/{slug}`) MUST continue to function with the same content and behavior.

### II. Modern Stack First

All new code MUST use the target stack: **Vite + React 18 + TypeScript +
Tailwind CSS v4 + Firebase JS SDK v11+**. No new Gatsby or styled-components
code is permitted. Existing patterns (CSS-in-JS via styled-components) MUST
be migrated to Tailwind utility classes or Tailwind-compatible CSS modules.
Static site generation is NOT required; Vite SPA with client-side routing
(React Router) is the replacement architecture.

### III. Firebase Continuity

All Firestore collections (`intro`, `patent`, `project`, `team`) MUST
remain backward-compatible. The Firebase project (`lucferbux-web-page`)
MUST be preserved. Migration from `reactfire v3 + Firebase SDK v8` to the
latest Firebase JS SDK (v11+) with modular tree-shakable imports MUST be
completed. No Firestore schema changes are permitted during the tooling
migration phase. New Firebase Auth integration for the admin section MUST
use the modular SDK exclusively.

### IV. Testing Discipline

Every migrated component MUST have at minimum a unit test verifying its
rendering behavior. Integration tests MUST cover Firebase data fetching
flows. Existing tests (NewsCard, PostCard, ProjectCard, Header, SEO) MUST
be migrated to the new stack and pass. New features (admin section) MUST
include both unit and integration tests. CI/CD pipelines MUST run the full
test suite on every PR to `main`. Testing framework: Vitest + React Testing
Library.

### V. Agentic Readiness

The repository MUST include an `AGENTS.md` file with instructions for AI
coding agents describing the target architecture, conventions, and
development guidelines. Copilot instructions (`.github/copilot-instructions.md`)
MUST be maintained. All code MUST follow consistent patterns documented in
these files so that AI agents can contribute effectively. Configuration files
MUST be minimal, well-commented, and self-documenting.

### VI. Incremental Delivery

Migration MUST proceed in priority tiers that keep the application functional
at each checkpoint. Each tier MUST be independently deployable and testable.
The tiers are: **P1** scaffold Vite project + core layout + Tailwind styling,
**P2** Firebase SDK update + blog migration + testing, **P3** PWA/SEO +
agentic configuration, **P4** admin section. User stories at the **same**
priority level MAY execute in parallel (e.g., US1 and US2 are both P1 and
can be worked on concurrently). A higher-numbered priority tier MUST NOT
start until all stories in the preceding tier pass their independent tests.

## Technology Stack

| Layer | Current | Target |
|-------|---------|--------|
| Build/Bundler | Gatsby 5 | Vite 6+ |
| UI Framework | React 18 | React 18 (React 19 optional post-migration) |
| Styling | styled-components 5 | Tailwind CSS v4 |
| Routing | Gatsby File System Routes | React Router v7 |
| Firebase SDK | firebase 8.10 + reactfire 3 | Firebase JS SDK v11+ (modular) |
| SEO/Head | react-helmet | React Helmet Async or vite-plugin-ssr-head |
| Markdown | gatsby-transformer-remark + PrismJS | react-markdown + rehype-prism-plus |
| Images | gatsby-plugin-image + gatsby-plugin-sharp | Native `<img>` / optimized static assets |
| PWA | gatsby-plugin-offline + gatsby-plugin-manifest | vite-plugin-pwa |
| Testing | Jest 29 + RTL | Vitest + RTL |
| Type Checking | TypeScript (strict) | TypeScript (strict) |
| CI/CD | GitHub Actions (test only) | GitHub Actions (test + build + deploy) |
| Linting | Prettier only | ESLint + Prettier |

## Development Workflow

1. **Branch Strategy**: Feature branches off `main`. Branch naming:
   `<number>-<short-description>` (e.g., `001-migrate-gatsby-to-vite`).
2. **PR Process**: Every PR MUST pass CI (lint, type-check, test, build).
   PRs MUST reference the relevant spec or task ID.
3. **Code Review**: All PRs require at least one review. AI-generated code
   MUST be reviewed by a human before merge.
4. **Commit Convention**: Conventional Commits format
   (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
5. **Deployment**: Automated deployment to Firebase Hosting on merge to
   `main` after all checks pass.

## Governance

This constitution supersedes all other development practices for this
project. Amendments require:
- Documentation of the change rationale
- Update to this file with version bump
- Propagation to dependent templates and agent files

All PRs and reviews MUST verify compliance with these principles.
Complexity MUST be justified. When in doubt, prefer the simpler approach.

**Version**: 1.0.0 | **Ratified**: 2026-02-22 | **Last Amended**: 2026-02-22
