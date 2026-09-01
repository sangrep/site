import "@testing-library/jest-dom/vitest";

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import HomePage from "./page";

afterEach(() => {
  cleanup();
});

describe("homepage structured data", () => {
  it("describes only the website and public FAQ", () => {
    const { container } = render(<HomePage />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    if (!script?.textContent) throw new Error("structured data missing");
    const data = JSON.parse(script.textContent) as {
      "@graph": Array<{ "@type": string; description?: string }>;
    };

    expect(data["@graph"].map((entry) => entry["@type"])).toEqual([
      "WebSite",
      "FAQPage",
    ]);
    expect(data["@graph"][0]?.description).toContain("early product research");
    expect(script.textContent).not.toMatch(
      /SoftwareApplication|PreOrder|private beta|AI model providers/i,
    );
  });
});
