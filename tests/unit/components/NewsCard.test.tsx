import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NewsCard from "@/components/cards/NewsCard";
import type { News } from "@/data/model/news";

const mockNews: News = {
  title: "Noticia de prueba",
  title_en: "Test News",
  description: "Descripción de prueba",
  description_en: "Test Description",
  url: "https://example.com/news",
  image: "https://example.com/image.png",
  timestamp: new Date("2024-01-15T10:00:00Z"),
  loaded: true,
};

describe("NewsCard", () => {
  it("renders news title", () => {
    render(<NewsCard news={mockNews} />);
    expect(screen.getByText("Test News")).toBeInTheDocument();
  });

  it("renders as a link to the news URL", () => {
    render(<NewsCard news={mockNews} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/news");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders the news image with correct src", () => {
    render(<NewsCard news={mockNews} />);
    const images = screen.getAllByRole("img");
    const headerImg = images.find(
      (img) => img.getAttribute("alt") === "News Header Image"
    );
    expect(headerImg).toHaveAttribute("src", "https://example.com/image.png");
  });

  it("renders formatted date", () => {
    render(<NewsCard news={mockNews} />);
    // Date is rendered with toLocaleDateString
    // The exact format depends on locale, just check something renders in the date area
    const dateEl = screen.getByText(/2024|January|enero/i);
    expect(dateEl).toBeInTheDocument();
  });

  it("handles Timestamp-like objects", () => {
    const newsWithTimestamp: News = {
      ...mockNews,
      timestamp: { seconds: 1705312800, nanoseconds: 0 } as any,
    };
    render(<NewsCard news={newsWithTimestamp} />);
    expect(screen.getByText("Test News")).toBeInTheDocument();
  });
});
