# Implementation Plan: Migrate Lucferbux Personal Website

**Branch**: `1-migrate-gatsby-to-vite` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/1-migrate-gatsby-to-vite/spec.md`

## Summary

Migrate the Lucferbux personal website from Gatsby 5 + styled-components + Firebase SDK v8
to Vite + Tailwind CSS v4 + Firebase JS SDK v11+. Preserve identical UX, add comprehensive
testing, agentic configuration, and a new Firebase Auth-protected admin section. The migration
follows an incremental approach: scaffold → layout → styling → Firebase → blog → testing →
PWA/SEO → agentic config → admin.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), React 18/19
**Primary Dependencies**: Vite 6+, React Router v7, Tailwind CSS v4, Firebase JS SDK v11+
**Storage**: Cloud Firestore (existing `lucferbux-web-page` project), local markdown files for blog
**Testing**: Vitest + React Testing Library + MSW (for Firebase mocking)
**Target Platform**: Web (SPA), deployed to Firebase Hosting
**Project Type**: web-app (SPA with client-side routing)
**Performance Goals**: Lighthouse Performance ≥ 90, PWA ≥ 90, cold start < 3s
**Constraints**: Zero styled-components remaining, zero Gatsby dependencies, bundle < 500KB gzipped
**Scale/Scope**: ~30 components, 8 routes, 4 Firestore collections, 3 blog posts, 1 admin section

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. UX Preservation | ✅ PASS | All routes, visuals, dark mode, and responsive breakpoints preserved per spec |
| II. Modern Stack First | ✅ PASS | Vite + React + Tailwind + Firebase v11+ — no legacy tech in new code |
| III. Firebase Continuity | ✅ PASS | Same Firestore collections, no schema changes, modular SDK |
| IV. Testing Discipline | ✅ PASS | Vitest + RTL, all existing tests migrated, new tests added, CI enhanced |
| V. Agentic Readiness | ✅ PASS | AGENTS.md and copilot-instructions.md included in scope |
| VI. Incremental Delivery | ✅ PASS | 8 phased user stories, each independently deliverable |

## Project Structure

### Documentation (this feature)

```text
specs/1-migrate-gatsby-to-vite/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (admin API contracts)
└── tasks.md             # Phase 2 output
```

### Source Code (repository root — post-migration)

```text
├── index.html                    # Vite entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.ts            # Tailwind CSS v4 configuration
├── tsconfig.json                 # TypeScript configuration (updated)
├── vitest.config.ts              # Vitest configuration
├── .env                          # Environment variables (VITE_FIREBASE_API, etc.)
├── .env.example                  # Template for env vars
├── AGENTS.md                     # AI agent instructions
├── .github/
│   ├── copilot-instructions.md   # Copilot-specific guidance
│   ├── workflows/
│   │   ├── ci.yml                # Lint + type-check + test + build
│   │   └── deploy.yml            # Deploy to Firebase Hosting
│   └── ...
├── public/
│   ├── images/                   # Static images (waves, icons, logos, etc.)
│   ├── manifest.webmanifest      # PWA manifest
│   └── ...
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Root component with Router
│   ├── routes.tsx                # Route definitions
│   ├── firebase.ts               # Firebase initialization (modular SDK)
│   ├── components/
│   │   ├── animations/
│   │   │   └── MockupAnimation.tsx
│   │   ├── backgrounds/
│   │   │   ├── WaveHero.tsx
│   │   │   ├── WaveBody.tsx
│   │   │   ├── WaveFooter.tsx
│   │   │   ├── WaveNewsHome.tsx
│   │   │   ├── WavePostHome.tsx
│   │   │   ├── WaveResumeeHome.tsx
│   │   │   └── WaveShort.tsx
│   │   ├── buttons/
│   │   │   ├── NavButton.tsx
│   │   │   ├── NavButtonExternal.tsx
│   │   │   ├── FlatButton.tsx
│   │   │   ├── FlatButtonLink.tsx
│   │   │   ├── SocialButton.tsx
│   │   │   └── ResumeeButton.tsx
│   │   ├── cards/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsCardCollapsed.tsx
│   │   │   ├── NewsCardDetail.tsx
│   │   │   ├── PostCard.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ResumeeCard.tsx
│   │   │   ├── ResumeeCardRow.tsx
│   │   │   └── ResumeeHeader.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── NewsSectionHome.tsx
│   │   │   ├── PostsProjectSection.tsx
│   │   │   └── AboutMeSection.tsx
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── SEO.tsx
│   │   ├── news/
│   │   │   └── NewsSection.tsx
│   │   ├── posts/
│   │   │   └── PostSection.tsx
│   │   ├── projects/
│   │   │   └── ProjectSection.tsx
│   │   ├── text/
│   │   │   └── InfoBox.tsx
│   │   ├── terms/
│   │   │   ├── PrivacySection.tsx
│   │   │   └── TermsSection.tsx
│   │   ├── blog/
│   │   │   └── BlogPost.tsx
│   │   ├── admin/                # NEW
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── NewsEditor.tsx
│   │   │   ├── PostEditor.tsx
│   │   │   ├── ProjectEditor.tsx
│   │   │   └── WorkEditor.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorFallback.tsx
│   ├── hooks/
│   │   ├── useFirestoreCollection.ts
│   │   ├── useFirestoreDocument.ts
│   │   ├── useAuth.ts            # NEW
│   │   └── useMediaQuery.ts
│   ├── data/
│   │   ├── menuData.ts
│   │   ├── footerData.ts
│   │   └── model/
│   │       ├── News.ts
│   │       ├── Post.ts
│   │       ├── Project.ts
│   │       └── Work.ts
│   ├── content/                  # Markdown blog posts
│   │   ├── first-step-redux.md
│   │   ├── install-blog.md
│   │   └── react-solid.md
│   ├── styles/
│   │   ├── globals.css           # Tailwind directives + CSS reset
│   │   ├── colors.ts             # Theme color tokens (for programmatic use)
│   │   └── blog.css              # Blog-specific markdown styles
│   └── assets/
│       ├── animation/            # PNG images for MockupAnimation
│       └── avatars/              # Avatar images
└── tests/
    ├── setup.ts                  # Vitest setup (RTL matchers, MSW)
    ├── mocks/
    │   ├── firebase.ts           # Firebase mock for tests
    │   └── handlers.ts           # MSW handlers for Firestore
    ├── unit/
    │   ├── components/
    │   │   ├── NewsCard.test.tsx
    │   │   ├── PostCard.test.tsx
    │   │   ├── ProjectCard.test.tsx
    │   │   ├── Header.test.tsx
    │   │   ├── SEO.test.tsx
    │   │   ├── Footer.test.tsx
    │   │   ├── InfoBox.test.tsx
    │   │   └── ...
    │   └── hooks/
    │       ├── useFirestoreCollection.test.ts
    │       └── useAuth.test.ts
    └── integration/
        ├── NewsPage.test.tsx
        ├── PostsPage.test.tsx
        ├── ProjectsPage.test.tsx
        ├── HomePage.test.tsx
        └── AdminFlow.test.tsx
