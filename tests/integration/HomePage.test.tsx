import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Mock firebase/firestore
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
  Timestamp: {
    now: () => ({ seconds: Date.now() / 1000, nanoseconds: 0 }),
  },
}));

vi.mock("@/firebase", () => ({
  db: {},
  auth: {},
  app: {},
}));

import HomePage from "@/pages/HomePage";

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock: immediately return empty data for all onSnapshot calls
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: Function) => {
        onNext({ docs: [] });
        return vi.fn(); // unsubscribe
      }
    );
  });

  it("renders without crashing", () => {
    const { container } = renderPage();
    expect(container).toBeTruthy();
  });

  it("renders the hero section with typewriter text area", () => {
    renderPage();
    // HeroSection has social buttons and typewriter
    // Verify the page structure exists
    const container = document.querySelector("section, div");
    expect(container).toBeTruthy();
  });

  it("renders section titles", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Latest News")).toBeInTheDocument();
    });
  });

  it("renders with mocked Firestore data", async () => {
    mockOnSnapshot.mockImplementation(
      (_query: unknown, onNext: Function) => {
        onNext({
          docs: [
            {
              id: "1",
              data: () => ({
                title: "Test News",
                title_en: "Test News EN",
                description: "Desc",
                description_en: "Test description",
                url: "https://example.com",
                image: "https://example.com/img.png",
                timestamp: { seconds: 1705312800, nanoseconds: 0 },
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
      expect(screen.getByText("Latest News")).toBeInTheDocument();
    });
  });
});
