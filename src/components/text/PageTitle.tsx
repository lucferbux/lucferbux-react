interface PageTitleProps {
  title: string;
  description: string;
}

/**
 * The heading of a listing page: large, left-aligned at every width, and the
 * page's `<h1>`. It shares its side padding with the grid below it, so the
 * title and the first card start on the same line.
 *
 * The landing's sections keep `InfoBox`, which is centred and carries a button.
 */
export default function PageTitle({ title, description }: PageTitleProps) {
  return (
    <div className="relative mx-auto grid max-w-[1234px] gap-3 px-[30px] pt-page pb-[30px] text-left max-md:px-5 max-md:pb-4">
      <h1 className="text-[40px] leading-[1.1] font-bold tracking-[-0.02em] text-white max-md:text-[34px] max-[350px]:text-[30px]">
        {title}
      </h1>
      <p className="max-w-[440px] text-[17px] leading-[1.35] font-normal text-white/85">
        {description}
      </p>
    </div>
  );
}
