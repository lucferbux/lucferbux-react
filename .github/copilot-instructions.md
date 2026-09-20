# Copilot Instructions

Project guidance for this repository lives in **[`AGENTS.md`](../AGENTS.md)** at the repo
root — tech stack, directory layout, coding conventions, build commands and deployment.

Keep instructions in that one file rather than duplicating them here, so the guidance can't
drift between tools.

## Read this first

`AGENTS.md` has a **"⚠️ Landmines"** section. The short version:

- Tailwind breakpoints are **redefined** (`xs` 450 · `sm` 550 · `md` 650 · `lg` 750 ·
  `xl` 1000 · `2xl` 1234 · `3xl` 1440 · `4xl` 2500). Snippets copied from Tailwind docs will
  target the wrong viewport.
- The codebase is **desktop-first** — match the surrounding `max-*` direction.
- Landing sections are **fixed-height with `overflow-hidden`**; new content clips silently.
- Dark mode is `prefers-color-scheme` only, implemented **three ways at once**.
- Firestore collection names are legacy: News→`intro`, Posts→`patent`, Projects→`project`,
  Work→`team`.
- Read Firestore text through `pick()` in `src/utils/localized.ts`, never `item.title_en`.
- Deploy is **Netlify**, not Firebase Hosting.
