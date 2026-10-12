import { Link } from "react-router-dom";
import { menuData } from "../../data/menuData";
import NavButton from "../buttons/NavButton";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";

/**
 * Sits at the top of the page and scrolls away with it. It is `absolute`
 * rather than in flow because the wave backgrounds are positioned from the top
 * of `<main>`: an in-flow header would push them down and leave a bare band
 * behind the nav. Transparent for the same reason — the page's own gradient
 * shows through, so there is nothing to keep in sync.
 *
 * It is no longer what Safari samples for its toolbar tint; `PageTint` is.
 */
export default function Header() {
  const { m } = useTranslation();
  const localePath = useLocalePath();

  return (
    <header className="absolute top-0 right-0 left-0 z-50 pt-[env(safe-area-inset-top,0px)]">
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
        </div>
      </nav>
    </header>
  );
}
