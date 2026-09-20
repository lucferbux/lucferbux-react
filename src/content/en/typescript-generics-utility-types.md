---
slug: "/typescript-generics-utility-types"
date: "2026-03-10"
title: "Generics and utility types in TypeScript"
kicker: "TypeScript"
excerpt: "How to stop writing `any` and start describing relationships between types rather than isolated types."
tags: [typescript, generics, types]
featuredImage: "/images/banners/typescript-generics-utility-types.svg"
---

A generic isn't "a type I don't know yet". It's a **relationship** between types. That distinction separates code that uses TypeScript from code that merely endures it.

## The problem they solve

This function is correct and, type-wise, completely useless:

```ts
function first(items: any[]): any {
  return items[0];
}

const n = first([1, 2, 3]); // any
n.toUpperCase();            // compiles, explodes at runtime
```

`any` switches the compiler off. `unknown` is more honest but forces a check at every use. What we actually want to say is something else: *the type I return is the same one the array you gave me holds*.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);       // number | undefined
const s = first(["a", "b"]);      // string | undefined
```

Nothing was annotated at the call sites. TypeScript **infers** `T` from the argument. That's the goal: write the relationship once and let the compiler propagate it.

## Constraining with `extends`

An unconstrained generic lets you do nothing with the value, because it could be anything. `extends` narrows the set.

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "goodbye");  // string
longest([1, 2], [1, 2, 3]);   // number[]
longest(1, 2);                // Error: number has no length
```

The variant that pays off most day to day is constraining to an object's keys:

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Lucas", age: 34 };
get(user, "name");  // string
get(user, "age");   // number
get(user, "email"); // Error: "email" is not on the object
```

`T[K]` is an *indexed access type*: the type of property `K` within `T`. The function doesn't return "something from the object", it returns exactly that key's type.

## Utility types are generics someone else wrote

`Partial`, `Pick`, `Omit`, `Record` and friends aren't special syntax. They're ordinary generics defined in the standard library, and you can read them.

```ts
type Partial<T> = { [K in keyof T]?: T[K] };
```

That's the whole thing: walk `T`'s keys and add `?`. The ones that earn their keep:

```ts
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Everything optional — the classic for an edit form
type UserPatch = Partial<User>;

// Only some keys
type UserPreview = Pick<User, "id" | "name">;

// Everything but some — better for fields the client doesn't send
type NewUser = Omit<User, "id" | "createdAt">;

// A dictionary with constrained keys
type UsersById = Record<string, User>;

// Strip null and undefined
type Defined = NonNullable<string | null>; // string
```

Choosing between `Pick` and `Omit` isn't a style question. `Pick` is an allowlist: add a field to `User` tomorrow and `UserPreview` is unchanged. `Omit` is a denylist: the new field appears automatically. For a DTO going over the wire you usually want an allowlist; for "the model minus what the server generates", a denylist.

## Conditional types

A conditional type picks based on another type. The syntax mirrors the ternary operator:

```ts
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false
```

With `infer` you can also *extract* a type from inside another:

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;

type C = ElementOf<string[]>; // string
```

That's how `ReturnType` is defined, probably the most practical utility type there is:

```ts
type ReturnType<T extends (...args: never[]) => unknown> =
  T extends (...args: never[]) => infer R ? R : never;

function buildConfig() {
  return { retries: 3, timeout: 5_000 };
}

type Config = ReturnType<typeof buildConfig>;
// { retries: number; timeout: number }
```

That pattern — deriving the type from the implementation rather than declaring it separately — is what stops types and code drifting apart.

## Practical rules

Three things I look for in review:

**If a generic appears only once in the signature, it probably shouldn't be generic.** `function log<T>(value: T): void` is exactly `function log(value: unknown): void`, just harder to read. A generic earns its place when it *relates* two positions: a parameter to the return type, or two parameters to each other.

**Prefer inferring to declaring.** `typeof`, `ReturnType` and `keyof` derive types from real code. A type hand-written next to its implementation is a type that will eventually lie.

**`as` is not a conversion, it's a promise.** `value as User` tells the compiler to trust you and check nothing. When the data comes from outside — an API, `localStorage`, a form — what you need isn't an assertion but a runtime validation; that's where a type guard or a schema library like Zod does the real work.
