import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const { mockOnSnapshot, mockOnAuthStateChanged } = vi.hoisted(() => ({
  mockOnSnapshot: vi.fn(),
  mockOnAuthStateChanged: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: mockOnSnapshot,
  orderBy: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  deleteField: () => ({ _methodName: "deleteField" }),
  getCountFromServer: vi.fn(async () => ({ data: () => ({ count: 0 }) })),
  Timestamp: { now: () => ({ seconds: 0, nanoseconds: 0 }) },
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mockOnAuthStateChanged,
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(),
}));

vi.mock("@/firebase", () => ({ auth: {}, db: {}, app: {} }));

import AppRoutes from "@/routes";

function renderRoute(path: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>
  );
}

/**
 * Smoke coverage for every route: it renders, and it renders the right thing.
 *
 * `expectedText` is something only that route shows, so a route silently
 * redirecting elsewhere (which two of them do today) is caught rather than
 * passing as "rendered without crashing".
 */
const ROUTES: Array<{ path: string; title: string; expectedText: RegExp }> = [
  { path: "/", title: "Home | Lucferbux", expectedText: /My Resumée/i },
  { path: "/news", title: "News | Lucferbux", expectedText: /Latest News/i },
  { path: "/posts", title: "Posts | Lucferbux", expectedText: /Tech Posts/i },
  {
    path: "/projects",
    title: "Projects | Lucferbux",
    expectedText: /Explore Projects/i,
  },
  {
    path: "/terms",
    title: "Terms & Conditions | Lucferbux",
    expectedText: /Terms & Conditions/i,
  },
  {
    path: "/privacy",
    title: "Privacy Policy | Lucferbux",
    expectedText: /Privacy/i,
  },
];

describe("routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Resolve every collection immediately with no rows, so sections render
    // their empty state rather than a permanent spinner.
    mockOnSnapshot.mockImplementation(
      (_q: unknown, onNext: (snap: unknown) => void) => {
        onNext({ docs: [] });
        return vi.fn();
      }
    );
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, cb: (user: unknown) => void) => {
        cb(null);
        return vi.fn();
      }
    );
  });

  it.each(ROUTES)(
    "$path renders its own content",
    async ({ path, expectedText }) => {
      renderRoute(path);
      // getAllByText: several of these strings legitimately appear more than
      // once (section heading plus a footer or nav link).
      await waitFor(() => {
        expect(screen.getAllByText(expectedText).length).toBeGreaterThan(0);
      });
    }
  );

  it.each(ROUTES)("$path sets its document title", async ({ path, title }) => {
    renderRoute(path);
    await waitFor(() => expect(document.title).toBe(title));
  });

  it("renders a blog post from markdown", async () => {
    renderRoute("/blog/react-solid");
    await waitFor(() => {
      expect(screen.getAllByText(/SOLID/i).length).toBeGreaterThan(0);
    });
  });

  it("renders the admin login form for an unauthenticated visitor", async () => {
    renderRoute("/admin/login");
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor away from /admin", async () => {
    renderRoute("/admin");
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  describe("404 handling", () => {
    // Both of these used to bounce to the home page: NotFoundPage was
    // <Navigate to="/" />, and BlogPostPage sent unknown slugs to "/404",
    // which was not a registered route.
    it("renders a 404 page for an unknown path", async () => {
      renderRoute("/en/no-such-page");
      await waitFor(() => {
        expect(screen.getByText("404")).toBeInTheDocument();
      });
      expect(screen.getAllByText(/Page not found/i).length).toBeGreaterThan(0);
    });

    it("renders a 404 page for an unknown blog slug", async () => {
      renderRoute("/en/blog/does-not-exist");
      await waitFor(() => {
        expect(screen.getByText("404")).toBeInTheDocument();
      });
    });

    it("renders the 404 page in Spanish", async () => {
      renderRoute("/es/no-such-page");
      await waitFor(() => {
        expect(
          screen.getAllByText(/Página no encontrada/i).length
        ).toBeGreaterThan(0);
      });
    });
  });

  describe("locale routing", () => {
    it("redirects an un-prefixed path into the localized tree", async () => {
      // Previously shared links such as lucferbux.dev/news must keep working.
      renderRoute("/news");
      await waitFor(() => {
        expect(screen.getAllByText(/Latest News/i).length).toBeGreaterThan(0);
      });
    });

    it("renders Spanish chrome under /es", async () => {
      renderRoute("/es/news");
      await waitFor(() => {
        expect(
          screen.getAllByText(/Últimas novedades/i).length
        ).toBeGreaterThan(0);
      });
    });

    it("switches language from the footer toggle", async () => {
      // The toggle lives in the footer, not the header: language is a
      // preference that auto-detects, not a primary navigation action.
      const user = userEvent.setup();
      renderRoute("/en/news");
      await waitFor(() =>
        expect(screen.getAllByText(/Latest News/i).length).toBeGreaterThan(0)
      );

      await user.click(screen.getByRole("button", { name: /cambiar a espa/i }));

      await waitFor(() =>
        expect(
          screen.getAllByText(/Últimas novedades/i).length
        ).toBeGreaterThan(0)
      );
    });

    it("sets the document language from the URL", async () => {
      renderRoute("/es");
      await waitFor(() => {
        expect(document.documentElement.lang).toBe("es");
      });
    });
  });
});
