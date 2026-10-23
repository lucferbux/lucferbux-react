/**
 * Schemes an external link from Firestore may use. Anything else — notably
 * `javascript:` and `data:` — is a script-execution sink in an `href`, and
 * React 18/19 still render those (React only warns).
 */
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

export function isSafeUrl(value: string): boolean {
  try {
    return SAFE_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    return false;
  }
}

/**
 * Returns `url` when it is an absolute http(s)/mailto URL, otherwise
 * `undefined`, which renders an `<a>` without an `href`.
 *
 * The admin validates on save, but documents can also arrive through the seed
 * script or the Firebase console, so the card renders defensively too.
 */
export function safeHref(url: string | undefined | null): string | undefined {
  return url && isSafeUrl(url) ? url : undefined;
}
