import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";

const { mermaidRender } = vi.hoisted(() => ({
  mermaidRender: vi.fn(async (id: string) => ({
    svg: `<svg data-testid="${id}"></svg>`,
  })),
}));

vi.mock("mermaid", () => ({
  default: { initialize: vi.fn(), render: mermaidRender },
}));

import BlogPost from "@/components/blog/BlogPost";
import { LanguageProvider } from "@/i18n/LanguageContext";

function renderPost(content: string, locale: "en" | "es" = "en") {
  return render(
    <MemoryRouter>
      <LanguageProvider locale={locale}>
        <BlogPost title="Post" date="2026-11-13" content={content} />
      </LanguageProvider>
    </MemoryRouter>
  );
}

const fence = "```";

describe("BlogPost", () => {
  it("turns a GitHub alert into a labelled callout", () => {
    const { container } = renderPost("> [!WARNING]\n> Rotate the key.", "es");
    const callout = container.querySelector('[data-callout="warning"]');
    expect(callout).not.toBeNull();
    expect(callout).toHaveTextContent("Atención");
    expect(callout).toHaveTextContent("Rotate the key.");
    expect(callout).not.toHaveTextContent("[!WARNING]");
  });

  it("keeps a plain blockquote as a pull quote", () => {
    const { container } = renderPost("> Just a quote.");
    expect(container.querySelector(".quote-blog")).toHaveTextContent(
      "Just a quote."
    );
    expect(container.querySelector("[data-callout]")).toBeNull();
  });

  it("renders a steps block as an ordered list, with inline code", () => {
    renderPost(
      `${fence}steps loop\nSpecify: Write \`AGENTS.md\` first.\nPlan: Correct the plan.\n${fence}`
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Specify");
    expect(screen.getByText("AGENTS.md").tagName).toBe("CODE");
    expect(screen.getByText(/Plan → Specify/)).toBeInTheDocument();
  });

  it("frames code with its file name, language and a copy button", () => {
    renderPost(`${fence}ts title="src/api.ts"\nconst a = 1;\n${fence}`, "es");
    expect(screen.getByText("src/api.ts")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copiar código" })
    ).toBeInTheDocument();
  });

  it("renders a Mermaid diagram for both colour schemes", async () => {
    const { container } = renderPost(
      `${fence}mermaid title="Flow"\nflowchart LR\n  A --> B\n${fence}`
    );
    const figure = container.querySelector("[data-diagram]");
    expect(figure).toHaveAttribute("data-diagram", "pending");

    await waitFor(() =>
      expect(figure).toHaveAttribute("data-diagram", "ready")
    );
    expect(container.querySelectorAll(".diagram-svg svg")).toHaveLength(2);
    expect(mermaidRender).toHaveBeenCalledWith(
      expect.stringMatching(/-light$/),
      "flowchart LR\n  A --> B"
    );
    expect(screen.getByText("Flow")).toBeInTheDocument();
  });

  it("gives section headings an id and an anchor", () => {
    renderPost("## Why it matters");
    const heading = screen.getByRole("heading", { name: /Why it matters/ });
    expect(heading).toHaveAttribute("id", "why-it-matters");
    expect(heading.querySelector("a")).toHaveAttribute(
      "href",
      "#why-it-matters"
    );
  });
});
