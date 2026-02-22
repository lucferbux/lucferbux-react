import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Footer from "@/components/layout/Footer";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

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
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/news");
    expect(hrefs).toContain("/projects");
    expect(hrefs).toContain("/posts");
  });
});
