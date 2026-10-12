import type { CSSProperties, MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import { tabItems } from "../../data/menuData";
import { sectionOf } from "../../hooks/useActiveSection";
import { useTranslation } from "../../i18n/LanguageContext";
import { useLocalePath } from "../../i18n/useLocalePath";

const withoutTrailingSlash = (path: string) => path.replace(/\/+$/, "");

/**
 * The phone's navigation: a floating glass capsule at the bottom of the
 * screen, in place of the header.
 *
 * The pill behind the current tab is positioned from the tab's index alone
 * (`--tab-index`, see `.tab-bar-pill`). The tabs are equal columns, so there
 * is nothing to measure — which also means the pill is already in place on
 * first paint and never animates on a resize.
 */
export default function TabBar() {
  const { m } = useTranslation();
  const localePath = useLocalePath();
  const { pathname } = useLocation();

  const active = sectionOf(pathname);
  const activeIndex = tabItems.findIndex((item) => item.key === active);

  // Tapping the tab you are already on goes back to the top, as a native tab
  // bar does. The option is set explicitly because CSS `scroll-behavior` does
  // not override the one passed from script.
  const scrollToTopIfCurrent = (event: MouseEvent, target: string) => {
    if (withoutTrailingSlash(target) !== withoutTrailingSlash(pathname)) return;
    event.preventDefault();
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <nav
      aria-label={m.a11y.mainNav}
      className="glass-panel tab-bar fixed bottom-[calc(env(safe-area-inset-bottom,0px)*0.35+8px)] left-1/2 z-40 w-[min(calc(100vw-24px),400px)] -translate-x-1/2 p-[5px]"
    >
      <div className="relative grid grid-cols-5">
        <span
          aria-hidden="true"
          className={clsx(
            "tab-bar-pill absolute inset-y-0 left-0 w-1/5 rounded-full",
            activeIndex < 0 && "opacity-0"
          )}
          style={{ "--tab-index": Math.max(activeIndex, 0) } as CSSProperties}
        />
        {tabItems.map(({ key, labelKey, Icon, link }) => {
          const target = localePath(link);
          const current = key === active;

          return (
            <Link
              key={key}
              to={target}
              aria-current={current ? "page" : undefined}
              onClick={(event) => scrollToTopIfCurrent(event, target)}
              className={clsx(
                "relative z-10 flex h-[52px] touch-manipulation flex-col items-center justify-center gap-0.5 rounded-full text-[10.5px] leading-none font-semibold no-underline transition-colors duration-200 select-none [-webkit-tap-highlight-color:transparent] max-[400px]:text-[10px]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                "active:[&_svg]:scale-90",
                current
                  ? "!text-primary-dark dark:!text-primary-light"
                  : "!text-black/70 dark:!text-white/75"
              )}
            >
              <Icon className="h-[25px] w-[25px] transition-transform duration-100" />
              {m.nav[labelKey]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
