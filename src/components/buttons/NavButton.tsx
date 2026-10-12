import { Link } from "react-router-dom";
import clsx from "clsx";
import type { NavIcon } from "../icons/NavIcons";

interface NavButtonProps {
  /** A component from the shared nav set, or the path of an image file. */
  icon: string | NavIcon;
  text: string;
  link: string;
  /**
   * Compact layout for the header: below 450px the label moves under the icon
   * instead of disappearing. It used to be hidden entirely, leaving three bare
   * icons whose only name was an `alt` attribute.
   */
  collapse?: boolean;
  /** Marks the link as the current section. */
  active?: boolean;
}

export default function NavButton({
  icon: Icon,
  text,
  link,
  collapse,
  active,
}: NavButtonProps) {
  const iconClass = clsx(
    "mx-auto",
    collapse && "max-xs:h-[22px] max-xs:w-[22px]"
  );

  return (
    <Link to={link} aria-current={active ? "page" : undefined}>
      <div
        className={clsx(
          "grid grid-cols-[24px_auto] items-center gap-[10px] rounded-[10px] p-[10px] text-white/70 transition-all duration-500",
          "hover:bg-white/10 hover:shadow-[0px_10px_20px_rgba(0,0,0,0.1),inset_0px_0px_0px_0.5px_rgba(255,255,255,0.2)]",
          // 44px minimum touch target.
          "min-h-[44px] min-w-[44px]",
          active && "bg-white/10 text-white",
          collapse &&
            "max-xs:grid-cols-1 max-xs:justify-items-center max-xs:gap-0 max-xs:px-1"
        )}
      >
        {typeof Icon === "string" ? (
          <img src={Icon} alt="" className={iconClass} />
        ) : (
          <Icon className={clsx("h-6 w-6", iconClass)} />
        )}
        <span
          className={clsx(
            collapse && "max-xs:text-[10px] max-xs:leading-[12px]"
          )}
        >
          {text}
        </span>
      </div>
    </Link>
  );
}
