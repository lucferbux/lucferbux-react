# AGENTS.md — Lucferbux Personal Website

## Project Description

Personal website and PWA for Lucferbux, built with Vite + React 18 as a single-page application.
Displays news, blog posts, projects, and a résumé section. Data is stored in Cloud Firestore;
blog posts are static Markdown files loaded at build time via `import.meta.glob`.
Includes a Firebase Auth-protected admin section for CRUD operations on Firestore collections.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite 7+ |
| UI | React 18, TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 (CSS-based `@theme` config, no JS config) |
| Routing | React Router v7 |
| Backend | Firebase JS SDK v12+ (modular imports) |
| Database | Cloud Firestore — collections: `intro`, `patent`, `project`, `team` |
| Auth | Firebase Authentication (email/password) |
| Blog | react-markdown + remark-gfm + rehype-prism-plus |
| Testing | Vitest 4 + React Testing Library + MSW 2 |
| PWA | vite-plugin-pwa (Workbox generateSW) |
| CI/CD | GitHub Actions → Firebase Hosting |

## Directory Structure

```
├── firebase.json             # Firebase Hosting config (SPA rewrites, cache headers)
├── .firebaserc               # Firebase project alias
├── vite.config.ts            # Vite + React + Tailwind + PWA plugins
├── vitest.config.ts          # Test config (jsdom, aliases, coverage)
├── eslint.config.js          # ESLint 9 flat config (TS + React)
├── tsconfig.json             # TypeScript strict config
├── index.html                # SPA entry point
├── src/
│   ├── main.tsx              # React entry point (createRoot)
│   ├── App.tsx               # Root component (HelmetProvider + BrowserRouter)
│   ├── routes.tsx            # Route definitions (public + admin)
│   ├── firebase.ts           # Firebase init (modular SDK)
│   ├── components/
│   │   ├── admin/            # Auth-protected admin CRUD components
│   │   │   ├── AdminLayout.tsx     # Auth guard + admin nav + Outlet
│   │   │   ├── LoginForm.tsx       # Email/password login form
│   │   │   ├── Dashboard.tsx       # Collection overview cards
│   │   │   ├── NewsEditor.tsx      # CRUD for intro collection
│   │   │   ├── PostEditor.tsx      # CRUD for patent collection
│   │   │   ├── ProjectEditor.tsx   # CRUD for project collection
│   │   │   └── WorkEditor.tsx      # CRUD for team collection
│   │   ├── animations/       # MockupAnimation (device mockup parallax)
│   │   ├── backgrounds/      # Wave SVG components (WaveHero, WaveBody, etc.)
│   │   ├── blog/             # BlogPost (markdown renderer), CodePenEmbed
│   │   ├── buttons/          # NavButton, FlatButton, SocialButton, ResumeeButton
│   │   ├── cards/            # NewsCard, PostCard, ProjectCard, ResumeeCard, etc.
│   │   ├── common/           # LoadingSpinner, ErrorFallback
│   │   ├── home/             # HeroSection, NewsSectionHome, PostsProjectSection, AboutMeSection
│   │   ├── layout/           # Layout, Header, Footer, SEO
│   │   ├── news/             # NewsSection
│   │   ├── posts/            # PostSection
│   │   ├── projects/         # ProjectSection
│   │   ├── terms/            # PrivacySection, TermsSection
│   │   └── text/             # InfoBox
│   ├── content/              # Markdown blog posts (*.md with YAML frontmatter)
│   ├── data/
│   │   ├── menuData.ts       # Navigation items
│   │   ├── footerData.ts     # Footer links
│   │   └── model/            # TypeScript interfaces (News, Post, Project, Work)
│   ├── hooks/
│   │   ├── useFirestoreCollection.ts  # Real-time Firestore subscription
│   │   ├── useFirestoreDocument.ts    # Single document fetch
│   │   ├── useAuth.ts                 # Firebase Auth state management
│   │   └── useMediaQuery.ts           # Responsive breakpoint detection
│   ├── styles/
│   │   ├── globals.css       # Tailwind @import + @theme config + animations
│   │   ├── blog.css          # Blog markdown + PrismJS Twilight syntax theme
│   │   └── colors.ts         # Theme color tokens for programmatic use
│   └── utils/
│       └── parseFrontmatter.ts  # Lightweight YAML frontmatter parser
├── tests/
│   ├── setup.ts              # Vitest setup (jest-dom matchers, cleanup)
│   ├── mocks/
│   │   ├── firebase.ts       # Mock Firestore snapshots & onSnapshot
│   │   └── handlers.ts       # MSW handlers for Firestore REST
│   ├── unit/
│   │   ├── components/       # NewsCard, PostCard, ProjectCard, Header, Footer, SEO, InfoBox
│   │   └── hooks/            # useFirestoreCollection, useAuth
│   └── integration/          # HomePage, NewsPage, PostsPage, ProjectsPage, AdminFlow
├── public/
│   ├── favicon.svg           # Site favicon
│   ├── favicon-32x32.png     # PNG favicon
│   ├── icons/                # PWA icons (48px–512px)
│   └── images/               # Static images (animations, avatars, backgrounds, waves, logos)
├── .github/
│   ├── copilot-instructions.md  # Copilot coding patterns
│   └── workflows/
│       ├── ci.yml            # Lint → type-check → test → build
│       └── deploy.yml        # Firebase Hosting deploy
└── dist/                     # Build output (served by Firebase Hosting)
```

