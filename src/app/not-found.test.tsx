import "@testing-library/jest-dom/vitest";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFound from "./not-found";

describe("not found page", () => {
  it("provides a named page and route back to the website", () => {
    const { container } = render(<NotFound />);

    expect(container.querySelector("main")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Return to Sangrep" }),
    ).toHaveAttribute("href", "/");
  });
});
