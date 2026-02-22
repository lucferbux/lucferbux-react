# Data Model: Migrate Lucferbux Personal Website

**Branch**: `1-migrate-gatsby-to-vite` | **Date**: 2026-02-22

## Existing Entities (Firestore — No Schema Changes)

These entities already exist in the `lucferbux-web-page` Firestore database. During the
tooling migration (US1–US4), **no schema changes are permitted** per Constitution Principle III.

### News (`intro` collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Spanish title |
| title_en | string | yes | English title (displayed in UI) |
| description | string | yes | Spanish description |
| description_en | string | yes | English description (displayed in UI) |
| url | string | yes | External link URL |
| image | string | yes | Image URL |
| timestamp | Firestore Timestamp | yes | Publication date (sort key) |
| loaded | boolean | yes | Loading state flag |

**TypeScript interface** (`src/data/model/News.ts` — unchanged):
```typescript
export interface News {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  url: string;
  image: string;
  timestamp: Timestamp;
  loaded: boolean;
}

export interface NewsId extends News {
  id: string;
}
```

**Queries**:
- Home page: `collection("intro")` → `orderBy("timestamp", "desc")` → `limit(6)`
- News page: `collection("intro")` → `orderBy("timestamp", "desc")`

---

### Post (`patent` collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Spanish title |
| title_en | string | yes | English title (displayed in UI) |
| description | string | yes | Spanish description |
| description_en | string | yes | English description (displayed in UI) |
| link | string | yes | External link URL |
| image | string | yes | Image URL |
| date | Firestore Timestamp | yes | Publication date (sort key) |
| loaded | boolean | yes | Loading state flag |
| internalLink | string | no | Internal blog slug (e.g., `/blog/first-steps-redux`) |

**Queries**:
- Home page: `collection("patent")` → `orderBy("date", "desc")` → `limit(1)`
- Posts page: `collection("patent")` → `orderBy("date", "desc")`

---

### Project (`project` collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | yes | Spanish title |
| title_en | string | yes | English title (displayed in UI) |
| description | string | yes | Spanish description |
| description_en | string | yes | English description (displayed in UI) |
| link | string | yes | External link URL |
| tags | array<{icon: string, title: string}> | yes | Technology tags with icons |
| featured | boolean | yes | Whether project is featured |
| date | Firestore Timestamp | yes | Publication date (sort key) |
| version | string | yes | Version string (e.g., "1.0") |

**Queries**:
- Home page: `collection("project")` → `where("featured", "==", true)` → `limit(2)`
- Projects page: `collection("project")` → `orderBy("date", "desc")`

---

### Work (`team` collection)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| avatar | string | yes | Avatar image URL |
| icon | string | yes | Company icon URL |
| name | string | yes | Spanish company name |
| name_en | string | yes | English company name (displayed in UI) |
| description | string | yes | Spanish description |
| description_en | string | yes | English description (displayed in UI) |
| job | string | yes | Spanish job title |
| job_en | string | yes | English job title (displayed in UI) |
| loaded | boolean | yes | Loading state flag |
| importance | number | yes | Sort order (ascending) |

**Queries**:
- Home page (About Me): `collection("team")` → `orderBy("importance", "asc")`

---

## New Entity (Admin Section — US8 Only)

### User (Firebase Auth — no Firestore collection)

Firebase Authentication manages user accounts. No custom Firestore user collection is
needed for the initial admin section — Firebase Auth UID is sufficient for authorization.

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| uid | string | Firebase Auth | Unique user identifier |
| email | string | Firebase Auth | User email address |
| displayName | string | Firebase Auth | Optional display name |

**Auth flow**:
1. `signInWithEmailAndPassword(auth, email, password)` → `UserCredential`
2. `onAuthStateChanged(auth, callback)` → listen for auth state
3. `signOut(auth)` → sign out

**Authorization**: Any authenticated user can access admin. No role-based access
control needed for a single-user personal site. If needed later, Firestore Security
Rules can restrict writes to specific UIDs.

---

## Local Entity (Markdown Blog Posts)

### BlogPost (local files, not in Firestore)

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| slug | string | frontmatter | URL path segment |
| title | string | frontmatter | Post title |
| date | string | frontmatter | Publication date (ISO format) |
| featuredImage | string | frontmatter | Path to featured image |
| body | string | markdown content | Full HTML content rendered from markdown |

**Files**: `src/content/*.md` with YAML frontmatter:
```yaml
---
slug: "/first-steps-redux"
date: "2022-01-15"
title: "Primeros pasos con Redux"
featuredImage: "../assets/animation/folder.png"
---
```

---

## Entity Relationships

```
┌──────────────┐
│   BlogPost   │ (local markdown, no Firestore)
│   /blog/:slug│
└──────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     News     │     │     Post     │     │   Project    │     │     Work     │
│  (intro)     │     │  (patent)    │     │  (project)   │     │   (team)     │
│              │     │              │     │              │     │              │
│ Home: 6 max  │     │ Home: 1 max  │     │ Home: 2 feat │     │ Home: all    │
│ News: all    │     │ Posts: all   │     │ Projects: all│     │ (by import.) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
        │                    │                    │                    │
        └────────────────────┴────────────────────┴────────────────────┘
                                    │
                           Admin CRUD (US8)
                                    │
                            ┌───────────────┐
                            │  Firebase Auth │
                            │  (User)        │
                            └───────────────┘
```

No inter-entity foreign keys exist. Each collection is independent. The Post entity
has an optional `internalLink` field that maps to a BlogPost slug, but this is a
soft reference (string), not a Firestore document reference.
