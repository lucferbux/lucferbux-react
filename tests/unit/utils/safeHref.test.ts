import { describe, it, expect } from "vitest";
import { isSafeUrl, safeHref } from "@/utils/safeHref";

describe("safeHref", () => {
  it.each([
    "https://github.com/lucferbux",
    "http://www.elladodelmal.com/2018/01/latch.html",
    "mailto:someone@example.com",
  ])("keeps %s", (url) => {
    expect(safeHref(url)).toBe(url);
  });

  it.each([
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    " javascript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "/relative/path",
    "not a url",
    "",
  ])("drops %j", (url) => {
    expect(safeHref(url)).toBeUndefined();
  });

  it("drops missing values", () => {
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
  });

  it("isSafeUrl agrees", () => {
    expect(isSafeUrl("https://lucferbux.dev")).toBe(true);
    expect(isSafeUrl("javascript:void(0)")).toBe(false);
  });
});
