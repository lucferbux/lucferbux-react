# CLAUDE.md

Personal website and PWA for `lucferbux.dev` — Vite + React 18 + TypeScript + Tailwind v4,
backed by Cloud Firestore, deployed to Netlify.

All project guidance lives in one place so the two files can't drift:

@AGENTS.md

**Before changing any layout or styling, read the "⚠️ Landmines" section of `AGENTS.md`.**
The Tailwind breakpoints are redefined, the landing sections are fixed-height with
`overflow-hidden`, and dark mode is implemented three different ways at once.

Run `npm run visual` after any visual change — it diffs every route at seven widths in both
colour schemes.

The baseline is **gitignored and local**. On a fresh clone, or after pulling someone else's
work, capture one on the unmodified tree first:

```bash
npm run visual:baseline   # on a clean tree
npm run visual            # after your change
```
