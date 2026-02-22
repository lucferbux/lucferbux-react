/**
 * Firebase mock for tests.
 * Mocks firebase/firestore, firebase/auth, and the app's firebase.ts module.
 */
import { vi } from "vitest";

// Minimal Timestamp mock
export class MockTimestamp {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds = 0) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate() {
    return new Date(this.seconds * 1000);
  }

  static now() {
    return new MockTimestamp(Math.floor(Date.now() / 1000));
  }
}

// Mock snapshot doc
export function createMockDoc(id: string, data: Record<string, unknown>) {
  return {
    id,
    data: () => data,
    exists: () => true,
  };
}

// Mock query snapshot
export function createMockSnapshot(docs: ReturnType<typeof createMockDoc>[]) {
  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    forEach: (cb: (doc: ReturnType<typeof createMockDoc>) => void) =>
      docs.forEach(cb),
  };
}

// Mock onSnapshot that immediately calls the callback with provided data
export function createMockOnSnapshot(
  docs: ReturnType<typeof createMockDoc>[]
) {
  return vi.fn((_query: unknown, onNext: (snap: unknown) => void) => {
    onNext(createMockSnapshot(docs));
    return vi.fn(); // unsubscribe
  });
}

// Mock Firebase modules
export const mockDb = {};
export const mockAuth = {};
export const mockApp = {};

export function setupFirebaseMocks(
  docs: ReturnType<typeof createMockDoc>[] = []
) {
  const mockOnSnapshot = createMockOnSnapshot(docs);

  vi.mock("firebase/app", () => ({
    initializeApp: vi.fn(() => mockApp),
    getApps: vi.fn(() => []),
    getApp: vi.fn(() => mockApp),
  }));

  vi.mock("firebase/firestore", () => ({
    getFirestore: vi.fn(() => mockDb),
    collection: vi.fn(),
    query: vi.fn(),
    onSnapshot: mockOnSnapshot,
    getDocs: vi.fn(() => Promise.resolve(createMockSnapshot(docs))),
    getDoc: vi.fn(() =>
      Promise.resolve(docs[0] ?? { exists: () => false, data: () => null })
    ),
    doc: vi.fn(),
    orderBy: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    Timestamp: MockTimestamp,
  }));

  vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(() => mockAuth),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
  }));

  // Mock the app's firebase module
  vi.mock("@/firebase", () => ({
    db: mockDb,
    auth: mockAuth,
    app: mockApp,
  }));

  return { mockOnSnapshot };
}
