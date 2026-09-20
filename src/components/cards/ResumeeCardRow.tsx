import { Work } from "../../data/model/work";
import { useTranslation } from "../../i18n/LanguageContext";
import { localizedField } from "../../i18n/localized";

interface ResumeeCardRowProps {
  work: Work;
}

export default function ResumeeCardRow({ work }: ResumeeCardRowProps) {
  const { locale } = useTranslation();
  return (
    <div className="grid w-full grid-cols-[34px_auto] gap-x-4 p-2.5">
      <img
        src={`/images/icons/${work.icon}.svg`}
        alt=""
        className="h-8 w-8 rounded-full bg-black/20"
        style={{ boxShadow: "rgb(255 255 255 / 20%) 0px 0px 0px 0.5px" }}
      />
      <div className="grid gap-2">
        <p className="m-0 text-[15px] font-semibold leading-[18px] text-black dark:text-white">
          {localizedField(work, "name", locale)}
        </p>
        <p className="m-0 text-[13px] font-normal leading-[14px] text-black/70 dark:text-white/70">
          {localizedField(work, "job", locale)}
        </p>
        <p className="m-0 line-clamp-3 text-[15px] font-normal leading-[18px] text-black max-[380px]:line-clamp-[7] max-xs:line-clamp-5 dark:text-white">
          {localizedField(work, "description", locale)}
        </p>
      </div>
    </div>
  );
}