```

**Structure Decision**: Single web application (SPA) project. No backend directory
needed since Firebase provides the backend. The admin section lives within the same
SPA behind a protected route. Tests are co-located in a top-level `tests/` directory
matching the current pattern, but organized into `unit/` and `integration/` subdirectories.

## Key Migration Decisions

### Gatsby → Vite

| Gatsby Feature | Vite Replacement |
|----------------|-----------------|
| `gatsby develop` | `vite` (dev server with HMR) |
| `gatsby build` | `vite build` (Rollup-based production build) |
| File System Routes | React Router v7 declarative routes |
| `gatsby-plugin-image` + `gatsby-plugin-sharp` | Native `<img>` with lazy loading + static assets in `public/` |
| `gatsby-source-filesystem` + `gatsby-transformer-remark` | `react-markdown` + `remark-gfm` + `rehype-prism-plus` with Vite raw import |
| `gatsby-plugin-offline` + `gatsby-plugin-manifest` | `vite-plugin-pwa` (Workbox) |
| `gatsby-plugin-react-helmet` | `react-helmet-async` |
| `gatsby-plugin-styled-components` | Removed (Tailwind replaces styled-components) |
| `gatsby-plugin-typescript` | Vite native TypeScript support |
| GraphQL static queries | Direct imports / Firestore hooks |
| `wrapRootElement` (gatsby-browser/ssr) | React context providers in `App.tsx` |

### styled-components → Tailwind CSS

| Styled-Components Pattern | Tailwind Equivalent |
|--------------------------|---------------------|
| `createGlobalStyle` (GlobalStyle.ts) | `@layer base` in `globals.css` |
| Theme object (ColorStyles.ts) | Tailwind theme extension in `tailwind.config.ts` + CSS custom properties |
| Typography components (TextStyles.ts) | Tailwind `@apply` utility classes or component-level className strings |
| `@media (prefers-color-scheme: dark)` | Tailwind `dark:` variant with `media` strategy |
| Dynamic props (`styled.div<{count: number}>`) | Template literal classNames or `clsx`/`cn` utility |
| Per-component responsive `@media` | Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) |
| CSS animations (`@keyframes fadein`) | Tailwind `animate-` utilities or `@keyframes` in `globals.css` |

### Firebase v8 → v11+ Modular

| Firebase v8 Pattern | Firebase v11+ Modular Equivalent |
|---------------------|--------------------------------|
| `import firebase from 'firebase/app'` | `import { initializeApp } from 'firebase/app'` |
| `import 'firebase/firestore'` | `import { getFirestore } from 'firebase/firestore'` |
| `firebase.initializeApp(config)` | `const app = initializeApp(config)` |
| `useFirestore()` (reactfire) | `getFirestore(app)` in `firebase.ts` |
| `useFirestoreCollectionData(query)` | Custom hook: `collection()` + `query()` + `onSnapshot()` or `getDocs()` |
| `firebase.firestore.FieldValue` | `import { serverTimestamp } from 'firebase/firestore'` |
| N/A (no auth currently) | `import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'` |

