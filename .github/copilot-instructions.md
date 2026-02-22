# Copilot Instructions — Lucferbux Personal Website

## Component Patterns

All components are functional React components with TypeScript:

```tsx
interface MyComponentProps {
  title: string;
  description?: string;
}

export default function MyComponent({ title, description }: MyComponentProps) {
  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>
      {description && <p className="text-gray-600 dark:text-gray-300">{description}</p>}
    </div>
  );
}
```

## Tailwind CSS v4 Conventions

- Configuration lives in `src/styles/globals.css` using `@theme` blocks — NOT in `tailwind.config.ts`
- Custom breakpoints: `xs:` (450px), `sm:` (550px), `md:` (650px), `lg:` (750px), `xl:` (1000px), `2xl:` (1234px)
- Dark mode uses `dark:` variant with `prefers-color-scheme` media strategy
- Custom colors: `primary` (#CA8F36), `primaryLight`, `primaryDark`, `secondary` (#009FB7)
- Use `clsx` for conditional classes — no template literal class logic

## Firebase Modular Import Patterns

Always use tree-shakeable modular imports:

```tsx
// ✅ Correct
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "@/firebase";

// ❌ Wrong — never use compat or namespace
import firebase from "firebase/app";
```

## Hook Patterns

### useFirestoreCollection
```tsx
const { data, loading, error } = useFirestoreCollection<NewsId>(
  "intro",
  [orderBy("timestamp", "desc")]
);
```

### useAuth
```tsx
const { user, loading, error, signIn, signOut } = useAuth();
await signIn(email, password);
```

## Data Models

Models are in `src/data/model/`. All Firestore timestamp fields use `Timestamp | Date`:
- `News` / `NewsId` — collection: `intro`
- `Post` / `PostId` — collection: `patent`
- `Project` / `ProjectId` — collection: `project`
- `Work` / `WorkId` — collection: `team`

## Test Patterns

```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Use vi.hoisted() for mock variables used in vi.mock() factories
const { mockOnSnapshot } = vi.hoisted(() => ({
  mockOnSnapshot: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: mockOnSnapshot,
  orderBy: vi.fn(),
}));

vi.mock("@/firebase", () => ({ db: {}, auth: {} }));
```

## File Organization

- Pages: `src/pages/` (PascalCase: `HomePage.tsx`, `NewsPage.tsx`)
- Components: grouped by feature (`src/components/admin/`, `src/components/cards/`)
- Static assets: `public/` (SVGs, icons, images)
- Tests: `tests/unit/` and `tests/integration/`
- Blog content: `src/content/*.md` (loaded via `import.meta.glob`)
