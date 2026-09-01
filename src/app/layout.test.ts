import { describe, expect, it, vi } from "vitest";

vi.mock("geist/font/mono", () => ({
  GeistMono: { variable: "font-mono" },
}));
vi.mock("geist/font/sans", () => ({
  GeistSans: { variable: "font-sans" },
}));

import { metadata } from "./layout";

const TITLE = "sangrep · document review connected to evidence";

describe("landing metadata", () => {
  it("uses the descriptive product title on every sharing surface", () => {
    expect(metadata.title).toEqual({
      default: TITLE,
      template: "%s · sangrep",
    });
    expect(metadata.openGraph).toMatchObject({ title: TITLE });
    expect(metadata.twitter).toMatchObject({ title: TITLE });
  });

  it("states research status without claiming product availability", () => {
    expect(metadata.description).toContain("early product research");
    expect(metadata.description).toContain("not a released application");
  });
});
