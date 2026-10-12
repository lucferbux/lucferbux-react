import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

/** A placeholder block with a slow sheen. Size and shape come from `className`. */
export default function Skeleton({ className }: SkeletonProps) {
  return (
    <span aria-hidden="true" className={clsx("skeleton block", className)} />
  );
}
