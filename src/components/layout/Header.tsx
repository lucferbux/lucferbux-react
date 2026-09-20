import { Link } from "react-router-dom";
import { menuData } from "../../data/menuData";
import NavButton from "../buttons/NavButton";
import LanguageToggle from "../buttons/LanguageToggle";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";

export default function Header() {
  const { m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <div className="absolute right-0 left-0 z-50 mx-auto flex h-11 max-w-[1234px] items-center justify-between px-[30px] py-10 max-sm:top-[10px] max-sm:px-5 max-sm:py-5">
      <Link to={localePath("/")}>
        <img src="/images/logos/logo.svg" alt="Lucferbux" />
      </Link>
      {/* Flex rather than the previous explicit grid-template-columns, so the
          language toggle can join the row without recomputing the track count. */}
      <div className="flex items-center gap-[30px] max-xs:gap-4">
        {menuData.map((item, index) => (
          <NavButton
            icon={item.icon}
            text={m.nav[item.labelKey]}
            link={localePath(item.link)}
            key={index}
            collapse
          />
        ))}
        <LanguageToggle />
      </div>
    </div>
  );
}
