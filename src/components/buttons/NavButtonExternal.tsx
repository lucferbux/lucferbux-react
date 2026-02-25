import clsx from "clsx";

interface NavButtonExternalProps {
  icon: string;
  text: string;
  link: string;
  collapse?: boolean;
}

export default function NavButtonExternal({ icon, text, link, collapse }: NavButtonExternalProps) {
  return (
    <a href={link} target="_blank" rel="noopener" className="cursor-pointer">
      <div
        className={clsx(
          "grid grid-cols-[24px_auto] items-center gap-[10px] rounded-[10px] p-[10px] text-white/70 transition-all duration-500",
          "hover:bg-white/10 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1),inset_0px_0px_0px_0.5px_rgba(255,255,255,0.2)]",
          collapse && "max-xs:block"
        )}
      >
        <img
          src={icon}
          alt={text}
          className={clsx(collapse && "max-xs:h-[30px] max-xs:w-[30px]")}
        />
        <span className={clsx(collapse && "max-xs:hidden")}>{text}</span>
      </div>
    </a>
  );
}
