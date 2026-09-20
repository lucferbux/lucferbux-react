import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { collection as mockCollection } from "firebase/firestore";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

/**
 * Behavioural contract for the admin collection editors.
 *
 * These tests are deliberately written against what the editors *do* rather
 * than how they are built, so that replacing the four near-identical editors
 * with a single schema-driven component can be proven behaviour-preserving:
 * the same suite must pass before and after.
 *
 * Tests marked `it.fails` encode behaviour the editors do NOT have yet. They
 * are expected failures today and flip to passing when the rewrite lands, so
 * the rewrite cannot quietly skip them.
 */

const { mockOnSnapshot, mockAddDoc, mockUpdateDoc, mockDeleteDoc, mockDoc } =
  vi.hoisted(() => ({
    mockOnSnapshot: vi.fn(),
    mockAddDoc: vi.fn(),
    mockUpdateDoc: vi.fn(),
    mockDeleteDoc: vi.fn(),
    mockDoc: vi.fn(),
  }));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn((_db: unknown, path: string) => ({ __path: path })),
  query: vi.fn((ref: unknown) => ref),
  onSnapshot: mockOnSnapshot,
  orderBy: vi.fn(),
  where: vi.fn(),
  limit: vi.fn(),
  addDoc: mockAddDoc,
  updateDoc: mockUpdateDoc,
  deleteDoc: mockDeleteDoc,
  doc: mockDoc,
  Timestamp: {
    now: () => ({ seconds: 1_800_000_000, nanoseconds: 0 }),
    fromDate: (d: Date) => ({
      seconds: Math.floor(d.getTime() / 1000),
      nanoseconds: 0,
    }),
  },
}));

vi.mock("@/firebase", () => ({ auth: {}, db: {}, app: {} }));

import NewsEditor from "@/components/admin/NewsEditor";
import PostEditor from "@/components/admin/PostEditor";
import ProjectEditor from "@/components/admin/ProjectEditor";
import WorkEditor from "@/components/admin/WorkEditor";

/** An old timestamp, so an accidental re-stamp on edit is unmistakable. */
const ORIGINAL_DATE = { seconds: 1_300_000_000, nanoseconds: 0 };

interface Case {
  name: string;
  Component: () => React.JSX.Element;
  path: string;
  /** Existing document the list renders and the edit form loads. */
  row: Record<string, unknown>;
  /** Label of the button that opens the create form. */
  addLabel: RegExp;
  /** Field whose value identifies the row in the list. */
  titleText: string;
  /** Date-like field the editor must not clobber on update, if any. */
  dateField?: string;
}

const CASES: Case[] = [
  {
    name: "NewsEditor",
    Component: NewsEditor,
    path: "intro",
    addLabel: /add news/i,
    titleText: "Existing News",
    dateField: "timestamp",
    row: {
      id: "news-1",
      title: "Noticia existente",
      title_en: "Existing News",
      description: "desc es",
      description_en: "desc en",
      url: "https://example.com/news",
      image: "https://example.com/news.png",
      timestamp: ORIGINAL_DATE,
      loaded: true,
    },
  },
  {
    name: "PostEditor",
    Component: PostEditor,
    path: "patent",
    addLabel: /add post/i,
    titleText: "Existing Post",
    dateField: "date",
    row: {
      id: "post-1",
      title: "Entrada existente",
      title_en: "Existing Post",
      description: "desc es",
      description_en: "desc en",
      link: "https://example.com/post",
      image: "https://example.com/post.png",
      date: ORIGINAL_DATE,
      loaded: true,
    },
  },
  {
    name: "ProjectEditor",
    Component: ProjectEditor,
    path: "project",
    addLabel: /add project/i,
    titleText: "Existing Project",
    dateField: "date",
    row: {
      id: "project-1",
      title: "Proyecto existente",
      title_en: "Existing Project",
      description: "desc es",
      description_en: "desc en",
      link: "https://example.com/project",
      tags: "React, TypeScript",
      featured: false,
      version: "1.0.0",
      date: ORIGINAL_DATE,
    },
  },
  {
    name: "WorkEditor",
    Component: WorkEditor,
    path: "team",
    addLabel: /add entry/i,
    titleText: "Existing Role",
    row: {
      id: "work-1",
      name: "Puesto existente",
      name_en: "Existing Role",
      job: "2020 - 2021",
      job_en: "2020 - 2021",
      description: "desc es",
      description_en: "desc en",
      avatar: "https://example.com/avatar.png",
      icon: "redhat",
      importance: 1,
      loaded: true,
    },
  },
];

