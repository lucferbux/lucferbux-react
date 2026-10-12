import Skeleton from "../common/Skeleton";

export type CardSkeletonVariant = "project" | "post" | "news" | "teaching";

interface CardSkeletonProps {
  variant: CardSkeletonVariant;
}

const lines = (widths: string[], height = "h-4") =>
  widths.map((width, index) => (
    <Skeleton key={index} className={`${height} ${width}`} />
  ));

/**
 * The outline of a card while its data loads: the same glass panel and roughly
 * the same box as the real thing, so the page does not jump when it arrives.
 */
export default function CardSkeleton({ variant }: CardSkeletonProps) {
  switch (variant) {
    case "project":
      return (
        <div className="glass-panel flex h-full flex-col overflow-hidden">
          <Skeleton className="aspect-video w-full rounded-none max-md:aspect-[2/1]" />
          <div className="flex flex-col gap-3 p-5">
            {lines(["w-2/3"], "h-6")}
            {lines(["w-full", "w-full", "w-3/5"])}
            <div className="flex gap-2 pt-1">
              {lines(["w-14", "w-20", "w-12"], "h-6")}
            </div>
          </div>
        </div>
      );
    case "post":
      return (
        <div className="glass-panel flex min-h-[200px] flex-col gap-4 p-6 max-[520px]:p-5">
          {lines(["w-4/5", "w-1/2"], "h-7")}
          {lines(["w-full", "w-11/12", "w-2/3"])}
          <Skeleton className="mt-auto h-3 w-28" />
        </div>
      );
    case "news":
      return (
        <div className="glass-panel flex h-[400px] gap-5 p-5 max-md:h-auto max-md:flex-col">
          <Skeleton className="hidden h-[190px] w-full rounded-xl max-md:block" />
          <div className="flex flex-1 flex-col gap-3 pt-1">
            {lines(["w-full", "w-11/12", "w-full", "w-4/5", "w-full", "w-2/3"])}
          </div>
          <Skeleton className="h-full w-[260px] shrink-0 rounded-[20px] max-md:hidden" />
        </div>
      );
    case "teaching":
      return (
        <div className="glass-panel flex h-full flex-col gap-4 p-6 max-md:p-5">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              {lines(["w-3/5"], "h-6")}
              {lines(["w-2/5"], "h-3")}
            </div>
          </div>
          {lines(["w-full", "w-full", "w-3/4"])}
          <div className="flex gap-2">
            {lines(["w-20", "w-24", "w-16"], "h-7")}
          </div>
        </div>
      );
  }
}
