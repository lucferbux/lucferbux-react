import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  describe("known routing gaps", () => {
    // Both of these should show a 404. NotFoundPage is <Navigate to="/" />,
    // and BlogPostPage sends unknown slugs to "/404", which is not a
    // registered route, so the catch-all bounces them to home as well.
    // Pinned here so that fixing it is a deliberate, visible change.
    it("sends an unknown path to the home page instead of a 404", async () => {
      renderRoute("/no-such-page");
      await waitFor(() => {
        expect(screen.getAllByText(/My Resumée/i).length).toBeGreaterThan(0);
      });
    });

    it("sends an unknown blog slug to the home page instead of a 404", async () => {
      renderRoute("/blog/does-not-exist");
      await waitFor(() => {
        expect(screen.getAllByText(/My Resumée/i).length).toBeGreaterThan(0);
      });
    });
  });
});
