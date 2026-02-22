import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

const {
  mockOnAuthStateChanged,
  mockSignInWithEmailAndPassword,
  mockSignOut,
  mockOnSnapshot,
} = vi.hoisted(() => ({
  mockOnAuthStateChanged: vi.fn(),
  mockSignInWithEmailAndPassword: vi.fn(),
  mockSignOut: vi.fn(),
  mockOnSnapshot: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
  getAuth: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  query: vi.fn(),
  onSnapshot: mockOnSnapshot,
  orderBy: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  Timestamp: { now: () => ({ seconds: Date.now() / 1000, nanoseconds: 0 }) },
}));

vi.mock("@/firebase", () => ({
  auth: {},
  db: {},
  app: {},
}));

import AppRoutes from "@/routes";

function renderApp(initialRoute: string) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AppRoutes />
      </MemoryRouter>
    </HelmetProvider>
  );
}

describe("Admin Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshot.mockImplementation(() => vi.fn());
  });

  it("redirects unauthenticated users to login", async () => {
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(null);
      return vi.fn();
    });

    renderApp("/admin/dashboard");

    await waitFor(() => {
      expect(screen.getByText("Admin Login")).toBeInTheDocument();
    });
  });

  it("renders login form with email and password inputs", () => {
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(null);
      return vi.fn();
    });

    renderApp("/admin/login");

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("shows dashboard for authenticated users", async () => {
    const mockUser = { uid: "123", email: "admin@example.com" };
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(mockUser);
      return vi.fn();
    });

    renderApp("/admin/dashboard");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    });

    expect(screen.getByText(/admin@example\.com/)).toBeInTheDocument();
  });

  it("shows collection management links on dashboard", async () => {
    const mockUser = { uid: "123", email: "admin@example.com" };
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(mockUser);
      return vi.fn();
    });

    renderApp("/admin/dashboard");

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    });

    // Use collection descriptions which are unique to the dashboard
    expect(screen.getByText("Manage news items and announcements")).toBeInTheDocument();
    expect(screen.getByText("Manage blog posts and articles")).toBeInTheDocument();
    expect(screen.getByText("Manage portfolio projects")).toBeInTheDocument();
    expect(screen.getByText("Manage work experience entries")).toBeInTheDocument();
  });

  it("handles login form submission", async () => {
    const user = userEvent.setup();
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(null);
      return vi.fn();
    });
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123", email: "test@test.com" },
    });

    renderApp("/admin/login");

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "admin@test.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "admin@test.com",
      "password123"
    );
  });

  it("displays error message on login failure", async () => {
    const user = userEvent.setup();
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(null);
      return vi.fn();
    });
    mockSignInWithEmailAndPassword.mockRejectedValue(
      new Error("auth/wrong-password")
    );

    renderApp("/admin/login");

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "admin@test.com");
    await user.type(passwordInput, "wrong");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("auth/wrong-password")).toBeInTheDocument();
    });
  });

  it("renders sign out button on dashboard", async () => {
    const mockUser = { uid: "123", email: "admin@example.com" };
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(mockUser);
      return vi.fn();
    });
    mockSignOut.mockResolvedValue(undefined);

    renderApp("/admin/dashboard");

    await waitFor(() => {
      expect(screen.getByText("Sign Out")).toBeInTheDocument();
    });
  });
});
