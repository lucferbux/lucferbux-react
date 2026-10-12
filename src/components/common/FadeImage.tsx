import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

interface FadeImageProps {
  src: string;
  alt?: string;
  /** Classes for the `<img>`. */
  className?: string;
  /** Classes for the box around it, which shows the placeholder sheen. */
  wrapperClassName?: string;
  /**
   * Applied to the box only until the image arrives — typically an aspect
   * ratio or a height, since an image that has not loaded has no size of its
   * own to hold the space open.
   */
  pendingClassName?: string;
}

/**
 * An image that fades in over a shimmering placeholder once it has loaded.
 *
 * A failed load counts as finished too: the placeholder stops and the box
 * collapses to whatever the broken image occupies, rather than shimmering
 * forever at something that is never coming.
 */
export default function FadeImage({
  src,
  alt = "",
  className,
  wrapperClassName,
  pendingClassName,
}: FadeImageProps) {
  const [settled, setSettled] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A cached image can finish before React attaches `onLoad`, in which case
  // the event never reaches us and the image would stay invisible.
  useLayoutEffect(() => {
    if (ref.current?.complete) setSettled(true);
  }, [src]);

  return (
    <div
      className={clsx(
        wrapperClassName,
        !settled && "skeleton",
        !settled && pendingClassName
      )}
    >
      <img
        ref={ref}
        src={src}
        alt={alt}
        onLoad={() => setSettled(true)}
        onError={() => setSettled(true)}
        className={clsx(
          "transition-opacity duration-300",
          settled ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
}
