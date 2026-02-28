<p align="center">
  <a href="https://lucferbux.dev">
    <img alt="Lucferbux" src="public/images/logos/logo-icon.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Lucferbux Personal Website
</h1>

<p align="center">
  <a href="https://lucferbux.dev">Live Site</a> · 
  <a href="#-quick-start">Quick Start</a> · 
  <a href="#-tech-stack">Tech Stack</a>
</p>

[![License][license-image]][license-url]

> Personal website & PWA — news, blog, projects, and résumé — powered by Vite, React, Tailwind CSS v4 & Firebase.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Build** | [Vite](https://vite.dev) 7+ |
| **UI** | React 18, TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 (`@theme` config in CSS — no JS config file) |
| **Routing** | React Router v7 |
| **Backend** | Firebase JS SDK v12+ (modular, tree-shakeable imports) |
| **Database** | Cloud Firestore — collections: `intro`, `patent`, `project`, `team` |
| **Auth** | Firebase Authentication (email / password) |
| **Blog** | react-markdown + remark-gfm + rehype-prism-plus |
| **Testing** | Vitest + React Testing Library + MSW · Playwright (E2E) |
| **PWA** | vite-plugin-pwa (Workbox generateSW) |
| **CI/CD** | GitHub Actions → Firebase Hosting |

## Requirements

- [Node.js](https://nodejs.org/) 22+
- npm 10+
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

## Quick Start

```bash
# Clone & install
git clone https://github.com/Lucferbux/LucferbuxReact.git
cd LucferbuxReact
npm install

# Configure environment
cp .env.example .env
# Fill in your Firebase config values in .env

# Start development server
npm run dev
# → http://localhost:5173
```

## Environment Variables

Create a `.env` file (or copy `.env.example`) with:

```env
VITE_FIREBASE_API=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5173) |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run all tests with Vitest |
| `npm run test:coverage` | Tests with coverage report |
| `npm run e2e` | Run E2E tests with Playwright |
| `npm run e2e:headed` | Run E2E tests in headed browser mode |
| `npm run e2e:report` | Open the last Playwright HTML report |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Lint source with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run deploy` | Deploy `dist/` to Firebase Hosting |

## Project Structure

```
src/
├── main.tsx                  # React entry point
├── App.tsx                   # Root (HelmetProvider + BrowserRouter)
├── routes.tsx                # All route definitions
├── firebase.ts               # Firebase init (modular SDK)
├── components/
│   ├── admin/                # Auth-protected CRUD (Login, Dashboard, Editors)
│   ├── animations/           # MockupAnimation (device mockup parallax)
│   ├── backgrounds/          # Wave SVG components (Hero, Body, Footer, etc.)
│   ├── blog/                 # BlogPost (markdown renderer), CodePenEmbed
│   ├── buttons/              # NavButton, FlatButton, SocialButton, ResumeeButton
│   ├── cards/                # NewsCard, PostCard, ProjectCard, ResumeeCard
│   ├── common/               # LoadingSpinner, ErrorFallback
│   ├── home/                 # HeroSection, NewsSectionHome, PostsProjectSection
│   ├── layout/               # Layout, Header, Footer, SEO
│   ├── news/                 # NewsSection
│   ├── posts/                # PostSection
│   ├── projects/             # ProjectSection
│   ├── terms/                # PrivacySection, TermsSection
│   └── text/                 # InfoBox
├── content/                  # Markdown blog posts (*.md)
├── data/
│   ├── menuData.ts           # Navigation items
│   ├── footerData.ts         # Footer links
│   └── model/                # TypeScript interfaces (News, Post, Project, Work)
├── hooks/                    # useFirestoreCollection, useAuth, useMediaQuery
├── styles/
│   ├── globals.css           # Tailwind @import + @theme config + animations
│   └── blog.css              # Blog typography + PrismJS syntax theme
└── utils/                    # parseFrontmatter
tests/
├── setup.ts                  # Vitest setup (jest-dom matchers)
├── mocks/                    # Firebase mocks, MSW handlers
├── unit/                     # Component & hook unit tests
└── integration/              # Page & admin flow integration tests
e2e/
├── landing.spec.ts           # Landing page E2E tests
└── navigation.spec.ts        # Navigation flow E2E tests
```

## Features

### Pages
- **Home** — Hero with Lottie animation & typewriter, news grid, featured posts/projects, résumé timeline
- **News** — All news items from Firestore (`intro` collection)
- **Posts** — Post cards from Firestore (`patent` collection)
- **Projects** — Project grid from Firestore (`project` collection)
- **Blog** — Markdown posts with syntax highlighting, GFM support, and CodePen embeds
- **Privacy / Terms** — Legal content pages

### Admin (`/admin`)
- Firebase Auth login (email/password)
- Dashboard with collection overview
- CRUD editors for News, Posts, Projects, and Work collections
- Auth guard with token expiry handling

### PWA
- Installable on mobile and desktop
- Offline-capable with Workbox service worker
- Runtime caching: NetworkFirst for Firestore API, CacheFirst for images/fonts

### Dark Mode
- Automatic via `prefers-color-scheme` (Tailwind `dark:` variant)
- All components, waves, cards, and backgrounds respond to OS preference

## Testing

### Unit & Integration Tests

```bash
npm run test              # 14 suites, 71 tests
npm run test:coverage     # With coverage report
```

Test stack: **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).

Tests are organized under `tests/`:
- `unit/components/` — NewsCard, PostCard, ProjectCard, Header, Footer, SEO, InfoBox
- `unit/hooks/` — useFirestoreCollection, useAuth
- `integration/` — HomePage, NewsPage, PostsPage, ProjectsPage, AdminFlow

### E2E Tests (Playwright)

```bash
npm run e2e               # Run all E2E tests (headless)
npm run e2e:headed        # Run with visible browser
npm run e2e:report        # View the HTML report
```

E2E tests live in `e2e/` and cover:
- **Landing page** — Hero section loads, header navigation visible, footer present
- **Navigation** — Browse to News, Projects, Posts; admin login page; unknown route handling

**Setup for local E2E:**
1. Copy `.env.example` to `.env` and fill in Firebase credentials (or use dummy values for UI-only tests).
2. Install Playwright browsers: `npx playwright install --with-deps chromium`
3. Run `npm run e2e`

The Playwright config (`playwright.config.ts`) automatically starts the Vite dev server. In CI, the E2E workflow (`.github/workflows/e2e.yml`) injects Firebase credentials from repository secrets.

**Multi-browser:** Chromium, WebKit, and Firefox projects are configured. CI runs Chromium only; locally all browsers run by default.

## Deployment

```bash
npm run build             # Type-check + build → dist/
firebase deploy --only hosting
```

CI/CD is configured via GitHub Actions:
- **ci.yml** — Runs on push/PR to `main`: lint → type-check → test → build
- **e2e.yml** — Runs on push/PR to `main`: build → Playwright E2E tests (requires Firebase secrets)
- **deploy.yml** — Deploys to Firebase Hosting on push to `main`

## Meta

Lucas Fernandez — [@lucferbux](https://twitter.com/lucferbux) — lucasfernandezaragon@gmail.com

Based on the [Design+Code](https://designcode.io) project. 
Distributed under the MIT license. See `LICENSE` for more information.

[license-image]: https://img.shields.io/badge/License-MIT-blue.svg
[license-url]: LICENSE


