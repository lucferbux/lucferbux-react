# Quickstart: Migrate Lucferbux Personal Website

**Branch**: `1-migrate-gatsby-to-vite` | **Date**: 2026-02-22

## Prerequisites

- Node.js 20+
- npm 10+
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm i -g firebase-tools`)
- Access to `lucferbux-web-page` Firebase project

## Setup

```bash
# Clone the repository
git clone https://github.com/lucferbux/lucferbux-react.git
cd lucferbux-react

# Switch to the feature branch
git checkout 1-migrate-gatsby-to-vite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Firebase config values
```

## Environment Variables

```env
VITE_FIREBASE_API=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=lucferbux-web-page.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lucferbux-web-page
VITE_FIREBASE_STORAGE_BUCKET=lucferbux-web-page.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

## Development

```bash
# Start the development server
npm run dev
# Opens at http://localhost:5173

# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## Build & Deploy

```bash
# Production build
npm run build
# Output in dist/

# Preview production build locally
npm run preview

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Validation Checklist

After each phase, verify the following:

### Phase 1-2 (Setup + Foundation)
- [ ] `npm run dev` starts Vite dev server without errors
- [ ] `npm run build` produces output in `dist/`
- [ ] TypeScript compiles without errors (`npm run type-check`)

### Phase 3 (US1: Scaffold)
- [ ] Navigate to `/` — shows Layout with Header and Footer
- [ ] Navigate to `/news`, `/posts`, `/projects` — each renders page shell
- [ ] Navigate to `/privacy`, `/terms` — renders legal pages
- [ ] Navigate to a random URL — redirects to `/`
- [ ] Header has logo + 3 nav links (News, Projects, Posts)
- [ ] Footer has navigation links and privacy text

### Phase 4 (US2: Tailwind)
- [ ] Every component uses Tailwind classes, no styled-components
- [ ] Dark mode works (toggle OS preference)
- [ ] Mobile responsive at 450px, 650px, 1000px, 1440px
- [ ] Visual comparison with current site — no regressions

### Phase 5 (US3: Firebase)
- [ ] Home page loads news, posts, projects, work from Firestore
- [ ] News page shows all news items
- [ ] Posts page shows all post cards
- [ ] Projects page shows project grid
- [ ] Browser console has no Firebase errors

### Phase 6 (US4: Blog)
- [ ] `/blog/first-steps-redux` renders with syntax highlighting
- [ ] `/blog/markdown-blog-gatsby` renders correctly
- [ ] `/blog/react-solid` renders correctly
- [ ] Code blocks have PrismJS-style highlighting

### Phase 7 (US5: Testing)
- [ ] `npm run test` passes all tests (>30 test cases)
- [ ] CI pipeline runs lint, type-check, test, build
- [ ] All 5 existing test suites migrated and passing

### Phase 8 (US6: PWA/SEO)
- [ ] Lighthouse PWA ≥ 90
- [ ] Site installable as PWA on mobile
- [ ] All pages have correct meta tags (inspect source)

### Phase 9 (US7: Agentic)
- [ ] `AGENTS.md` exists with accurate project info
- [ ] `.github/copilot-instructions.md` exists

### Phase 10 (US8: Admin)
- [ ] `/admin` shows login form
- [ ] Login with valid credentials → dashboard
- [ ] CRUD operations work for all 4 collections
- [ ] Logout redirects to login

### Final
- [ ] Zero Gatsby dependencies in `package.json`
- [ ] Zero styled-components in codebase
- [ ] Bundle size < 500KB gzipped
- [ ] All tests pass
- [ ] Production build deploys successfully
