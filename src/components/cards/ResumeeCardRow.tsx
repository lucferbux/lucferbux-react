import { Work } from "../../data/model/work";

interface ResumeeCardRowProps {
  work: Work;
}

export default function ResumeeCardRow({ work }: ResumeeCardRowProps) {
  return (
    <div className="grid w-full grid-cols-[34px_auto] gap-x-4 p-2.5">
      <img
        src={`/images/icons/${work.icon}.svg`}
        alt="icon image"
        className="h-8 w-8 rounded-full bg-black/20"
        style={{ boxShadow: "rgb(255 255 255 / 20%) 0px 0px 0px 0.5px" }}
      />
      <div className="grid gap-2">
        <p className="m-0 text-[15px] font-semibold leading-[18px] text-black dark:text-white">
          {work.name_en}
        </p>
        <p className="m-0 text-[13px] font-normal leading-[14px] text-black/70 dark:text-white/70">
          {work.job_en}
        </p>
        <p className="m-0 line-clamp-3 text-[15px] font-normal leading-[18px] text-black max-[380px]:line-clamp-[7] max-xs:line-clamp-5 dark:text-white">
          {work.description_en}
        </p>
      </div>
    </div>
  );
}