## Coding Conventions

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig.json)
- Use named exports for components: `export default function ComponentName()`
- Interfaces over types for component props
- No `any` — use `unknown` or proper generics

### Components
- Functional components only (no class components)
- Props interface defined above the component
- Use `clsx` for conditional class merging

### Tailwind CSS v4
- All theme configuration is in `src/styles/globals.css` via `@theme` blocks
- Custom breakpoints: xs:450px, sm:550px, md:650px, lg:750px, xl:1000px, 2xl:1234px
- Dark mode via `prefers-color-scheme` media queries (`dark:` variant)
- Prefer utility classes over `@apply`

### Firebase (Modular SDK)
- Always use modular imports: `import { getFirestore } from 'firebase/firestore'`
- Never use compat mode or namespace imports
- Firestore hook: `useFirestoreCollection(collectionName, ...constraints)`
- Auth hook: `useAuth()` returns `{ user, loading, error, signIn, signOut }`

### Hooks
- Custom hooks in `src/hooks/`
- `useFirestoreCollection` — subscribe to a Firestore collection with real-time updates
- `useAuth` — Firebase Authentication state management

### Testing
- Test files in `tests/` directory (not co-located)
- Use `vi.hoisted()` for mock variables referenced in `vi.mock()` factories
- Mock Firebase modules at the top of test files
- Wrap components in `<HelmetProvider>` + `<MemoryRouter>` for rendering
- Use `@testing-library/react` for component tests

## Build & Run

```bash
npm install                      # Install dependencies
npm run dev                       # Start dev server (port 5173)
npm run build                     # Production build (tsc --noEmit + vite build → dist/)
npm run preview                   # Preview production build locally
npm run test                      # Run all tests (14 suites, 71 tests)
npm run test:coverage             # Tests with coverage report
npm run lint                      # ESLint
npm run type-check                # TypeScript type checking
npm run format                    # Prettier formatting
```

## Deployment

```bash
npm run build                     # Build to dist/
firebase deploy --only hosting    # Deploy to Firebase Hosting
```

CI/CD via GitHub Actions:
- `ci.yml` — push/PR to main: lint → type-check → test → build
- `deploy.yml` — push to main: build + deploy to Firebase Hosting

Firebase Hosting config is in `firebase.json`:
- Serves from `dist/`
- SPA rewrite (all routes → `/index.html`)
- Immutable cache headers for hashed JS/CSS/fonts
- No-cache for `index.html` and `sw.js`

Environment variables required (`.env`):
- `VITE_FIREBASE_API`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
