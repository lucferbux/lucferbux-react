import { describe, it, expect } from "vitest";
import { coverSpec } from "@/components/projects/coverSpec";
import { toTagArray } from "@/utils/tags";

describe("coverSpec", () => {
  it("is deterministic for a given title", () => {
    expect(coverSpec("Lucferbux.dev", ["React"])).toEqual(
      coverSpec("Lucferbux.dev", ["React"])
    );
  });

  it("differs between titles", () => {
    const a = coverSpec("Lucferbux.dev", ["React"]);
    const b = coverSpec("TOTP Authenticator", ["React"]);
    expect([a.angle, a.glows]).not.toEqual([b.angle, b.glows]);
  });

  it("picks the motif from the first recognised tag, ignoring case", () => {
    expect(coverSpec("x", ["python", "Angular"]).motif).toBe("data");
    expect(coverSpec("x", ["Self-build", "SWIFT"]).motif).toBe("mobile");
    expect(coverSpec("x", ["IA"]).motif).toBe("data");
  });

  it("falls back to a generic motif", () => {
    expect(coverSpec("x", ["Bluetooth LE"]).motif).toBe("generic");
    expect(coverSpec("x", []).motif).toBe("generic");
  });
});

describe("toTagArray", () => {
  it("passes arrays through, trimmed", () => {
    expect(toTagArray([" React ", "Go", ""])).toEqual(["React", "Go"]);
  });

  it("splits the legacy string on commas and middle dots", () => {
    expect(toTagArray("React, TypeScript · Vite")).toEqual([
      "React",
      "TypeScript",
      "Vite",
    ]);
  });

  it("returns an empty list for missing tags", () => {
    expect(toTagArray(undefined)).toEqual([]);
  });
});
