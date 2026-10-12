import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageTitle from "@/components/text/PageTitle";

describe("PageTitle", () => {
  it("renders the title as the page's level-1 heading", () => {
    render(<PageTitle title="Tech Posts" description="Things I wrote" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Tech Posts" })
    ).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<PageTitle title="Tech Posts" description="Things I wrote" />);
    expect(screen.getByText("Things I wrote")).toBeInTheDocument();
  });
});
