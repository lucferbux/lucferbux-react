---
slug: "/bff-to-bff-communication"
date: "2026-10-12"
title: "When one backend has to call another"
kicker: "Architecture"
excerpt: "A service per module works until one needs data from another. That is where the uncomfortable question shows up: with whose permissions?"
tags: [architecture, go, kubernetes, security, microservices]
featuredImage: "/images/banners/bff-to-bff-communication.svg"
---

This is from late 2025 and follows on from
[one BFF per module](/blog/bff-per-module-go).

## Where the model breaks

A backend per module is clean while every module is self-sufficient. The crack
appears the day a screen needs something that is not its own: the catalogue
wants to know whether a model is deployed, and another module owns that.

There are three ways out and two of them are bad.

**Let the browser make both calls.** Tempting, because nothing on the server has
to change. But it hands composition back to the client, and worse, it forces the
client to know the topology: it has to know another module exists and what it is
called.

**Let the first backend talk to the cluster API directly.** Which means
reimplementing what the second one already does. Two places reading the same
resource, two interpretations, and the second one goes stale.

**Let one backend call the other.** The right answer, and the one that opens the
hard question.

## The hard question

When service A calls service B, with what identity does it call?

The easy answer is to give A its own service credential. And it is the answer
that destroys everything we had built: if A can read from B with its own
permissions, then any user who reaches A can read from B, permitted or not. You
have just invented privilege escalation shaped like a microservice.

The rule we followed is stricter and much easier to reason about:

> A request between services carries the original user's identity. Never the
> service's. A backend cannot do anything on someone's behalf that the person
> could not do themselves.

In practice, the user token arriving at A is forwarded to B. B builds its
Kubernetes client from that token, exactly as it would for a direct request. If
the user lacks permission it fails at the API server, which is where it should
fail.

This makes an entire class of bug impossible. There is no path by which someone
gains access by traversing services, because there is no point in the chain
where permissions grow.

## Finding the other service

That leaves addressing. A cannot carry B's URL, for the same reason the host
cannot carry the remotes' URLs: they depend on the cluster it is installed into.

The solution is the same piece. The operator, which knows which modules are
enabled and what `Service` each has, injects those addresses as environment
variables into every deployment. The service reads them at startup and builds
its clients.

```go
type Clients struct {
    ModelRegistry Client
    GenAI         Client
}

func NewClients(env Env) Clients {
    return Clients{
        ModelRegistry: New(env.ModelRegistryURL),
        GenAI:         New(env.GenAIURL),
    }
}
```

Making it an environment variable rather than dynamic discovery is deliberate:
if it is missing, the service does not start. A deployment mistake shows up at
deployment, not three days later when somebody opens the screen that needed it.

## Mock mode, again

The same pattern that was needed to develop without a cluster matters more here.
If working on module A requires module B running, which in turn wants C, nobody
is going to work from a laptop.

Every client has a mock implementation behind the same interface, and a variable
decides which one is used. It is not for the tests: it is so that starting to
contribute costs an `npm start` rather than an afternoon of provisioning.

## What is still missing, and worth saying

**Cascading failures.** If B is slow, A is slow. There are timeouts, but no
circuit breaker. That is known debt, not an oversight.

**The network has to be closed explicitly.** A being able to call B does not
mean everything should be able to call everything. Network policies permitting
only the intended routes are part of the design, not a security extra bolted on
later.

**Cross-service observability.** Knowing which user request caused which
internal call means propagating a trace identifier, and that is far easier to
add at the start than to retrofit.

## The idea I keep

Forwarding identity rather than substituting it is not a security decision taken
at the end: it is what makes the system tractable. When every hop preserves the
user, the question "may this person do this?" has one answer, and it lives in
one place.
