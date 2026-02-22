import clsx from "clsx";
import FlatButtonLink from "../buttons/FlatButtonLink";

interface InfoBoxProps {
  title: string;
  description: string;
  darkColor?: boolean;
  displayButton: boolean;
  iconButton?: string;
  textButton?: string;
  linkButton?: string;
}

export default function InfoBox({
  title,
  description,
  darkColor,
  displayButton,
  iconButton,
  textButton,
  linkButton,
}: InfoBoxProps) {
  return (
    <div className="grid h-fit max-w-[360px] gap-5 text-white max-md:gap-2.5 max-md:text-center">
      <h2
        className={clsx(
          "text-[32px] font-bold max-xs:text-[24px] dark:text-white",
          darkColor ? "text-black" : "text-white"
        )}
      >
        {title}
      </h2>
      <p
        className={clsx(
          "text-[17px] font-normal leading-[130%] max-xs:text-[15px] max-xs:leading-[100%] dark:text-white/70",
          darkColor ? "text-black/70" : "text-white/70"
        )}
      >
        {description}
      </p>
      {displayButton && (
        <div className="relative flex justify-start max-xl:mb-10 max-xl:justify-center">
          <FlatButtonLink
            icon={iconButton ?? "news"}
            text={textButton ?? "News"}
            link={linkButton ?? "news"}
          />
        </div>
      )}
    </div>
  );
}
