---
slug: "/ai-coding-rules"
date: "2026-08-18"
title: "Effective rules for AI assistants in a repository"
kicker: "AI"
excerpt: "What to put in AGENTS.md or CLAUDE.md so it earns its place: not conventions, but the traps a model cannot infer."
tags: [ai, productivity, tooling]
featuredImage: "/images/banners/ai-coding-rules.svg"
---

Almost every AI rules file I've seen is full of things that don't help. "Use strict TypeScript." "Write tests." "Follow the project conventions." The model already knows that, or can work it out from two files.

What it cannot work out is what looks right and is wrong.

## The test: could it discover this by reading the code?

If yes, don't write it. It consumes context and changes no decision.

What earns a place is anything that **looks like one thing and is another**. Three real examples from this very repository:

```md
### Tailwind breakpoints are redefined

xs 450 · sm 550 · md 650 · lg 750 · xl 1000 · 2xl 1234

`md:` is NOT 768px. Any snippet copied from the Tailwind docs will target
the wrong viewport.
```

No model is going to guess that: `md:` means 768px in 99% of projects in the world, and the training distribution reflects it. One line prevents a class of bug that only shows up at one specific width.

```md
### Firestore collection names are legacy

News → `intro`, Posts → `patent`, Work → `team`. Do not "fix" them.
```

Without that note, a reasonable assistant renames `patent` to `posts` and orphans every production document.

```md
### Never set a background-color on `html`

`body` is the canvas painter. Tried in 70d92b1, reverted in 88b2d24.
```

That's the most valuable shape a rule can take: a decision with its scar attached. The revert commit is proof that somebody already tried it.

## Write the why, not just the what

A rule without justification gets disobeyed the moment it's inconvenient, by a person or a model alike.

```md
<!-- Useless -->
Don't run Prettier on src/content/.

<!-- Useful -->
Prettier doesn't touch src/content/: those are articles, and it reformats
the code samples *inside* fenced blocks, editing the teaching material and
changing the rendered page height.
```

The second version also lets you reason about new cases. If another folder of prose appears tomorrow, the rule generalises itself.

## One file, several pointers

The tools multiply: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.cursor/rules`. Keeping the same content in four places guarantees three are stale.

What works is putting the content in one and having the rest point at it:

```md
<!-- CLAUDE.md -->
All project guidance lives in one place:

@AGENTS.md

Before touching layout or styling, read the "Landmines" section.
```

## A rule contradicted by the code is worse than no rule

This is the failure that does the most damage, and it's silent. A rules file describing how the project *used to be* trains the assistant to write the wrong code with complete confidence.

In this repository, `AGENTS.md` claimed for months that deployment was Firebase Hosting. The workflow had been deleted long before and the site was on Netlify. Any assistant reading that file was reasoning about infrastructure that didn't exist.

The practical conclusion: when you fix something the rules describe, **delete the rule in the same commit**. Two of this repository's landmines described problems that got solved; they went stale the day they were fixed, and were replaced with what is now true.

## Put the verification within reach

Last, and the highest-leverage item: the file should say how to check that something hasn't broken.

```md
Run `npm run visual` after any visual change: it diffs every route at seven
widths in both colour schemes against committed screenshots.
```

An assistant that knows how to verify itself stops proposing changes and starts proposing checked changes. That's the difference between a suggestion and a patch.

## The acid test

When you've finished the file, ask a fresh assistant two questions whose answers live only there. In this repository they'd be: "what does `md:` mean?" and "which collection holds the projects?". If it answers 650px and `project` without reading a single file, the document works. If it answers 768px, you haven't written rules — you've written decoration.
