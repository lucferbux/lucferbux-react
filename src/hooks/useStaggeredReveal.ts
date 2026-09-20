import { useLayoutEffect, useRef } from "react";

/** Beyond this many items the cascade stops growing, so a long list does not
 *  end with the last card waiting two seconds to appear. */
const MAX_STAGGER_STEPS = 8;
const STEP_MS = 70;

interface Options {
  /** Milliseconds between one child and the next. */
  step?: number;
}

/**
 * Fade a container's children in once, each a beat after the last.
 *
 * Returns a ref for the container. The children need no props and no wrapper
 * element — the hook sets `data-reveal` and `--reveal-delay` on them directly,
 * and `globals.css` does the rest.
 *
 * **This runs once, on mount, for every child at once.** An earlier version
 * revealed each card as it scrolled into view, which is the usual way to build
 * this and was wrong here: cards appearing as you reached them read as the page
 * still loading, like images streaming in on a slow connection. An entrance
 * animation should introduce the page, then get out of the way.
 *
 * Two other properties are deliberate:
 *
 * - **The resting state is the visible one.** CSS only hides an element once
 *   this hook has marked it. If the hook never runs — JavaScript disabled, an
 *   error earlier in the tree, an old browser — the content is on screen as
 *   normal. An animation that can fail closed and leave a blank page is not
 *   worth having.
 * - **Reduced motion is checked here, not in CSS.** A media query could hide
 *   the animation but not the `opacity: 0` that precedes it. Bailing out before
 *   touching the DOM is the only version where "reduce motion" genuinely means
 *   the content is simply there.
 */
export function useStaggeredReveal<T extends HTMLElement = HTMLDivElement>(
  itemCount: number,
  { step = STEP_MS }: Options = {}
) {
  const containerRef = useRef<T>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Feature-detected rather than assumed. This runs in a layout effect, so
    // anything that throws takes the whole render down with it — and it would
    // take down a page whose only crime was wanting a fade.
    if (typeof window.matchMedia !== "function") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const children = Array.from(container.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement
    );
    if (children.length === 0) return;

    // In a layout effect so the animation is in place before the browser
    // paints. In a passive effect the children would show at full opacity for
    // one frame and then jump back to animate in.
    //
    // `animation-fill-mode: both` is what holds a child at the start of its
    // keyframes through its stagger delay, so no separate "pending" state is
    // needed.
    children.forEach((child, index) => {
      child.style.setProperty(
        "--reveal-delay",
        `${Math.min(index, MAX_STAGGER_STEPS) * step}ms`
      );
      child.dataset.reveal = "in";
    });

    return () => {
      children.forEach((child) => {
        delete child.dataset.reveal;
        child.style.removeProperty("--reveal-delay");
      });
    };
  }, [itemCount, step]);

  return containerRef;
}
