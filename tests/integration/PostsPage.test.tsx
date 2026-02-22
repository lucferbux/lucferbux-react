import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

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

import PostsPage from "@/pages/PostsPage";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <PostsPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("PostsPage", () => {
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
      (_query: unknown, onNext: Function) => {
        onNext({ docs: [] });
        return vi.fn();
      }
    );

    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Tech Posts")).toBeInTheDocument();
    });
  });

  it("renders post cards with mocked data", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: Function) => {
        onNext({
          docs: [
            {
              id: "1",
              data: () => ({
                title: "Post 1",
                title_en: "Post Title 1",
                description: "Desc",
                description_en: "Post Description 1",
                link: "https://example.com/post1",
                image: "https://example.com/post1.png",
                date: { seconds: 1705312800, nanoseconds: 0 },
                loaded: true,
              }),
            },
          ],
        });
        return vi.fn();
      }
    );

    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Post Title 1")).toBeInTheDocument();
    });
  });

  it("renders error state", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, _onNext: Function, onError: Function) => {
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
