# Research: Migrate Lucferbux Personal Website

**Branch**: `1-migrate-gatsby-to-vite` | **Date**: 2026-02-22

## R1: Gatsby → Vite Migration Strategy

**Decision**: Replace Gatsby with Vite 6+ as the build tool and dev server.

**Rationale**:
- Vite provides near-instant HMR and fast cold starts via native ESM
- No GraphQL layer needed — the project only uses Firestore runtime queries and local markdown
- Gatsby's SSG/SSR features are unused (Firebase data is fetched client-side anyway)
- Vite has first-class TypeScript support without plugins
- Smaller dependency footprint (~10 deps vs ~30 Gatsby plugins)

**Alternatives considered**:
- **Next.js**: Considered but rejected — SSR/SSG not needed, adds complexity for a client-side SPA
- **Remix**: Good React framework but overkill for a personal site with no server-side requirements
- **Astro**: Great for content sites but requires adapting the React component model and Firebase integration
- **Create React App**: Deprecated, no longer maintained

## R2: styled-components → Tailwind CSS Strategy

**Decision**: Replace styled-components with Tailwind CSS v4 using the `@tailwindcss/vite` plugin.

**Rationale**:
- Tailwind v4 has zero-config CSS generation via the Vite plugin
- Utility-first approach reduces CSS bundle size and eliminates runtime JS for styling
- Dark mode via `dark:` variant maps directly to current `prefers-color-scheme` approach
- Custom breakpoints in `tailwind.config.ts` map exactly to existing styled-components breakpoints
- Better AI agent compatibility — Tailwind classes are well-documented and predictable

**Alternatives considered**:
- **CSS Modules**: Good isolation but verbose for responsive/dark mode patterns
- **Emotion**: Same runtime overhead issue as styled-components
- **Vanilla Extract**: Zero-runtime but TypeScript-heavy API feels over-engineered for this scope
- **UnoCSS**: Tailwind-compatible but smaller ecosystem and less AI tooling support

**Migration approach**:
1. Map each styled-component to equivalent Tailwind utility classes
2. Extract theme colors from `ColorStyles.ts` into `tailwind.config.ts`
3. Map typography components from `TextStyles.ts` to Tailwind text utilities
4. Use `clsx` for conditional class composition (replacing dynamic styled props)
5. Keep custom `@keyframes` animations in `globals.css` where Tailwind utilities don't cover them

## R3: Firebase SDK v8 → v11+ Migration

**Decision**: Migrate from `firebase@8.10.0` + `reactfire@3` to `firebase@11+` with modular imports.

**Rationale**:
- Firebase SDK v8 is deprecated (compat mode only)
- Modular SDK enables tree-shaking: only imported functions are bundled
- Expected >50% reduction in Firebase bundle size
- `reactfire` v3 is tied to Firebase v8/v9 compat — not maintained for modular SDK
- Custom hooks provide the same DX with full control

**Alternatives considered**:
- **reactfire v4+**: Does not exist for modular SDK at required scope
- **firebase v9 compat mode**: Maintains v8 API compatibility but no tree-shaking benefits
- **Firestore REST API directly**: Removes SDK dependency but loses offline support and real-time listeners

**Custom hook design**:
```typescript
// useFirestoreCollection.ts
function useFirestoreCollection<T>(
  collectionName: string,
  constraints?: QueryConstraint[]
): { data: T[]; loading: boolean; error: Error | null }
```
Internally uses `onSnapshot` for real-time updates (matching current reactfire behavior).

## R4: Markdown Blog Rendering

**Decision**: Use `react-markdown` + `remark-gfm` + `rehype-prism-plus` for client-side markdown rendering.

**Rationale**:
- Only 3 blog posts — client-side rendering is perfectly acceptable
- `react-markdown` is the most widely-used React markdown renderer
- `rehype-prism-plus` provides equivalent PrismJS syntax highlighting
- Frontmatter parsing via `gray-matter` (already tree-shakable)
- Vite can import `.md` files as raw strings via `?raw` suffix

**Alternatives considered**:
- **MDX**: Overkill for simple markdown posts, adds compilation step
- **Build-time rendering with remark**: More complex setup, minimal benefit for 3 posts
- **Contentlayer**: Good but heavy dependency for 3 posts

**CodePen embed approach**: Custom rehype plugin that detects CodePen URLs and renders them as iframes.

## R5: React Router Configuration

**Decision**: Use React Router v7 with declarative `<Route>` elements.

**Rationale**:
- Industry standard for React SPAs
- Direct mapping from Gatsby file-system routes to declarative routes
- Supports nested layouts (`<Outlet>`) matching current Layout pattern
- URL params for blog slugs (`/blog/:slug`)

**Route mapping**:
| Gatsby Route | React Router Route |
|---|---|
| `src/pages/index.tsx` → `/` | `<Route path="/" element={<HomePage />} />` |
| `src/pages/news.tsx` → `/news` | `<Route path="/news" element={<NewsPage />} />` |
| `src/pages/posts.tsx` → `/posts` | `<Route path="/posts" element={<PostsPage />} />` |
| `src/pages/projects.tsx` → `/projects` | `<Route path="/projects" element={<ProjectsPage />} />` |
| `src/pages/privacy.tsx` → `/privacy` | `<Route path="/privacy" element={<PrivacyPage />} />` |
| `src/pages/terms.tsx` → `/terms` | `<Route path="/terms" element={<TermsPage />} />` |
| `src/pages/blog/{slug}.jsx` → `/blog/:slug` | `<Route path="/blog/:slug" element={<BlogPostPage />} />` |
| `src/pages/404.tsx` → `/404` | `<Route path="*" element={<NotFoundPage />} />` |

## R6: Testing Framework

**Decision**: Vitest + React Testing Library + MSW.

**Rationale**:
- Vitest is Vite-native — shares config, plugins, and transforms
- API-compatible with Jest (minimal test rewriting)
- MSW provides realistic network mocking for Firebase/Firestore
- React Testing Library is already in use — no migration needed for assertions

**Test structure**:
- `tests/unit/components/` — component rendering tests
- `tests/unit/hooks/` — custom hook tests
- `tests/integration/` — full page/flow tests with mocked Firebase
- `tests/mocks/` — MSW handlers and Firebase mocks

## R7: PWA Configuration

**Decision**: `vite-plugin-pwa` with Workbox for service worker and manifest generation.

**Rationale**:
- Direct replacement for `gatsby-plugin-offline` + `gatsby-plugin-manifest`
- Workbox generates optimized service workers with configurable caching strategies
- Manifest generation from config matches current Gatsby manifest options

**Configuration mapping**:
- `name`: "Lucferbux Web"
- `short_name`: "Lucferbux"
- `theme_color`: "#CA8F36"
- `background_color`: "#F2F6FF"
- `display`: "standalone"
- `icons`: from `static/images/logos/logo-icon.svg`
