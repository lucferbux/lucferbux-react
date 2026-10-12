import { useTranslation } from "../../i18n/LanguageContext";
import CardSkeleton, { type CardSkeletonVariant } from "./CardSkeleton";

interface SkeletonGridProps {
  variant: CardSkeletonVariant;
  count: number;
  /** The real grid's classes, so the placeholders sit where the cards will. */
  className: string;
}

/**
 * A listing's grid while its data loads. It is a separate element from the
 * real grid on purpose: `useStaggeredReveal` animates the children of the
 * element it is attached to, and it should only ever meet real cards.
 */
export default function SkeletonGrid({
  variant,
  count,
  className,
}: SkeletonGridProps) {
  const { m } = useTranslation();

  return (
    <div className={className} aria-busy="true">
      <span role="status" className="sr-only">
        {m.a11y.loading}
      </span>
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton variant={variant} key={index} />
      ))}
    </div>
  );
}
