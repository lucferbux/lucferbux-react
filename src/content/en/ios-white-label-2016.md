---
slug: "/ios-white-label-2016"
date: "2026-10-12"
title: "White-labelling iOS before Xcode made it easy"
kicker: "Retrospective"
excerpt: "One app, twenty-odd resellers, an App Store listing for each. In 2016 you solved that by duplicating targets and hoping."
tags: [retrospective, ios, objective-c, xcode, build]
featuredImage: "/images/banners/ios-white-label-2016.svg"
---

This is from 2016 and 2017, at my first job. We made an iOS video surveillance
app for IP cameras, and every reseller sold it under their own brand. The code
no longer exists and predates my public GitHub account, so this is from memory
and from the documentation I still have.

## The brief

One application. Twenty-odd resellers. Each wanted their name, their icon, their
colours and their own App Store listing, because their customers searched for
their brand and not ours. And all of them wanted the same features, except a few
who paid for a version with extras.

From here it sounds like a solved problem. In 2016, on Xcode 7 and 8, it was
not.

## What we did

**One target per reseller.** An Xcode target is a build recipe: which files go
in, under which identifier, with which resources and icons. Duplicating the
target and swapping its resources produced a different app from the same code.

Twenty targets in one project sounds bad and worked reasonably well, as long as
one rule held: **no source file is ever added to a specific target.** They all
belong to all of them. The only things that vary are resources and
configuration. The moment somebody added a class to one target to fix something
quickly, the next person spent an afternoon working out why it compiled under
one brand and not another.

**A convention for identifiers.** The bundle identifier was derived from the
reseller's domain, reversed:

```
www.reseller.es   ->   es.reseller.easyview
```

Making it a rule rather than a case-by-case decision removed a recurring
conversation. When a new reseller came in, their identifier was not debated: it
was computed.

**A branch for the flavours.** Branding changes lived on a separate branch that
merged into development. I would do something else today; back then it was what
let us add a reseller without touching the branch everyone else worked on.

## What it cost

**Twenty times everything.** Twenty listings, twenty screenshot sets, twenty
descriptions, twenty certificates and provisioning profiles. Every release was a
full day, and the typical failure was not code but process: a screenshot from
the wrong brand, a profile that expired on the day you needed to ship.

**The icons.** Each target needed its complete set of sizes. A reseller sent one
large PNG and the whole family had to be generated. We automated it late, after
doing it by hand too many times, which is the wrong order and the one that keeps
happening.

**The risk of divergence.** The pressure for "just for this customer, just this
once" was constant. Every time we gave in, the system looked a little more like
twenty applications and a little less like one. What held it together was not a
tool: it was saying no often enough.

## What would be different today

Nearly everything, and it is worth admitting that rather than telling the war
story as though it still applied:

- **xcconfig** files and schemes do much of what we did by duplicating targets.
- **Fastlane** turns that release day into a command.
- **App clips** and remote configuration cover part of what then forced separate
  binaries.
- And above all, today I would ask whether twenty apps are needed at all. Often
  what the customer wants is to see their logo, and that does not require its
  own store listing.

## What I still use

Two things stayed with me.

First: **a mechanical convention beats a good decision.** The reversed-domain
rule was not the best conceivable way to name anything. Its value was that
nobody had to think about it.

Second: **what can be customised has to be bounded by design, not by
willpower.** While the variable parts were resources and configuration, the
system carried twenty brands. The day the variable part could be code, it would
have stopped being one application.
