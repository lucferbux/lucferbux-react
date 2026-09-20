---
slug: "/agentic-development-sessions"
date: "2026-09-01"
title: "Working with agents: one session per job"
kicker: "AI"
excerpt: "The problem isn't the model: it's putting planning, implementation and review in the same conversation."
tags: [ai, agents, productivity]
featuredImage: "/images/banners/agentic-development-sessions.svg"
---

When someone tells me coding agents "lose the plot on big tasks", they're almost always describing a single conversation in which they planned, implemented, debugged and reviewed. That isn't a model capability problem. It's a context problem.

## Why one long session degrades

Three things happen at once in a long conversation:

**Context fills with noise.** Output from a test that failed twenty minutes ago, a file that was read and then rewritten, three discarded attempts. All of it is still there, competing for attention with what actually matters now.

**Errors compound.** If the agent decided badly at step three, steps four through ten build on that decision. And because it's in its own context, it treats it as established fact rather than something to question.

**Reviewing your own work is biased.** Asking the same session to review what it just wrote produces a flattering review: it already "knows" why each decision was justified, because it made it.

## One session per job

What works is treating each phase as a separate job, with its own context and its own input and output artifact.

**Plan.** A read-only session. It explores, reads code, asks questions and produces **a written plan**. It touches nothing. This phase lives or dies by the questions: a plan that asked nothing is usually full of assumptions.

**Implement.** A fresh session whose input is the plan. It doesn't have the exploration history, and that's exactly the point: it starts from distilled context rather than the process that produced it.

**Review.** A clean session that sees the diff and the plan, but not the conversation that generated it. Without the original reasoning it has to judge the code by what it does, not by what it was meant to do. That's the difference between "this matches the plan" and "this is correct".

**Verify.** Run the tests, the linter, the build. This needs no model: it needs a command and a success criterion.

The artifact between phases is what makes it work. A markdown plan, a diff, a suite's output. Each is small, reviewable by a person, and carries none of the previous step's mess.

## The handoff is where information is lost

The fragile part isn't any phase: it's the step between them. A plan that says "refactor the auth module" isn't a handoff, it's a title.

What a plan needs so the next session doesn't rebuild everything:

- **Which files**, with paths, and why those.
- **Which contracts already exist** and shouldn't be reinvented: the function that already does this, the hook that already solves that.
- **The traps**: what looks right and isn't. This is where a repository rules file earns its keep.
- **How to verify**, as concrete commands.

Without that, the implementation session re-explores the repository from scratch and makes different decisions from the ones the plan agreed.

## Parallelise only what's independent

Several sessions at once help when the work genuinely doesn't overlap: exploring three areas of the codebase, reviewing four different dimensions of one diff, investigating two options to compare them.

What doesn't work is parallelising things that write to the same files. Two agents editing the same module produce a conflict somebody has to resolve by hand, and the time saved goes into resolving it.

A simple heuristic: if two jobs might read the same thing, run them in parallel; if they might write the same thing, run them in series.

## Adversarial review

Of all the phases, the one that has given me the most value is a review by a session that has no idea why the code was written.

The brief has to be explicit: *find the failure*. A review with vague instructions produces congratulations. One instructed to find concrete inputs that break the code produces findings, and each finding can be checked by running it.

The filter I use: a finding with no concrete case demonstrating it is an opinion. A finding with "given this input, this line returns that" is a bug, and there's nothing to debate — you run it.

## What to take away

Context is a resource, not an accumulator. A session that starts from a forty-line plan performs better than one dragging four hours of exploration, even when those four hours were its own. Separating the phases isn't ceremony: it's what stops an early mistake becoming the premise for everything after it.
