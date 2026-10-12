---
slug: "/angular-flask-to-react-fastapi"
date: "2026-10-12"
title: "From Angular and Flask to React and FastAPI"
kicker: "Retrospective"
excerpt: "A team's default stack changed completely between 2018 and 2021. The interesting part is not what got picked, but why the old choice stopped being picked."
tags: [retrospective, angular, react, flask, fastapi]
featuredImage: "/images/banners/angular-flask-to-react-fastapi.svg"
---

This covers 2018 to 2021, on a team that was constantly starting prototypes. I
am writing it up because the whole arc is documented in the code I still have
from both ends of it.

## The starting point: Angular and Flask

In 2018 every new project was Angular in front and Flask behind. And it was a
good decision, even if it sounds dated now.

**Angular** came with everything: routing, forms, an HTTP client, dependency
injection, a CLI that generated the structure. For a team starting a prototype
every few weeks, not having to choose twelve libraries is a real saving. The
architecture arguments were already settled by the framework.

**Flask** was the opposite and fit just as well: one decorator and you have an
endpoint. To wrap a model or a script in an API, nothing more was needed.

What failed was neither of them on its own.

## What stopped working

**Angular's entry curve.** For someone arriving to contribute for six weeks,
modules, decorators, RxJS and zones are a lot to learn before being useful. When
a team rotates, the ramp costs more than the framework saves.

**Flask's contract did not exist.** The API lived in the head of whoever wrote
it, and in the code. With no schema, the front end guessed, and every silent key
rename broke something far away.

**Asynchrony.** More and more prototypes called models that take time, and
Flask's synchronous model pushes you into workers and queues for things that
should just be a wait.

## Where it went

**React with TypeScript** instead of Angular. Less framework, more library: you
have to pick a router and a state approach, but what you must learn to be
productive is far less. And TypeScript, which is what actually changed things:
what Angular provided as structure, types now provided instead.

**FastAPI** instead of Flask. The difference that matters is not speed, it is
that **the schema is the code**. You declare input and output types with
Pydantic and you get validation, documentation and a generated OpenAPI spec for
free. The contract that used to live in somebody's head became an artifact.

And around them, the parts that show up most day to day: Poetry instead of
`requirements.txt`, Alembic for migrations, Celery where genuine background work
was needed, and Jenkins. Before 2021, every project had its own hand-rolled
`deploy.sh` with an `scp` and an nginx config. Going from that to a pipeline
mattered more than any framework change.

## What I learned about migrating stacks

**A stack is not chosen once.** It is chosen by default, and the default gets
revisited when it hurts. What changed was not an architectural decision: it was
accumulating evidence that the on-ramp cost us more than the framework gave us.

**Old projects do not get migrated.** The ones on Angular stayed on Angular.
Rewriting something that works so it matches the new default is one of the worst
justified expenses there is. A default applies to what comes next.

**Templates are how a default actually changes.** While starting in the new
stack was more work than copying the previous project, nobody moved. The moment
there was a template with authentication, i18n, Docker and CI already solved,
the change happened on its own. A team does not adopt what you recommend; it
adopts whatever has least friction at the start.

## What I would not change

The 2018 decision was not bad for having been overtaken. Angular and Flask were
the right answer to the question being asked then: a small, stable team with
short, synchronous projects. When the team started rotating and the projects
started calling models, the question was a different one.

The mistake would have been keeping the answer after the question changed.
