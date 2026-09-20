import { render, type RenderOptions } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import type { Locale } from "@/i18n/locales";

interface Options extends Omit<RenderOptions, "wrapper"> {
  /** Initial URL. Defaults to the English root. */
  route?: string;
  locale?: Locale;
}

/**
 * Renders a component inside the three providers the app needs: Helmet for
 * head tags, a router, and the language context that every text-bearing
 * component now reads from.
 */
export function renderWithProviders(
  ui: ReactElement,
  { route = "/en", locale = "en", ...options }: Options = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <LanguageProvider locale={locale}>{children}</LanguageProvider>
        </MemoryRouter>
      </HelmetProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
