import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "@/components/cards/ProjectCard";
import type { Project } from "@/data/model/project";

const mockProject: Project = {
  title: "Proyecto de prueba",
  title_en: "Test Project",
  description: "Descripción de prueba",
  description_en: "Test project description",
  link: "https://github.com/test/project",
  tags: "React, TypeScript, Vite",
  featured: true,
  date: new Date("2024-01-15T10:00:00Z"),
  version: "2.0",
};

describe("ProjectCard", () => {
  it("renders project title", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders project description", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test project description")).toBeInTheDocument();
  });

  it("renders tags as a string", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("React, TypeScript, Vite")).toBeInTheDocument();
  });

  it("renders version badge", () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText("2.0")).toBeInTheDocument();
  });

  it("renders as a link to the project URL", () => {
    render(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/test/project");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders captionText when provided", () => {
    render(<ProjectCard project={mockProject} captionText="Featured" />);
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders without version badge when version is empty", () => {
    const projectNoVersion = { ...mockProject, version: "" };
    render(<ProjectCard project={projectNoVersion} />);
    expect(screen.queryByText("2.0")).not.toBeInTheDocument();
  });
});
