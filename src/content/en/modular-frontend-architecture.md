---
slug: "/modular-frontend-architecture"
date: "2026-07-07"
title: "Modular front-end architecture: what pays off and what doesn't"
kicker: "Architecture"
excerpt: "Micro-frontends solve an organisational problem, not a technical one. Worth being clear which before adopting them."
tags: [architecture, micro-frontends, react, kubernetes]
featuredImage: "/images/banners/modular-frontend-architecture.svg"
---

A front-end monolith doesn't fail for technical reasons. It fails when eight teams share one repository, one release pipeline and one deployment window, and any of them can block the rest. If that isn't your problem, micro-frontends will cost you more than they give.

## The signal that it's time

Three symptoms show up together:

- One team's green test blocks a deployment from another team that changed nothing.
- Release cadence is set by the slowest team rather than by the product.
- Adding a new feature means modifying code that isn't yours.

What matters is that none of the three is a performance or bundle-size problem. They're problems of **organisational coupling**, and the fix is isolating the lifecycle, not the code.

## What to decide first

Before choosing a tool, three contracts determine whether this works at all.

**When composition happens.** At build time, each module is an npm package: simple, shared types, with the drawback that publishing requires rebuilding the container. At runtime (Module Federation, import maps) each module deploys on its own, at the cost of integration errors surfacing in production rather than CI.

The deciding question is simple: *does a team need to deploy without coordinating with the others?* If the answer is no, build-time composition is cheaper in every dimension.

**What is shared.** This causes the most trouble. React, the router and the design system must be singletons: two copies of React on the same page break hooks, and two routers fight over the URL.

```js
// Module Federation: one instance, shared
shared: {
  react: { singleton: true, requiredVersion: "^18.3.0" },
  "react-dom": { singleton: true, requiredVersion: "^18.3.0" },
  "react-router-dom": { singleton: true },
}
```

Everything else should be private to each module. The temptation to share utilities "to avoid duplication" is exactly what reintroduces the coupling you were removing.

**How they communicate.** The boring answer is the right one: through the URL and through events, not shared state. A module reading another module's store is a monolith with extra steps.

## The shared library is the product

If one piece decides whether this scales, it's the common library. Not for the components — for the scaffolding.

When the library provides routing, authentication, data fetching and error handling, a new module is a `package.json` and a route. When it doesn't, every team reimplements its own version, you end up with eight different ways of showing a network error, and someone from the platform team sits in on every onboarding.

The real measure of success isn't the number of modules. It's **how many platform engineers it takes to add one**. When that number reaches zero, the architecture is working.

## What it costs

Worth being honest about the price, because it isn't small.

**The bundle grows.** Even with React shared, each module brings its own dependencies. Without a size budget measured in CI, this degrades on its own.

**Debugging crosses boundaries.** A failure visible in one module can come from the version of the common library another module loaded. Source maps and a visible version in the UI stop being a luxury.

**Versioning becomes real.** In a monolith, a breaking change is fixed in the same commit. With separately deployed modules you have two versions coexisting in production and you need a compatibility window.

**You need contract tests.** Each module's unit tests say nothing about integration. You need a layer — contract tests, or an end-to-end smoke run of the container with the real modules — that does.

## The pattern that has worked best

On the platform I work on, the combination that has proved sustainable is:

- **A thin container**: layout, authentication, top-level routing. No business logic.
- **Modules with their own backend-for-frontend**, each deployed in its own pod. Isolating the front-end deployment without isolating the backend leaves the coupling exactly where it was.
- **A versioned common library** carrying the scaffolding, not just components.
- **A Kubernetes operator** deciding which modules exist in a given installation, so enabling one is a configuration change rather than a rebuild.

That last piece is what turns "we deploy together" into "they deploy themselves", and it's also the one that takes longest to build.

## The prior question

Before any of this: how many teams touch the front end today? If the answer is one or two, a well-structured monolith — clear folder boundaries and a lint rule forbidding imports across them — gives you nearly all the benefits and none of the costs. And if real modules are ever needed, those boundaries are exactly where you cut.
