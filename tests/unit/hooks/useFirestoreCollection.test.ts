import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

// Mock firebase modules before importing the hook
const { mockUnsubscribe, mockOnSnapshot } = vi.hoisted(() => ({
  mockUnsubscribe: vi.fn(),
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
}));

// Import after mocks are set up
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

describe("useFirestoreCollection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts in loading state", () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe);

    const { result } = renderHook(() =>
      useFirestoreCollection("test-collection")
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("returns data after snapshot resolves", async () => {
    mockOnSnapshot.mockImplementation((_query: unknown, onNext: Function) => {
      onNext({
        docs: [
          { id: "1", data: () => ({ name: "Item 1" }) },
          { id: "2", data: () => ({ name: "Item 2" }) },
        ],
      });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() =>
      useFirestoreCollection("test-collection")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it("handles errors", async () => {
    const testError = new Error("Firestore error");
    mockOnSnapshot.mockImplementation(
      (_query: unknown, _onNext: Function, onError: Function) => {
        onError(testError);
        return mockUnsubscribe;
      }
    );

    const { result } = renderHook(() =>
      useFirestoreCollection("test-collection")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(testError);
    expect(result.current.data).toEqual([]);
  });

  it("unsubscribes on unmount", () => {
    mockOnSnapshot.mockImplementation(() => mockUnsubscribe);

    const { unmount } = renderHook(() =>
      useFirestoreCollection("test-collection")
    );

    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
