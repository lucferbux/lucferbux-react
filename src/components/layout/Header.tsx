import { Link } from "react-router";
import { menuData } from "../../data/menuData";
import NavButton from "../buttons/NavButton";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";
import { useActiveSection } from "../../hooks/useActiveSection";

/**
 * Sits at the top of the page and scrolls away with it. It is `absolute`
 * rather than in flow because the wave backgrounds are positioned from the top
 * of `<main>`: an in-flow header would push them down and leave a bare band
 * behind the nav. Transparent for the same reason — the page's own gradient
 * shows through, so there is nothing to keep in sync.
 *
 * It has nothing to do with the browser tint any more: that is the colour of
 * the canvas (see "Page tint" in globals.css), not of any element.
 */
export default function Header() {
  const { m } = useTranslation();
  const localePath = useLocalePath();
  const active = useActiveSection();

  return (
    // Sits 20px below the top edge. `--chrome-top` deliberately does not
    // include that offset: page content stays where it was and only the gap
    // between the nav and the title shrinks — the fixed-height home sections
    // (AGENTS.md, landmine 3) would otherwise clip.
    <header className="absolute top-0 right-0 left-0 z-50 pt-[calc(env(safe-area-inset-top,0px)+20px)]">
      <nav
        aria-label={m.a11y.mainNav}
        className="mx-auto flex h-14 max-w-[1234px] items-center justify-between gap-4 px-[30px] max-sm:px-5 max-xs:gap-2"
      >
        <Link to={localePath("/")} className="shrink-0">
          <img src="/images/logos/logo.svg" alt="Lucferbux" />
        </Link>
        <div className="flex items-center gap-[30px] max-xl:gap-4 max-lg:gap-1">
          {menuData.map((item) => (
            <NavButton
              icon={item.Icon}
              text={m.nav[item.labelKey]}
              link={localePath(item.link)}
              key={item.key}
              active={item.key === active}
              collapse
            />
          ))}
        </div>
      </nav>
    </header>
  );
}
