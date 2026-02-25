import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "@/components/layout/Header";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("Header", () => {
  it("renders the logo", () => {
    renderWithRouter(<Header />);
    const logo = screen.getByAltText("Logo Icon");
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
      (link) => link.getAttribute("href") === "/"
    );
    expect(logoLink).toBeInTheDocument();
  });

  it("nav buttons link to correct routes", () => {
    renderWithRouter(<Header />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/news");
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/posts");
  });
});
