import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import TabBar from "@/components/layout/TabBar";
import { renderWithProviders } from "../../helpers/render";

const currentTabs = () =>
  screen
    .getAllByRole("link")
    .filter((link) => link.getAttribute("aria-current") === "page");

describe("TabBar", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the five sections with locale-prefixed links", () => {
    renderWithProviders(<TabBar />, { route: "/es", locale: "es" });
    const hrefs = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));
    expect(hrefs).toEqual([
      "/es",
      "/es/news",
      "/es/projects",
      "/es/posts",
      "/es/teaching",
    ]);
  });

  it("marks the current section", () => {
    renderWithProviders(<TabBar />, { route: "/en/projects" });
    expect(currentTabs()).toHaveLength(1);
    expect(currentTabs()[0]).toHaveAttribute("href", "/en/projects");
  });

  it("keeps Posts current while reading an article", () => {
    renderWithProviders(<TabBar />, { route: "/es/blog/x", locale: "es" });
    expect(currentTabs()[0]).toHaveAttribute("href", "/es/posts");
  });

  it("marks nothing on pages outside the nav", () => {
    renderWithProviders(<TabBar />, { route: "/en/terms" });
    expect(currentTabs()).toHaveLength(0);
  });

  it("scrolls to the top when the current tab is tapped again", () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    renderWithProviders(<TabBar />, { route: "/en/news" });

    fireEvent.click(screen.getByRole("link", { name: "News" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    vi.unstubAllGlobals();
  });

  it("navigates, without scrolling, when another tab is tapped", () => {
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    renderWithProviders(<TabBar />, { route: "/en/news" });

    fireEvent.click(screen.getByRole("link", { name: "Posts" }));

    expect(scrollTo).not.toHaveBeenCalled();
    expect(currentTabs()[0]).toHaveAttribute("href", "/en/posts");
    vi.unstubAllGlobals();
  });
});
