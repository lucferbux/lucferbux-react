import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Header from "@/components/layout/Header";
import { renderWithProviders } from "../../helpers/render";

const renderWithRouter = (ui: React.ReactElement) =>
  renderWithProviders(ui, { route: "/en" });

describe("Header", () => {
  it("renders the logo", () => {
    renderWithRouter(<Header />);
    const logo = screen.getByAltText("Lucferbux");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/images/logos/logo.svg");
  });

  it("renders all navigation buttons", () => {
    renderWithRouter(<Header />);
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });

  it("logo links to home", () => {
    renderWithRouter(<Header />);
    const homeLinks = screen.getAllByRole("link");
    const logoLink = homeLinks.find(
      (link) => link.getAttribute("href") === "/en"
    );
    expect(logoLink).toBeInTheDocument();
  });

  it("nav buttons link to correct routes", () => {
    renderWithRouter(<Header />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/en/news");
    expect(hrefs).toContain("/en/projects");
    expect(hrefs).toContain("/en/posts");
  });

  it("marks the current section, and an article as part of posts", () => {
    renderWithProviders(<Header />, { route: "/en/blog/react-solid" });
    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute("href", "/en/posts");
  });
});
