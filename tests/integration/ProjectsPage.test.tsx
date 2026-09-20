import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";

const { mockOnSnapshot } = vi.hoisted(() => ({
  mockOnSnapshot: vi.fn(),
}));
vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: mockOnSnapshot,
  orderBy: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("@/firebase", () => ({
  db: {},
  auth: {},
  app: {},
}));

import ProjectsPage from "@/pages/ProjectsPage";
import { renderWithProviders } from "../helpers/render";

function renderPage() {
  return renderWithProviders(<ProjectsPage />, { route: "/en/projects" });
}

describe("ProjectsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockOnSnapshot.mockImplementation(() => vi.fn());
    renderPage();
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });

  it("renders section title after data loads", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: (snapshot: unknown) => void) => {
        onNext({ docs: [] });
        return vi.fn();
      }
    );

    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Explore Projects")).toBeInTheDocument();
    });
  });

  it("renders project cards with mocked data", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: (snapshot: unknown) => void) => {
        onNext({
          docs: [
            {
              id: "1",
              data: () => ({
                title: "Proyecto 1",
                title_en: "Project Title 1",
                description: "Desc",
                description_en: "Project Description 1",
                link: "https://github.com/test/proj1",
                tags: "React, TypeScript",
                featured: true,
                date: { seconds: 1705312800, nanoseconds: 0 },
                version: "1.0",
              }),
            },
          ],
        });
        return vi.fn();
      }
    );

    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Project Title 1")).toBeInTheDocument();
      expect(screen.getByText("React, TypeScript")).toBeInTheDocument();
    });
  });

  it("renders error state", async () => {
    mockOnSnapshot.mockImplementation(
      (
        _query: unknown,
        _onNext: (snapshot: unknown) => void,
        onError: (error: Error) => void
      ) => {
        onError(new Error("Test error"));
        return vi.fn();
      }
    );

    renderPage();
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
});
