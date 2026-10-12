---
slug: "/bff-per-module-go"
date: "2026-10-12"
title: "One BFF per module, written in Go"
kicker: "Architecture"
excerpt: "If every module in a console talks to Kubernetes from the browser, you end up handing out permissions you should not. A backend per module changes that conversation."
tags: [go, bff, kubernetes, architecture, security]
featuredImage: "/images/banners/bff-per-module-go.svg"
---

This describes the pattern we used through 2025, documented in the open in
[`mod-arch-library`](https://github.com/opendatahub-io/mod-arch-library).

## Why a backend when you already have an API

The temptation, building a console on top of Kubernetes, is to talk to the
cluster API directly from the browser. It exists, it is REST, it has
authentication. Why put a service in between?

Three reasons, and they all arrive together:

**Permissions.** For the browser to list some resources, the user's token has to
be able to list them. That means granting permissions over cluster objects to
anyone who opens the console, and those permissions cannot be narrowed to "only
for drawing this table".

**The shape of the data.** A screen almost never corresponds to one resource. A
model view needs the object, its deployment, its status and two or three other
things. Making five calls from the browser and stitching them there is slow and
brittle.

**What leaks.** The API response carries fields the user does not need and
sometimes should not see. Filtering in the client is filtering after you already
sent it.

A BFF — backend for frontend — is a small service whose only client is one
specific interface. It is not a general-purpose API: it is that screen's
backend.

## The central piece: a client per user

This is the decision that most defines the design, and the one most often got
wrong.

The BFF does **not** hold a broadly-privileged service account it serves
everybody with. Every request arrives with the user's token, and the BFF builds
an ephemeral Kubernetes client from that token, for that request:

```go
func (a *App) clientFor(r *http.Request) (client.Client, error) {
    token := bearerToken(r)
    if token == "" {
        return nil, errNoIdentity
    }
    cfg := rest.CopyConfig(a.baseConfig)
    cfg.BearerToken = token
    cfg.BearerTokenFile = ""   // otherwise the file wins over the token
    return client.New(cfg, client.Options{Scheme: a.scheme})
}
```

The consequence is the one that matters: **the BFF cannot do anything the user
could not do themselves.** If they lack permission to read a resource, the
request fails at the API server, not at a check of ours. We are not implementing
authorisation; we are letting the component that already has it do its job.

That `BearerTokenFile = ""` on the fourth line is a detail that costs an
afternoon to find: if the pod has its service account token mounted and you do
not explicitly clear it from the copied config, the client uses the file and you
find yourself serving requests with the pod's permissions. Which is exactly what
you set out to avoid, working apparently fine.

## `App` as the dependency container

Go ships no dependency injection and does not need any. A struct holding what
the service needs, built at startup, is enough:

```go
type App struct {
    config     Config
    logger     *slog.Logger
    baseConfig *rest.Config
    repos      Repositories   // interfaces, not implementations
}
```

`repos` being interfaces is what allows the service to run in mock mode, with no
cluster and fake data. That is not a luxury for tests: it is what lets someone
on the UI team work from a laptop without provisioning anything.

## Tiered middleware

Different routes need different guarantees, and it helps if that reads in the
routing rather than inside each handler:

```go
router.GET("/healthcheck",            app.public(app.HealthHandler))
router.GET("/api/v1/models",          app.secure(app.ListModelsHandler))
router.POST("/api/v1/settings",       app.admin(app.UpdateSettingsHandler))
```

`public` asks for no identity. `secure` requires a valid token and builds the
user's client. `admin` additionally checks admin group membership. They are
three short wrappers, and their value is not technical: reading the routes file
tells you the access level of every endpoint without opening anything else.

## An envelope for responses

Every response is wrapped:

```go
type Envelope[T any] struct {
    Data  T      `json:"data"`
    Error *Error `json:"error,omitempty"`
}
```

It looks like ceremony and it saves arguments. The client has one way to tell
success from failure, and adding metadata later — pagination, warnings — breaks
nobody.

## What it cost

**One BFF per module is a lot of BFFs.** Ten modules are ten services, ten
deployments, ten images to patch when a Go CVE lands. The shared library exists
for that reason: without it every team reinvents the middleware and half of them
get it wrong.

**Mock mode rots if it is not used.** If the fake-data path is not in CI, it
stops working within a month and nobody notices until a new colleague tries to
start the project.

If I had to keep one idea: the BFF is not there to add logic. It is there so the
browser does not need permissions.
