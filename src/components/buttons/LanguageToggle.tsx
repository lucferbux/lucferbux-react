import clsx from "clsx";
import { useTranslation } from "../../i18n/LanguageContext";
import { LOCALES, LOCALE_LABEL, type Locale } from "../../i18n/locales";

const SWITCH_LABEL: Record<Locale, "switchToEnglish" | "switchToSpanish"> = {
  en: "switchToEnglish",
  es: "switchToSpanish",
};

/**
 * Two-state segmented control. With only two languages a `<select>` would cost
 * an extra tap for no benefit, so both options are always visible and the
 * active one is marked with `aria-pressed`.
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, m } = useTranslation();

  return (
    <div
      role="group"
      aria-label={m.a11y.languageGroup}
      className={clsx(
        "flex items-center overflow-hidden rounded-full border border-white/30",
        className
      )}
    >
      {LOCALES.map((option) => {
        const active = option === locale;
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-pressed={active}
            aria-label={m.a11y[SWITCH_LABEL[option]]}
            onClick={() => setLocale(option)}
            className={clsx(
              "min-h-[32px] min-w-[40px] px-2 text-[13px] font-semibold transition",
              active
                ? "bg-white/90 text-black"
                : "bg-transparent text-white/80 hover:bg-white/15"
            )}
          >
            {LOCALE_LABEL[option]}
          </button>
        );
      })}
    </div>
  );
}
