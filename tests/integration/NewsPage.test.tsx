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

import NewsPage from "@/pages/NewsPage";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <NewsPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("NewsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    mockOnSnapshot.mockImplementation(() => vi.fn());
    renderPage();
    // Should show loading spinner (animated div)
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
      expect(screen.getByText("Latest News")).toBeInTheDocument();
    });
  });

  it("renders news cards with mocked data", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: Function) => {
        onNext({
          docs: [
            {
              id: "1",
              data: () => ({
                title: "Noticia 1",
                title_en: "News Item 1",
                description: "Desc",
                description_en: "Description 1",
                url: "https://example.com/1",
                image: "https://example.com/1.png",
                timestamp: { seconds: 1705312800, nanoseconds: 0 },
                loaded: true,
              }),
            },
            {
              id: "2",
              data: () => ({
                title: "Noticia 2",
                title_en: "News Item 2",
                description: "Desc",
                description_en: "Description 2",
                url: "https://example.com/2",
                image: "https://example.com/2.png",
                timestamp: { seconds: 1705399200, nanoseconds: 0 },
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
      // NewsCardDetail renders both NewsCard and NewsCardCollapsed (one hidden via CSS),
      // so title text appears multiple times in the DOM — use getAllByText
      expect(screen.getAllByText("News Item 1").length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText("News Item 2").length).toBeGreaterThanOrEqual(1);
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
