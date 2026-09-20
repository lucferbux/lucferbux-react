import { describe, it, expect, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SEO from "@/components/layout/SEO";

/**
 * react-helmet-async commits to <head> asynchronously, which the previous
 * version of this file worked around by wrapping every assertion in `if (el)`
 * — so a missing meta tag passed silently. Everything here waits instead.
 */
const renderSEO = (props: Parameters<typeof SEO>[0]) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/news"]}>
        <SEO {...props} />
      </MemoryRouter>
    </HelmetProvider>
  );

const meta = (selector: string) =>
  document.querySelector(`meta[${selector}]`)?.getAttribute("content");

const waitForMeta = async (selector: string) => {
  await waitFor(() => {
    expect(document.querySelector(`meta[${selector}]`)).not.toBeNull();
  });
  return meta(selector);
};

afterEach(() => {
  document.head.querySelectorAll("[data-rh]").forEach((el) => el.remove());
});

describe("SEO", () => {
  it("sets the document title through the site template", async () => {
    renderSEO({ title: "Test Page" });
    await waitFor(() => {
      expect(document.title).toBe("Test Page | Lucferbux");
    });
  });

  it("falls back to the site description when none is given", async () => {
    renderSEO({ title: "Test" });
    expect(await waitForMeta('name="description"')).toBe(
      "Lucferbux Personal Webpage"
    );
  });

  it("applies a custom description", async () => {
    renderSEO({ title: "Test", description: "Custom meta description" });
    expect(await waitForMeta('name="description"')).toBe(
      "Custom meta description"
    );
  });

  it("sets OpenGraph tags from the title and description", async () => {
    renderSEO({ title: "OG Test", description: "OG description" });
    expect(await waitForMeta('property="og:title"')).toBe("OG Test");
    expect(meta('property="og:description"')).toBe("OG description");
    expect(meta('property="og:type"')).toBe("website");
    expect(meta('property="og:url"')).toBe("https://lucferbux.dev/news");
  });

  it("sets Twitter card tags", async () => {
    renderSEO({ title: "Twitter Test" });
    expect(await waitForMeta('name="twitter:card"')).toBe("summary");
    expect(meta('name="twitter:creator"')).toBe("@lucferbux");
    expect(meta('name="twitter:title"')).toBe("Twitter Test");
  });

  it("emits exactly one theme-color per colour scheme", async () => {
    renderSEO({
      title: "Theme",
      themeColor: "#FF0000",
      themeColorDark: "#00FF00",
    });

    await waitFor(() => {
      expect(
        document.querySelectorAll('meta[name="theme-color"]')
      ).toHaveLength(2);
    });

    expect(
      meta('name="theme-color"][media="(prefers-color-scheme: light)"')
    ).toBe("#FF0000");
    expect(
      meta('name="theme-color"][media="(prefers-color-scheme: dark)"')
    ).toBe("#00FF00");
  });

  it("sets the document language", async () => {
    renderSEO({ title: "Lang", lang: "es" });
    await waitFor(() => {
      expect(document.documentElement.lang).toBe("es");
    });
  });
});
