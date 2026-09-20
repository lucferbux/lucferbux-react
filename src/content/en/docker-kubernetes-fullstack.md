---
slug: "/docker-kubernetes-fullstack"
date: "2026-06-23"
title: "From docker-compose to Kubernetes without losing the thread"
kicker: "Full Stack"
excerpt: "The jump isn't syntax: it's going from describing processes to describing the state you want."
tags: [full-stack, docker, kubernetes, ci-cd]
featuredImage: "/images/banners/docker-kubernetes-fullstack.svg"
---

In the workshop, the containers module is where most people get stuck, almost always for the same reason: they try to translate `docker-compose.yml` into Kubernetes YAML line by line. It doesn't translate, because the two tools answer different questions.

## The image first, and make it small

Before Kubernetes, the image. The usual mistake is a single stage that drags every development `node_modules` and the source code into production.

```dockerfile
# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # ci, not install: respects the lockfile
COPY . .
RUN npm run build

# Stage 2: only what is needed to run
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Don't run as root.
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Two details matter more than they look. `COPY package*.json` **before** the rest of the code lets the dependency layer be reused while the lockfile is unchanged: a change in your code reinstalls nothing. And `USER node` is the difference between a container-escape vulnerability that hands over root and one that doesn't.

For the front end, the final stage isn't Node: it's a static server.

```dockerfile
FROM nginx:alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

With a SPA, that `nginx.conf` needs the `try_files` rule returning `index.html` for any path, or refreshing on `/projects` gives a 404.

## compose is for development

`docker-compose` answers "start these three processes together on my laptop". That stays useful and doesn't go away:

```yaml
services:
  api:
    build: { context: ./api, target: build }
    command: npm run dev
    volumes: ["./api/src:/app/src"]     # hot reload
    environment: { MONGO_URL: mongodb://db:27017/app }
    depends_on: { db: { condition: service_healthy } }
  db:
    image: mongo:7
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
```

That `healthcheck` with `condition: service_healthy` avoids the classic: the API starts before Mongo, fails to connect, and crash-loops.

## Kubernetes describes state, not steps

Here's the mental shift. In compose you say "run this". In Kubernetes you declare "I want three healthy replicas of this image, reachable under this name", and the controller keeps making that true — now and in a month.

The three minimum pieces:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.4.2   # never :latest
          ports: [{ containerPort: 3000 }]
          envFrom:
            - secretRef: { name: api-secrets }
          resources:
            requests: { cpu: 100m, memory: 128Mi }
            limits:   { memory: 256Mi }
          readinessProbe:
            httpGet: { path: /healthz, port: 3000 }
          livenessProbe:
            httpGet: { path: /healthz, port: 3000 }
            initialDelaySeconds: 15
---
apiVersion: v1
kind: Service
metadata: { name: api }
spec:
  selector: { app: api }
  ports: [{ port: 80, targetPort: 3000 }]
```

Four decisions that save incidents:

**Never `:latest`.** With a moving tag, two replicas of the same Deployment can be running different code, and a rollback has nowhere to go back to.

**Always set `requests`.** Without them the scheduler doesn't know what you need and packs pods until the node runs out of memory.

**Memory limits yes, CPU limits carefully.** Exceeding memory kills the process; exceeding CPU only slows it. A CPU limit set too low produces latency that looks like an application bug.

**`readiness` and `liveness` are not the same.** Readiness decides whether traffic reaches you; liveness decides whether you get restarted. Pointing liveness at an endpoint that queries the database is a recipe for cascading restarts when the database is slow: your application is alive, it's just waiting.

## Configuration and secrets

Whatever differs between environments lives outside the image. The same image should deploy to development and production by changing only the `ConfigMap` and the `Secret`. The moment you build a different image per environment, you've lost the guarantee that what you tested is what you deploy.

And a Kubernetes `Secret` is Base64, not encryption. For the repository you need something like Sealed Secrets or an external manager.

## Kustomize before copy-paste

With three environments comes the temptation of three copies of the YAML. Kustomize prevents the divergence: one common base and a patch per environment.

```yaml
# overlays/production/kustomization.yaml
resources: ["../../base"]
patches:
  - patch: |
      - op: replace
        path: /spec/replicas
        value: 5
    target: { kind: Deployment, name: api }
images:
  - name: registry.example.com/api
    newTag: 1.4.2
```

The CI pipeline only has to update that `newTag` and apply. Everything else lives in git, and `kubectl diff -k` tells you exactly what will change before it changes.

## The order I recommend

A multi-stage image that works locally, compose for developing, and only then Kubernetes. Jumping straight to YAML without a solid image means debugging two problems at once, from the place where you have the least information.
