import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  isLocale,
  matchLocale,
  type Locale,
} from "./locales";
import en from "./messages/en";
import es from "./messages/es";
import type { WidenMessages } from "./messages/types";

const dictionaries: Record<Locale, WidenMessages<typeof en>> = { en, es };

/** Leaf types are widened so `en` and `es` share one type. */
export type Messages = WidenMessages<typeof en>;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: Messages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** localStorage throws in Safari private browsing, so both sides are guarded. */
function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Non-fatal: the choice simply will not survive a reload.
  }
}

/**
 * Resolve the locale for a visitor with no locale in the URL:
 * an explicit previous choice wins, otherwise the browser's languages.
 */
export function detectLocale(): Locale {
  const stored = readStoredLocale();
  if (stored) return stored;

  const preferred =
    typeof navigator !== "undefined"
      ? (navigator.languages ?? [navigator.language]).filter(Boolean)
      : [];

  return matchLocale(preferred as string[], DEFAULT_LOCALE);
}

interface LanguageProviderProps {
  children: ReactNode;
  /** Locale from the URL. Routing owns this; the provider just reflects it. */
  locale?: Locale;
  /** Called when the visitor picks a language, so routing can navigate. */
  onLocaleChange?: (locale: Locale) => void;
}

export function LanguageProvider({
  children,
  locale: controlledLocale,
  onLocaleChange,
}: LanguageProviderProps) {
  const [uncontrolledLocale, setUncontrolledLocale] =
    useState<Locale>(detectLocale);

  const locale = controlledLocale ?? uncontrolledLocale;

  const setLocale = useCallback(
    (next: Locale) => {
      storeLocale(next);
      setUncontrolledLocale(next);
      onLocaleChange?.(next);
    },
    [onLocaleChange]
  );

  // Setting an attribute is idempotent and paints nothing, so unlike a
  // background-colour effect this is safe to drive from React.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, m: dictionaries[locale] }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
