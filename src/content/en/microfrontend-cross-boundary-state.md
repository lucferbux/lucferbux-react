---
slug: "/microfrontend-cross-boundary-state"
date: "2026-10-12"
title: "The state that will not cross the boundary"
kicker: "Micro-frontends"
excerpt: "Two federated modules share React, share the page, and do not share context. The reason is more interesting than the symptom."
tags: [micro-frontends, react, module-federation, state]
featuredImage: "/images/banners/microfrontend-cross-boundary-state.svg"
---

This is from early 2026 and follows on from
[Module Federation](/blog/module-federation-kubernetes).

## The symptom

The user picks a project in the navigation. They enter a federated module and
the module does not know which project they picked: its selector is empty, or
worse, shows something else.

What makes it disorienting is that everything else works. Same React, same page,
apparently one component tree. The `Provider` is clearly above the component
reading it. And `useContext` still returns the default.

## Why it happens

React context is not looked up by name: it is looked up by **object identity**.
`createContext()` returns an object, and `useContext(MyContext)` walks up the
tree looking for a `Provider` whose context is *that exact object*.

With Module Federation, the host and the remote can end up loading separate
copies of the module that defines the context. Two calls to `createContext()`,
two objects, and the remote's `useContext` looks for a provider that, from where
it stands, does not exist.

It does not throw. It returns the default value, which is almost always
`undefined` or an empty object. That is why the symptom looks like a data
problem rather than a module-loading one.

```
host   ──> shared-package (copy A) ──> createContext() ──> object A
remote ──> shared-package (copy B) ──> createContext() ──> object B

<Provider value={x}>  uses object A
useContext(...)       looks for object B   ->  default value
```

## The first thing to rule out

That the package is genuinely shared. In the federation config, both React and
the library defining the context have to be declared `singleton`. If that is
missing, there really are two copies and the rest of the investigation is moot.

```js
shared: {
  react: { singleton: true, requiredVersion: "^18.0.0" },
  "@scope/shared-ui": { singleton: true },
}
```

But sharing correctly is **not always enough**. If the remote loads before the
host has initialised the share scope, or if versions do not satisfy the declared
range, federation silently resolves to its own copy. The same code works in
development and fails deployed, which is the most irritating way to fail.

## The stopgap, and why it is not enough

The first thing we did was take the value out of context and put it in
`localStorage`, with an event to notify changes. It works, it unblocks, and it
has three problems worth saying out loud:

- **It is global to the origin.** Two tabs share the value, even when the user
  wants to be looking at two different projects.
- **It is text.** Everything passing through is serialised, and live objects —
  functions, instances — do not fit.
- **It has no owner.** Any module can write any key. A few months in, nobody
  knows who sets what.

It is an honest sticking plaster. The mistake would be calling it architecture.

## Where it goes

What actually resolves this is an explicit store for crossing boundaries: a
small object, created once by the host, hung somewhere every module can reach
without going through the module system. With a deliberately poor API — read,
write, subscribe — and a closed set of keys that are documented.

The important part is not technical. It is that **what crosses the boundary has
to be a short, written-down list**. The moment any module can share anything,
you have rebuilt the global state micro-frontends set out to avoid, only now
distributed and untyped.

## What I take from it

That a module boundary is not only a deployment boundary. It is an identity
boundary: two copies of the same code are two different things to JavaScript,
even when they are byte-identical.

And that failures returning a default instead of throwing cost the most time. A
loud error takes you to the place; a silent `undefined` takes you to search in
the wrong place for two days.
