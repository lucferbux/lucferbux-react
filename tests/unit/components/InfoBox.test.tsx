import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InfoBox from "@/components/text/infoBox";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("InfoBox", () => {
  it("renders title", () => {
    renderWithRouter(
      <InfoBox
        title="Test Title"
        description="Test Desc"
        displayButton={false}
      />
    );
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithRouter(
      <InfoBox
        title="Title"
        description="Test Description"
        displayButton={false}
      />
    );
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("renders button when displayButton is true", () => {
    renderWithRouter(
      <InfoBox
        title="Title"
        description="Desc"
        displayButton={true}
        iconButton="news"
        textButton="See News"
        linkButton="news"
      />
    );
    expect(screen.getByText("See News")).toBeInTheDocument();
  });

  it("does not render button when displayButton is false", () => {
    renderWithRouter(
      <InfoBox
        title="Title"
        description="Desc"
        displayButton={false}
        textButton="See News"
      />
    );
    expect(screen.queryByText("See News")).not.toBeInTheDocument();
  });

  it("applies dark color styling", () => {
    renderWithRouter(
      <InfoBox
        title="Dark Title"
        description="Dark Desc"
        darkColor={true}
        displayButton={false}
      />
    );
    const title = screen.getByText("Dark Title");
    expect(title.className).toContain("text-black");
  });

  it("applies light color styling by default", () => {
    renderWithRouter(
      <InfoBox
        title="Light Title"
        description="Light Desc"
        displayButton={false}
      />
    );
    const title = screen.getByText("Light Title");
    expect(title.className).toContain("text-white");
  });
});
