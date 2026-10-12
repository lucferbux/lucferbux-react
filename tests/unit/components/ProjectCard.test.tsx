import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import ProjectCard from "@/components/cards/ProjectCard";
import type { Project } from "@/data/model/project";
import { renderWithProviders } from "../../helpers/render";

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
    renderWithProviders(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("renders project description", () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    expect(screen.getByText("Test project description")).toBeInTheDocument();
  });

  it("renders each tag as a chip, from a legacy comma-separated string", () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    for (const tag of ["React", "TypeScript", "Vite"]) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });

  it("collapses tags beyond the third into a count", () => {
    const manyTags = {
      ...mockProject,
      tags: ["React", "TypeScript", "Vite", "Firebase", "Playwright"],
    };
    renderWithProviders(<ProjectCard project={manyTags} />);
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.queryByText("Firebase")).not.toBeInTheDocument();
    expect(screen.getByText("+2")).toHaveAttribute(
      "title",
      "Firebase, Playwright"
    );
  });

  it("shows the year the project dates from", () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("is not a link when the project has no URL", () => {
    renderWithProviders(<ProjectCard project={{ ...mockProject, link: "" }} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Test Project")).toBeInTheDocument();
  });

  it("draws its own cover unless an image was uploaded", () => {
    const { container, rerender } = renderWithProviders(
      <ProjectCard project={mockProject} />
    );
    expect(container.querySelector("img")).toBeNull();

    rerender(
      <ProjectCard
        project={{ ...mockProject, image: "https://example.com/shot.png" }}
      />
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "https://example.com/shot.png"
    );
  });

  it("renders version badge", () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    expect(screen.getByText("2.0")).toBeInTheDocument();
  });

  it("renders as a link to the project URL", () => {
    renderWithProviders(<ProjectCard project={mockProject} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://github.com/test/project");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders captionText when provided", () => {
    renderWithProviders(
      <ProjectCard project={mockProject} captionText="Featured" />
    );
    expect(screen.getByText("Featured")).toBeInTheDocument();
  });

  it("renders without version badge when version is empty", () => {
    const projectNoVersion = { ...mockProject, version: "" };
    renderWithProviders(<ProjectCard project={projectNoVersion} />);
    expect(screen.queryByText("2.0")).not.toBeInTheDocument();
  });
});
