/**
 * The element Safari 26 samples to tint its toolbar: fixed, within 4px of the
 * viewport top, full width, at least 3px tall and opaque (see the page-tint
 * block in globals.css). The header used to be that element, which is why it
 * had to be fixed; this strip carries the tint instead so the header can scroll
 * away and so a phone, which has no header at all, still qualifies.
 *
 * 4px in a browser tab — one more than Safari's minimum. In a standalone PWA
 * it grows to the status-bar inset, which also stops content scrolling under
 * the clock.
 */
export default function PageTint() {
  return (
    <div
      aria-hidden="true"
      data-page-tint
      className="page-tint-bar pointer-events-none fixed top-0 right-0 left-0 z-[60] h-[max(env(safe-area-inset-top,0px),4px)]"
    />
  );
}
