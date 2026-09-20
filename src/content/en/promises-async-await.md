---
slug: "/promises-async-await"
date: "2026-02-24"
title: "Promises and async/await: the mental model"
kicker: "JavaScript"
excerpt: "A promise isn't a function that waits — it's an object with state. Getting that right fixes most async bugs."
tags: [javascript, promises, async-await]
featuredImage: "/images/banners/promises-async-await.svg"
---

Most bugs in asynchronous code come from one wrong idea: thinking a promise *does* something. It doesn't. A promise is an object with state, representing a value that isn't there yet.

## Three states, one transition

A promise is in one of three states: **pending**, **fulfilled** or **rejected**. The transition happens **exactly once** and is irreversible.

```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve(42), 1000);
  setTimeout(() => resolve(99), 2000); // ignored entirely
});
```

The second `resolve` does nothing. The promise already settled. That's a useful guarantee: whoever consumes the promise knows the callback runs at most once.

And watch out for something surprising: **the executor runs synchronously**.

```js
console.log("before");
new Promise(() => console.log("inside"));
console.log("after");
// before, inside, after
```

Creating the promise isn't the asynchronous part. `.then` is.

## `.then` returns a new promise

This is what makes chaining work, and the part most often misread.

```js
fetchUser()
  .then((user) => user.id)        // a promise of an id
  .then((id) => fetchOrders(id))  // a promise of orders
  .then((orders) => orders.length);
```

Each `.then` creates a new promise. If the callback returns a value, the new promise fulfils with it. If it returns a promise, **that promise is awaited** before continuing. If it throws, the new promise rejects.

Which produces the most common chaining bug: a missing `return`.

```js
// Wrong: the chain doesn't wait for fetchOrders
.then((id) => { fetchOrders(id); })

// Right
.then((id) => { return fetchOrders(id); })
.then((id) => fetchOrders(id))  // equivalent
```

Without `return` the callback yields `undefined`, the chain continues immediately, and the next `.then` gets `undefined` while the request is still in flight.

## `async/await` is the same machine

`async/await` adds no capability. It's syntax, and knowing that stops you expecting magic.

- An `async` function **always** returns a promise, even if you `return 1`.
- `await` doesn't block the thread. It pauses *that function*, hands control back to the event loop, and schedules the rest as a microtask.

```js
async function total() {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  return orders.length;
}
// equivalent to the .then chain above
```

The real win is that `try/catch` works again, and with it intermediate variables:

```js
try {
  const user = await fetchUser();
  const orders = await fetchOrders(user.id);
  // `user` is still in scope here, which is awkward with .then
} catch (error) {
  // catches a rejection from either
}
```

## The sequential `await` that shouldn't be

The most frequent performance mistake:

```js
// 600 ms: waits for one, then the other
const user = await fetchUser();     // 300 ms
const config = await fetchConfig(); // 300 ms
```

If `fetchConfig` doesn't depend on `user`, you're waiting for no reason. Start both:

```js
// 300 ms: both in flight
const [user, config] = await Promise.all([fetchUser(), fetchConfig()]);
```

The difference is *when you call the function*, not where you put the `await`. `Promise.all` receives promises that have already started.

Mind the semantics: `Promise.all` **rejects as soon as one fails**, discarding the rest. When you want every result regardless, use `Promise.allSettled`:

```js
const results = await Promise.allSettled([a(), b(), c()]);
// [{status: "fulfilled", value}, {status: "rejected", reason}, ...]
```

And for races: `Promise.race` settles with the first to finish either way; `Promise.any` with the first to **succeed**.

## Unhandled rejections

A rejected promise with no `catch` is a silent failure in many environments, and an uncaught exception in modern Node. Two places it escapes:

```js
// The catch covers nothing: the error happens later
try {
  setTimeout(() => { throw new Error("lost"); }, 0);
} catch { }

// forEach waits for nothing
items.forEach(async (item) => {
  await save(item); // the rejection goes nowhere
});

// Instead
await Promise.all(items.map((item) => save(item)));
```

`forEach` ignores its callback's return value, so the promises are orphaned: nothing awaits them and nothing catches their errors.

## What to take away

A promise is **a future value**, not a running task. The task started when you called the function; the promise is just the receipt. Once you think of it that way, two things become obvious: why `Promise.all` is faster — the work was already under way — and why a missing `return` breaks the chain — you kept the receipt and then threw it out.
