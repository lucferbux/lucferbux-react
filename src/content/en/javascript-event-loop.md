---
slug: "/javascript-event-loop"
date: "2026-02-10"
title: "The JavaScript engine, the call stack and the event loop"
kicker: "JavaScript"
excerpt: "Why JavaScript is single-threaded and still doesn't block: engine, call stack, task queue and microtasks."
tags: [javascript, fundamentals, event-loop]
featuredImage: "/images/banners/javascript-event-loop.svg"
---

There's a line that comes up in every front-end interview: "JavaScript is single-threaded." It's true, and it explains almost nothing. If there's only one thread, how can a network request take two seconds while the interface stays responsive? The answer isn't in the language. It's in the environment running it.

## The engine only knows how to execute code

A JavaScript engine — V8 in Chrome and Node, JavaScriptCore in Safari, SpiderMonkey in Firefox — has two pieces: the *heap*, where objects live, and the *call stack*, where function calls pile up.

The stack works exactly as the name suggests. Call a function and a frame is pushed. When it returns, the frame is popped.

```js
function third() {
  throw new Error("here");
}
function second() {
  third();
}
function first() {
  second();
}
first();
```

The stack trace you see in the console is literally the contents of the stack at the moment of the error, read top to bottom. It isn't a metaphor. It's the data structure.

And here's the key point: **the engine knows nothing about `setTimeout`, `fetch` or the DOM**. None of those are part of the language. They are APIs the environment provides.

## The environment is what waits

When you write `setTimeout(fn, 1000)`, the engine does one thing: call a function the browser hands it, and pop it immediately. The timer is the browser's problem, on another thread, out of your control.

A second later the browser can't just run `fn` — the stack might be busy, and JavaScript doesn't do two things at once. Instead it drops `fn` into the **task queue**.

The **event loop** is the loop watching both structures:

> If the call stack is empty, take the first task off the queue and push it.

That's the whole thing. A conceptual `while` with one condition. And it explains the behaviour everyone finds strange the first time:

```js
console.log("one");
setTimeout(() => console.log("two"), 0);
console.log("three");

// one
// three
// two
```

A 0 ms `setTimeout` doesn't mean "run this now". It means "queue this as soon as possible". The queue isn't touched until the stack empties, and the stack doesn't empty until the whole synchronous script has finished.

## Microtasks jump the queue

Promises don't use the task queue. They use the **microtask queue**, which has priority: the event loop drains it **completely** after each task, before taking the next one.

```js
console.log("script");

setTimeout(() => console.log("timeout"), 0);

Promise.resolve().then(() => console.log("promise"));

console.log("end");

// script
// end
// promise
// timeout
```

`promise` comes out before `timeout` even though it was registered later. This has an uncomfortable practical consequence: a chain of microtasks that regenerates itself **blocks rendering indefinitely**, because the event loop never reaches the next task.

```js
// Don't do this: the page stops responding.
function loop() {
  Promise.resolve().then(loop);
}
loop();
```

With `setTimeout` the same loop would be harmless, because between tasks the browser gets to paint.

## Why this matters day to day

Three consequences you will actually feel while writing code:

**Heavy computation freezes the interface.** No magic: if your function takes 300 ms, the stack is busy for 300 ms and no click is processed. The fix isn't `setTimeout`, it's chunking the work or moving it to a *Web Worker*, which really is another thread.

**The position of `await` matters.** `await` splits a function in two: everything before it runs synchronously, everything after becomes a microtask.

```js
async function demo() {
  console.log("a"); // synchronous
  await null;
  console.log("b"); // microtask
}
demo();
console.log("c");
// a, c, b
```

**Timers are not precise.** `setTimeout(fn, 100)` guarantees *at least* 100 ms, never exactly 100. If the stack is busy when the deadline passes, the task waits. For animation use `requestAnimationFrame`, which is synchronised with painting.

## The mental model

If you keep one picture, make it this one:

- **Call stack**: what's running *now*, always one thing.
- **Environment APIs**: what waits on your behalf, off-thread.
- **Microtask queue**: promises. Drained completely between tasks.
- **Task queue**: timers, events, I/O. One per turn.
- **Event loop**: moves things from the queues to the stack, but **only when the stack is empty**.

JavaScript isn't asynchronous. JavaScript is synchronous and single-threaded, running inside an environment that does know how to wait. All the asynchrony you use daily is that boundary.
