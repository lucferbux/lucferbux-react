---
slug: "/objective-c-in-2016"
date: "2026-10-12"
title: "Why we wrote a whole app in Objective-C in 2016"
kicker: "Retrospective"
excerpt: "Swift had been out for two years and was the obvious bet. We picked the old language, and the reason was not fear of change."
tags: [retrospective, ios, objective-c, swift, decisions]
featuredImage: "/images/banners/objective-c-in-2016.svg"
---

This is from 2016, at my first job, and complements what I wrote about
[white-labelling that same app](/blog/ios-white-label-2016).

## The decision

A new iOS app, from scratch, in 2016. Swift had been public for two years, Apple
was pushing hard, and every talk said the same thing. We wrote the entire
application in Objective-C and C.

From a distance that reads as conservatism. Up close it was a fairly narrow
decision.

## The specific reason

The app talked to IP cameras through their manufacturers' SDKs. Those SDKs were
C libraries, with C headers, pointers, structs, and callbacks handing back data
in memory you are responsible for.

Objective-C is a superset of C. You include the header and that is it: you call
the function, pass the pointer, and understand exactly what is happening to the
memory.

Swift interoperates with C too, but in 2016 interoperating meant writing a
bridging layer. Types like `UnsafeMutablePointer<UInt8>`, conversions for every
struct, and particular care with any callback the SDK invokes from its own
thread. That layer is code which adds no features, has to be maintained, and is
exactly where the memory bugs appear that later take weeks to reproduce.

The calculation was: **the risk is not in the app's language, it is at the
boundary with C.** And the way to minimise that boundary was not to have one.

## The context people forget

Two things about 2016 are worth remembering before judging the decision.

**Swift still broke source between versions.** The Swift 2 to Swift 3 migration,
late in 2016, renamed much of the standard library and the Cocoa APIs. It was
real work for existing projects, with migration tooling that got it right almost
every time. For a small team with an app in production and twenty-odd variants
to ship, "almost every time" is not a comforting phrase.

**There was no ABI stability.** That arrived with Swift 5, in 2019. Until then
every app embedded the language libraries in its own binary, which inflated
every download. With one app per reseller, that multiplied.

Neither of those made Swift a bad choice in general. Both weighed heavily in our
particular case.

## What we lost

Worth being honest, because the decision had a cost.

**Type safety.** Swift's optionals eliminate an entire category of bug. In
Objective-C, sending a message to `nil` does not blow up — it simply does
nothing — which turns loud errors into quiet, strange behaviour.

**Readability.** Objective-C's syntax pushes away anyone arriving from another
language. Onboarding someone cost more.

**The ecosystem's direction.** Every passing year, more libraries shipped
Swift-first — or Swift-only — and more new documentation assumed Swift.

## What I would do today

The same thing, inverted: Swift for everything, with a small Objective-C or C
module isolating the vendor SDK behind a clean interface.

That is exactly what was impractical then and is routine now. Not because the
idea was bad in 2016, but because tooling made it cheap: Swift modules, improved
interoperability and language stability turn what was a fragile bridging layer
into an ordinary boundary.

## The part that still holds

The useful question was never "which language is better?". It was "where is the
risk in this particular project?".

The risk was in a third party's memory handling and threading. Anything that
shrank that boundary won, and anything that widened it lost, however modern.

Technical decisions that age well are almost never the ones that picked the new
thing or the old thing. They are the ones that correctly identified where the
problem was.
