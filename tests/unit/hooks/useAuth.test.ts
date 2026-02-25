import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

const { mockOnAuthStateChanged, mockSignInWithEmailAndPassword, mockSignOut } =
  vi.hoisted(() => ({
    mockOnAuthStateChanged: vi.fn(),
    mockSignInWithEmailAndPassword: vi.fn(),
    mockSignOut: vi.fn(),
  }));

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  signOut: mockSignOut,
  onAuthStateChanged: mockOnAuthStateChanged,
  getAuth: vi.fn(),
}));

vi.mock("@/firebase", () => ({
  auth: {},
  db: {},
  app: {},
}));

import { useAuth } from "@/hooks/useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts in loading state", () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets user when auth state changes", async () => {
    const mockUser = { uid: "123", email: "test@test.com" };
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(mockUser);
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("calls signInWithEmailAndPassword on signIn", async () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());
    mockSignInWithEmailAndPassword.mockResolvedValue({
      user: { uid: "123", email: "test@test.com" },
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn("test@test.com", "password");
    });

    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      {},
      "test@test.com",
      "password"
    );
  });

  it("calls firebaseSignOut on signOut", async () => {
    const mockUser = { uid: "123", email: "test@test.com" };
    mockOnAuthStateChanged.mockImplementation((_, callback: Function) => {
      callback(mockUser);
      return vi.fn();
    });
    mockSignOut.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
    });

    await act(async () => {
      await result.current.signOut();
    });

    expect(mockSignOut).toHaveBeenCalled();
  });

  it("handles sign in errors", async () => {
    mockOnAuthStateChanged.mockImplementation(() => vi.fn());
    mockSignInWithEmailAndPassword.mockRejectedValue(
      new Error("Invalid credentials")
    );

    const { result } = renderHook(() => useAuth());

    let caught: Error | undefined;
    await act(async () => {
      try {
        await result.current.signIn("wrong@test.com", "bad");
      } catch (e) {
        caught = e as Error;
      }
    });

    expect(caught?.message).toBe("Invalid credentials");
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    mockOnAuthStateChanged.mockImplementation(() => unsubscribe);

    const { unmount } = renderHook(() => useAuth());
    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
