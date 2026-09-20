import { useLayoutEffect, useRef } from "react";

/** Beyond this many items the cascade stops growing, so a long list does not
 *  end with the last card waiting two seconds to appear. */
const MAX_STAGGER_STEPS = 8;
const STEP_MS = 70;

interface Options {
  /** Milliseconds between one child and the next. */
  step?: number;
  /** Fraction of the element that must be on screen before it reveals. */
  threshold?: number;
  /** Shrinks the trigger area. The default holds a card back until it is a
   *  little way up the viewport; pass "0px" for items inside their own scroll
   *  container, where that margin would keep partly-visible rows hidden. */
  rootMargin?: string;
}

/**
 * Reveal a container's direct children as they scroll into view, each one a
 * beat after the last.
 *
 * Returns a ref for the container. The children need no props and no wrapper
 * element — the hook sets `data-reveal` and `--reveal-delay` on them directly,
 * and `globals.css` does the rest.
 *
 * Two deliberate choices:
 *
 * - **Hidden is opt-in, visible is the default.** The CSS only hides an element
 *   once this hook has marked it pending. If the hook never runs — JavaScript
 *   disabled, an error earlier in the tree, an old browser without
 *   IntersectionObserver — the content is on screen as normal. An animation
 *   that can fail closed and leave a blank page is not worth having.
 * - **Reduced motion is checked here, not in CSS.** A media query could hide
 *   the animation but not the `opacity: 0` that precedes it. Bailing out before
 *   touching the DOM is the only version where "reduce motion" genuinely means
 *   the content is simply there.
 */
export function useStaggeredReveal<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  {
    step = STEP_MS,
    threshold = 0.12,
    rootMargin = "0px 0px -8% 0px",
  }: Options = {}
) {
  const containerRef = useRef<T>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Both of these are feature-detected rather than assumed. This hook runs in
    // a layout effect, so anything that throws here takes the whole render down
    // with it — and it would take down a page whose only crime was wanting a
    // fade. When either is missing the answer is the same as for reduced
    // motion: leave the DOM alone and let the content be visible.
    const canQueryMotion = typeof window.matchMedia === "function";
    if (!canQueryMotion || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );
    if (children.length === 0) return;

    // Runs in a layout effect so the hidden state is in place before the
    // browser paints. In a passive effect the children would flash at full
    // opacity for one frame and then disappear to animate back in.
    children.forEach((child, index) => {
      child.dataset.reveal = "pending";
      child.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, MAX_STAGGER_STEPS) * step}ms`
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          // Once revealed it stays revealed; re-animating on every scroll past
          // is the thing that makes these effects tiring.
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );

    children.forEach((child) => observer.observe(child));

    return () => {
      observer.disconnect();
      // The component may survive this effect re-running (the list grew, the
      // locale changed). Leaving children pending would leave them invisible.
      children.forEach((child) => {
        delete child.dataset.reveal;
        child.style.removeProperty("--reveal-delay");
      });
    };
  }, [itemCount, step, threshold, rootMargin]);

  return containerRef;
}