### Custom Tailwind Breakpoints

Map existing styled-components breakpoints to Tailwind config:

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'xs': '450px',
      'sm': '550px',
      'md': '650px',
      'lg': '750px',
      'xl': '1000px',
      '2xl': '1234px',
      '3xl': '1440px',
      '4xl': '2500px',
    },
  },
}
```

### Custom Tailwind Theme Colors

Derived from `ColorStyles.ts`:

```typescript
// tailwind.config.ts (colors extension)
colors: {
  primary: { DEFAULT: '#CA8F36', dark: '#CA8F36' },
  background: { light: '#F2F6FF', dark: '#1A1A2E' },
  card: { light: '#FFFFFF', dark: '#2D2D44' },
  // ... mapped from themes.light and themes.dark
}
```

## Files to Delete Post-Migration

After all stories are complete and validated:

- `gatsby-config.js`
- `gatsby-node.js`
- `gatsby-browser.js`
- `gatsby-ssr.js`
- `jest-preprocess.js`
- `jest.config.js`
- `loadershim.js`
- `setup-test-env.js`
- `__mocks__/gatsby.js`
- `__mocks__/file-mock.js`
- `src/components/styles/GlobalStyle.ts` (replaced by globals.css)
- `src/components/styles/ColorStyles.ts` (replaced by tailwind.config.ts)
- `src/components/styles/TextStyles.ts` (replaced by Tailwind typography)
- `src/components/test/FirebaseTest.tsx` (debug utility, no longer needed)
- All `styled()` wrapper files once migrated
- `public/` directory (Gatsby build output — Vite uses `dist/`)

## Complexity Tracking

No constitution violations detected. The migration is complex in scope but each
story is straightforward in implementation. No complexity justifications needed.