describe.each(CASES)(
  "$name CRUD contract",
  ({ Component, path, row, addLabel, titleText, dateField }) => {
    let confirmSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      vi.clearAllMocks();
      mockAddDoc.mockResolvedValue({ id: "new-id" });
      mockUpdateDoc.mockResolvedValue(undefined);
      mockDeleteDoc.mockResolvedValue(undefined);
      mockDoc.mockImplementation((_db: unknown, p: string, id: string) => ({
        __path: p,
        __id: id,
      }));
      mockOnSnapshot.mockImplementation(
        (_q: unknown, onNext: (snap: unknown) => void) => {
          onNext({
            docs: [{ id: row.id as string, data: () => row }],
          });
          return vi.fn();
        }
      );
      confirmSpy = vi
        .spyOn(window, "confirm")
        .mockImplementation(() => true) as ReturnType<typeof vi.spyOn>;
    });

    afterEach(() => confirmSpy.mockRestore());

    it("renders existing rows from the snapshot", () => {
      render(<Component />);
      expect(screen.getByText(titleText)).toBeInTheDocument();
    });

    it("subscribes to the correct legacy collection path", () => {
      render(<Component />);
      // The UI names and the Firestore names diverge (News -> intro etc.),
      // so this pins the mapping.
      expect(mockOnSnapshot).toHaveBeenCalled();
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), path);
    });

    it("creates a new document with addDoc, not updateDoc", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      const inputs = screen.getAllByRole("textbox");
      await user.type(inputs[0], "Brand new");
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() => expect(mockAddDoc).toHaveBeenCalledTimes(1));
      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(mockAddDoc.mock.calls[0][0]).toMatchObject({ __path: path });
    });

    it("updates the existing document with updateDoc, not addDoc", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: /^edit$/i }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalledTimes(1));
      expect(mockAddDoc).not.toHaveBeenCalled();
      expect(mockUpdateDoc.mock.calls[0][0]).toMatchObject({
        __path: path,
        __id: row.id,
      });
    });

    it("prefills the edit form with the existing values", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: /^edit$/i }));
      const values = screen
        .getAllByRole("textbox")
        .map((el) => (el as HTMLInputElement).value);
      expect(values).toContain(titleText);
    });

    it("deletes the document when the confirmation is accepted", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: /^delete$/i }));

      await waitFor(() => expect(mockDeleteDoc).toHaveBeenCalledTimes(1));
      expect(mockDeleteDoc.mock.calls[0][0]).toMatchObject({
        __path: path,
        __id: row.id,
      });
    });

    it("does not delete when the confirmation is declined", async () => {
      confirmSpy.mockImplementation(() => false);
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: /^delete$/i }));
      expect(mockDeleteDoc).not.toHaveBeenCalled();
    });

    // ---- Behaviour the rewrite must add. Expected to fail today. ----

    if (dateField) {
      it.fails(
        "preserves the original date when editing (currently re-stamps to now)",
        async () => {
          const user = userEvent.setup();
          render(<Component />);

          await user.click(screen.getByRole("button", { name: /^edit$/i }));
          await user.click(screen.getByRole("button", { name: /^save$/i }));

          await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalled());
          expect(mockUpdateDoc.mock.calls[0][1]).toMatchObject({
            [dateField]: ORIGINAL_DATE,
          });
        }
      );
    }

    it.fails("surfaces a visible error when a save is rejected", async () => {
      mockAddDoc.mockRejectedValueOnce(new Error("permission-denied"));
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it.fails("labels every field with a human-readable name", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      // Raw Firestore keys like "title_en" are shown as labels today, and the
      // labels are not associated with their inputs at all.
      expect(screen.getByLabelText(/title \(english\)/i)).toBeInTheDocument();
    });

    it.fails("submits the form when Enter is pressed in a field", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      const inputs = screen.getAllByRole("textbox");
      await user.type(inputs[0], "Typed{Enter}");

      await waitFor(() => expect(mockAddDoc).toHaveBeenCalled());
    });

    it.fails("rejects a completely empty save", async () => {
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("keeps the form open when a save fails", async () => {
      mockAddDoc.mockRejectedValueOnce(new Error("offline"));
      const user = userEvent.setup();
      render(<Component />);

      await user.click(screen.getByRole("button", { name: addLabel }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() =>
        expect(screen.getByRole("button", { name: /^save$/i })).toBeVisible()
      );
    });

    it("scopes row actions so only one row's buttons are present", () => {
      render(<Component />);
      const list = screen.getByText(titleText).closest("div")?.parentElement
        ?.parentElement as HTMLElement;
      expect(
        within(list).getAllByRole("button", { name: /^edit$/i })
      ).toHaveLength(1);
    });
  }
);
