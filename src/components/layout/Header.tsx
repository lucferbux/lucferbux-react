import { Link } from "react-router-dom";
import { menuData } from "../../data/menuData";
import NavButton from "../buttons/NavButton";
import LanguageToggle from "../buttons/LanguageToggle";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";

/**
 * Fixed, full-width and opaque — all three deliberately.
 *
 * Fixed and opaque is what Safari 26 samples to tint its toolbar (see the
 * page-tint block in globals.css), and it also stops the header scrolling away,
 * which it did when it was `position: absolute`.
 *
 * Full width matters: the constrained `max-w-[1234px]` used to sit on the
 * positioned element itself, which on a wide screen is under the 80%-of-
 * viewport threshold Safari requires, so it would not have qualified.
 */
export default function Header() {
  const { m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <header className="page-tint-bar fixed top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)]">
      <nav
        aria-label={m.a11y.mainNav}
        className="mx-auto flex h-14 max-w-[1234px] items-center justify-between gap-4 px-[30px] max-sm:px-5 max-xs:gap-2"
      >
        <Link to={localePath("/")} className="shrink-0">
          <img src="/images/logos/logo.svg" alt="Lucferbux" />
        </Link>
        <div className="flex items-center gap-[30px] max-md:gap-3 max-xs:gap-1.5">
          {menuData.map((item) => (
            <NavButton
              icon={item.icon}
              text={m.nav[item.labelKey]}
              link={localePath(item.link)}
              key={item.labelKey}
              collapse
            />
          ))}
          <LanguageToggle className="shrink-0" />
        </div>
      </nav>
    </header>
  );
}
