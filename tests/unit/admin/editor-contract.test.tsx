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
  deleteField: () => ({ _methodName: "deleteField" }),
  getCountFromServer: vi.fn(async () => ({ data: () => ({ count: 0 }) })),
  Timestamp: {
    now: () => ({ seconds: 1_800_000_000, nanoseconds: 0 }),
    fromDate: (d: Date) => ({
      seconds: Math.floor(d.getTime() / 1000),
      nanoseconds: 0,
    }),
  },
}));

vi.mock("@/firebase", () => ({ auth: {}, db: {}, app: {} }));

import CollectionEditor from "@/components/admin/CollectionEditor";
import { SCHEMAS } from "@/data/schema";
import { renderWithProviders } from "../../helpers/render";

/** An old timestamp, so an accidental re-stamp on edit is unmistakable. */
const ORIGINAL_DATE = { seconds: 1_300_000_000, nanoseconds: 0 };

interface Case {
  name: string;
  schema: (typeof SCHEMAS)[keyof typeof SCHEMAS];
  path: string;
  /** Existing document the list renders and the edit form loads. */
  row: Record<string, unknown>;
  /** Field whose value identifies the row in the list. */
  titleText: string;
  /** Date-like field the editor must not clobber on update, if any. */
  dateField?: string;
}

const CASES: Case[] = [
  {
    name: "NewsEditor",
    schema: SCHEMAS.news,
    path: "intro",
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
    schema: SCHEMAS.posts,
    path: "patent",
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
    schema: SCHEMAS.projects,
    path: "project",
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
    schema: SCHEMAS.work,
    path: "team",
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

/**
 * Fill every control in the open form with a plausible value, so a create can
 * get past validation regardless of which schema is under test.
 */
async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  const form = document.querySelector("form");
  if (!form) throw new Error("No form is open");
  const controls = Array.from(
    form.querySelectorAll<HTMLElement>("input, textarea, select")
  );

  for (const control of controls) {
    if (control instanceof HTMLInputElement) {
      if (control.type === "checkbox" || control.type === "file") continue;
      if (control.type === "date") {
        await user.clear(control);
        await user.type(control, "2024-01-15");
        continue;
      }
      if (control.type === "number") {
        await user.clear(control);
        await user.type(control, "5");
        continue;
      }
      if (control.type === "url") {
        await user.clear(control);
        await user.type(control, "https://example.com/x");
        continue;
      }
      await user.clear(control);
      await user.type(control, "Brand new");
    } else if (control instanceof HTMLTextAreaElement) {
      await user.clear(control);
      await user.type(control, "Brand new description");
    } else if (control instanceof HTMLSelectElement) {
      const option = Array.from(control.options).find((o) => o.value !== "");
      if (option) await user.selectOptions(control, option.value);
    }
  }
}

describe.each(CASES)(
  "$name CRUD contract",
  ({ schema, path, row, titleText, dateField }) => {
    const renderEditor = () =>
      renderWithProviders(<CollectionEditor schema={schema} />, {
        route: "/admin/" + schema.key,
      });

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
      renderEditor();
      expect(screen.getByText(titleText)).toBeInTheDocument();
    });

    it("subscribes to the correct legacy collection path", () => {
      renderEditor();
      // The UI names and the Firestore names diverge (News -> intro etc.),
      // so this pins the mapping.
      expect(mockOnSnapshot).toHaveBeenCalled();
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), path);
    });

    it("creates a new document with addDoc, not updateDoc", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      await fillRequiredFields(user);
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() => expect(mockAddDoc).toHaveBeenCalledTimes(1));
      expect(mockUpdateDoc).not.toHaveBeenCalled();
      expect(mockAddDoc.mock.calls[0][0]).toMatchObject({ __path: path });
    });

    it("updates the existing document with updateDoc, not addDoc", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^edit:/i }));
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
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^edit:/i }));
      const values = screen
        .getAllByRole("textbox")
        .map((el) => (el as HTMLInputElement).value);
      expect(values).toContain(titleText);
    });

    it("deletes the document when the confirmation is accepted", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^delete:/i }));
      const dialog = await screen.findByRole("alertdialog");
      await user.click(
        within(dialog).getByRole("button", { name: /^delete$/i })
      );

      await waitFor(() => expect(mockDeleteDoc).toHaveBeenCalledTimes(1));
      expect(mockDeleteDoc.mock.calls[0][0]).toMatchObject({
        __path: path,
        __id: row.id,
      });
    });

    it("does not delete when the confirmation is declined", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^delete:/i }));
      const dialog = await screen.findByRole("alertdialog");
      await user.click(
        within(dialog).getByRole("button", { name: /^cancel$/i })
      );

      expect(mockDeleteDoc).not.toHaveBeenCalled();
    });

    // ---- Behaviour added by the schema-driven rewrite. ----

    if (dateField) {
      it("preserves the original date when editing", async () => {
        const user = userEvent.setup();
        renderEditor();

        await user.click(screen.getByRole("button", { name: /^edit:/i }));
        await user.click(screen.getByRole("button", { name: /^save$/i }));

        await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalled());
        // Only the calendar day is editable, so that is what must survive a
        // round trip. Previously the whole value was replaced with now().
        const written = mockUpdateDoc.mock.calls[0][1] as Record<
          string,
          { seconds: number }
        >;
        const writtenDay = new Date(written[dateField].seconds * 1000)
          .toISOString()
          .slice(0, 10);
        const originalDay = new Date(ORIGINAL_DATE.seconds * 1000)
          .toISOString()
          .slice(0, 10);
        expect(writtenDay).toBe(originalDay);
      });
    }

    it("surfaces a visible error when a save is rejected", async () => {
      mockAddDoc.mockRejectedValueOnce(new Error("permission-denied"));
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("labels every field with a human-readable name", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      // Raw Firestore keys like "title_en" are shown as labels today, and the
      // labels are not associated with their inputs at all.
      // Each localized field renders one control per language, labelled with
      // the language spelled out. Previously the label was the raw Firestore
      // key ("title_en") and was not associated with its input at all.
      const englishFields = screen.getAllByLabelText(/\(English\)/i);
      expect(englishFields.length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/\(Spanish\)/i).length).toBe(
        englishFields.length
      );
      expect(screen.queryByLabelText(/_en/)).toBeNull();
    });

    it("submits the form when Enter is pressed in a field", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      await fillRequiredFields(user);
      // Enter in a text field submits the form, which the previous editors
      // could not do because they were not <form> elements.
      const [firstTextbox] = screen.getAllByRole("textbox");
      await user.type(firstTextbox, "{Enter}");

      await waitFor(() => expect(mockAddDoc).toHaveBeenCalled());
    });

    it("rejects a completely empty save", async () => {
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      expect(mockAddDoc).not.toHaveBeenCalled();
    });

    it("keeps the form open when a save fails", async () => {
      mockAddDoc.mockRejectedValueOnce(new Error("offline"));
      const user = userEvent.setup();
      renderEditor();

      await user.click(screen.getByRole("button", { name: /^add$/i }));
      await user.click(screen.getByRole("button", { name: /^save$/i }));

      await waitFor(() =>
        expect(screen.getByRole("button", { name: /^save$/i })).toBeVisible()
      );
    });

    it("scopes row actions so only one row's buttons are present", () => {
      renderEditor();
      const list = screen.getByText(titleText).closest("div")?.parentElement
        ?.parentElement as HTMLElement;
      expect(
        within(list).getAllByRole("button", { name: /^edit:/i })
      ).toHaveLength(1);
    });
  }
);
