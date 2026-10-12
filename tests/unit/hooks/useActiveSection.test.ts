import { describe, it, expect } from "vitest";
import { sectionOf } from "@/hooks/useActiveSection";

describe("sectionOf", () => {
  it("maps the locale root to home", () => {
    expect(sectionOf("/en")).toBe("home");
    expect(sectionOf("/es/")).toBe("home");
  });

  it("maps each listing page to its section in either locale", () => {
    expect(sectionOf("/en/news")).toBe("news");
    expect(sectionOf("/es/projects")).toBe("projects");
    expect(sectionOf("/en/posts")).toBe("posts");
    expect(sectionOf("/es/teaching")).toBe("teaching");
  });

  it("keeps an article under posts", () => {
    expect(sectionOf("/en/blog/react-solid")).toBe("posts");
  });

  it("returns null for pages outside the nav", () => {
    expect(sectionOf("/en/terms")).toBeNull();
    expect(sectionOf("/en/privacy")).toBeNull();
    expect(sectionOf("/en/no-such-page")).toBeNull();
  });
});
