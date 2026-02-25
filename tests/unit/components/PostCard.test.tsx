import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostCard from "@/components/cards/PostCard";
import type { Post } from "@/data/model/post";

const mockPost: Post = {
  title: "Post de prueba",
  title_en: "Test Post",
  description: "Descripción de prueba",
  description_en: "Test Description for the post card",
  link: "https://example.com/post",
  image: "https://example.com/post.png",
  date: new Date("2024-01-15T10:00:00Z"),
  loaded: true,
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("PostCard", () => {
  it("renders post title", () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("renders post description", () => {
    renderWithRouter(<PostCard post={mockPost} />);
    expect(
      screen.getByText("Test Description for the post card")
    ).toBeInTheDocument();
  });

  it("renders as external link when no internalLink", () => {
    renderWithRouter(<PostCard post={mockPost} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/post");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders as internal link when internalLink is provided", () => {
    const postWithInternal: Post = {
      ...mockPost,
      internalLink: "first-steps-redux",
    };
    renderWithRouter(<PostCard post={postWithInternal} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/blog/first-steps-redux");
  });

  it("renders the post image", () => {
    renderWithRouter(<PostCard post={mockPost} />);
    const images = screen.getAllByRole("img");
    const postImg = images.find(
      (img) => img.getAttribute("alt") === "Post Image"
    );
    expect(postImg).toHaveAttribute("src", "https://example.com/post.png");
  });
});
