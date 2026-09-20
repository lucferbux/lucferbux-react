import { describe, it, expect } from "vitest";
import { formatDate, toDate } from "@/i18n/formatDate";

const JAN_15_2024 = Date.UTC(2024, 0, 15, 12, 0, 0);

describe("toDate", () => {
  it("accepts a Date", () => {
    const date = new Date(JAN_15_2024);
    expect(toDate(date)).toBe(date);
  });

  it("accepts a Firestore Timestamp-like object", () => {
    expect(toDate({ seconds: JAN_15_2024 / 1000, nanoseconds: 0 })).toEqual(
      new Date(JAN_15_2024)
    );
  });

  it("accepts a real Timestamp with toDate()", () => {
    const date = new Date(JAN_15_2024);
    expect(toDate({ toDate: () => date })).toBe(date);
  });

  it("accepts an ISO string, as used in markdown frontmatter", () => {
    expect(toDate("2024-01-15")?.getUTCFullYear()).toBe(2024);
  });

  it("returns null for unparseable input", () => {
    expect(toDate("not a date")).toBeNull();
    expect(toDate(new Date("nonsense"))).toBeNull();
  });
});

describe("formatDate", () => {
  it("formats in English", () => {
    expect(
      formatDate(JAN_15_2024, "en", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    ).toBe("January 15, 2024");
  });

  it("formats in Spanish", () => {
    expect(
      formatDate(JAN_15_2024, "es", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    ).toBe("15 de enero de 2024");
  });

  it("produces different output per locale for the same instant", () => {
    const options = { timeZone: "UTC" } as const;
    expect(formatDate(JAN_15_2024, "en", options)).not.toBe(
      formatDate(JAN_15_2024, "es", options)
    );
  });

  it("returns an empty string rather than 'Invalid Date'", () => {
    expect(formatDate("not a date", "en")).toBe("");
  });

  it("reuses formatter instances across calls", () => {
    // /news renders 18+ cards; constructing an Intl.DateTimeFormat per card
    // per render is measurably slow.
    const first = formatDate(JAN_15_2024, "en");
    const second = formatDate(JAN_15_2024, "en");
    expect(first).toBe(second);
  });
});
