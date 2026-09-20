/**
 * Widens string literals to `string` while preserving the object and tuple
 * shape.
 *
 * `en.ts` is declared `as const` so its structure is exact, but that also makes
 * every value a literal type. Checking `es.ts` against it directly would demand
 * that the Spanish translations be byte-identical to the English ones. Widening
 * the leaves keeps what we actually want: the same keys, the same nesting, and
 * the same array lengths, with any string as the value.
 */
export type WidenMessages<T> = T extends string
  ? string
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: WidenMessages<T[K]> }
    : { readonly [K in keyof T]: WidenMessages<T[K]> };
