import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";
import { renderWithProviders } from "../../helpers/render";

const renderWithRouter = (ui: React.ReactElement) =>
  renderWithProviders(ui, { route: "/en" });

describe("Footer", () => {
  it("renders without crashing", () => {
    const { container } = renderWithRouter(<Footer />);
    expect(container).toBeTruthy();
  });

  it("renders footer navigation links", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });

  it("renders external links", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText("Old Web")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders the privacy notice text", () => {
    renderWithRouter(<Footer />);
    expect(
      screen.getByText(/does not track any information/i)
    ).toBeInTheDocument();
  });

  it("has correct internal link hrefs", () => {
    renderWithRouter(<Footer />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/en");
    expect(hrefs).toContain("/en/news");
    expect(hrefs).toContain("/en/projects");
    expect(hrefs).toContain("/en/posts");
  });
});
