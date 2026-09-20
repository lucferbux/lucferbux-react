import { describe, it, expect } from "vitest";
import { queryFixtures } from "@/data/source/fixture";

/**
 * The fixture source backs both `npm run dev:fixtures` and the visual baseline,
 * so its where/orderBy/limit handling has to match Firestore closely enough
 * that a screenshot taken against it is meaningful.
 */
describe("fixture data source", () => {
  it("returns every row when the query is empty", () => {
    expect(queryFixtures("intro", {}).length).toBeGreaterThan(0);
  });

  it("exposes the document id as `id`, not `_id`", () => {
    const [first] = queryFixtures<{ id: string }>("intro", { limit: 1 });
    expect(first.id).toBeTruthy();
    expect(first).not.toHaveProperty("_id");
  });

  it("hydrates ISO date strings into Timestamp-like objects", () => {
    // The card components branch on `"seconds" in value`, so a plain string
    // would render as NaN.
    const [first] = queryFixtures<{ timestamp: { seconds: number } }>("intro", {
      limit: 1,
    });
    expect(typeof first.timestamp.seconds).toBe("number");
    expect(first.timestamp.seconds).toBeGreaterThan(0);
  });

  it("orders descending by timestamp", () => {
    const rows = queryFixtures<{ timestamp: { seconds: number } }>("intro", {
      orderBy: [["timestamp", "desc"]],
    });
    const seconds = rows.map((r) => r.timestamp.seconds);
    expect(seconds).toEqual([...seconds].sort((a, b) => b - a));
  });

  it("orders ascending by a numeric field", () => {
    const rows = queryFixtures<{ importance: number }>("team", {
      orderBy: [["importance", "asc"]],
    });
    const values = rows.map((r) => r.importance);
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  it("applies limit after ordering", () => {
    const all = queryFixtures<{ id: string }>("intro", {
      orderBy: [["timestamp", "desc"]],
    });
    const limited = queryFixtures<{ id: string }>("intro", {
      orderBy: [["timestamp", "desc"]],
      limit: 3,
    });
    expect(limited).toHaveLength(3);
    expect(limited.map((r) => r.id)).toEqual(all.slice(0, 3).map((r) => r.id));
  });

  it("filters with an equality clause", () => {
    const featured = queryFixtures<{ featured: boolean }>("project", {
      where: [["featured", "==", true]],
    });
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((r) => r.featured === true)).toBe(true);
  });

  it("combines where, orderBy and limit like the home page does", () => {
    const rows = queryFixtures<{ featured: boolean }>("project", {
      where: [["featured", "==", true]],
      orderBy: [["date", "desc"]],
      limit: 2,
    });
    expect(rows.length).toBeLessThanOrEqual(2);
    expect(rows.every((r) => r.featured === true)).toBe(true);
  });

  it("throws for a collection with no fixture data", () => {
    expect(() => queryFixtures("does-not-exist", {})).toThrow(
      /No fixture data/
    );
  });

  it("holds numeric importance values", () => {
    // Live Firestore stores `importance` as a mix of numbers and strings,
    // which breaks ordering. The seed corpus normalises it.
    const rows = queryFixtures<{ importance: unknown }>("team", {});
    expect(rows.every((r) => typeof r.importance === "number")).toBe(true);
  });
});
