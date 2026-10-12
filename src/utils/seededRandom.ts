/**
 * The hash and generator from `scripts/generate-banners.mjs`, for art that is
 * drawn in the browser rather than at build time. Same inputs, same picture,
 * on every device and in every test run.
 */

/** FNV-1a: small, stable, and identical across engines. */
export function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

/** Deterministic PRNG returning values in [0, 1). */
export function rng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
