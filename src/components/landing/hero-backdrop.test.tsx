import "@testing-library/jest-dom/vitest";

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HeroBackdrop } from "./hero-backdrop";

afterEach(() => {
  cleanup();
});

describe("HeroBackdrop", () => {
  it("uses a decorative evidence rhythm without low-contrast text", () => {
    const { container } = render(<HeroBackdrop />);

    const backdrop = container.firstElementChild;
    expect(backdrop).toHaveAttribute("aria-hidden", "true");
    expect(backdrop?.textContent).toBe("");
    const lanes = container.querySelectorAll(
      '[data-slot="ambient-evidence-lane"]',
    );
    expect(lanes).toHaveLength(5);
    for (const lane of lanes) {
      expect(lane.querySelectorAll("span")).toHaveLength(14);
    }
  });
});
