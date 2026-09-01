import { describe, expect, it } from "vitest";

import {
  connectorPath,
  OG_CONNECTORS,
  OG_IMAGE_SIZE,
  OG_NESTING,
  OG_NODES,
} from "./og-image-model";

describe("Open Graph evidence trail geometry", () => {
  it("uses the standard large-card dimensions", () => {
    expect(OG_IMAGE_SIZE).toEqual({ height: 630, width: 1200 });
  });

  it("shows the approved nested document chain", () => {
    expect(OG_NESTING).toEqual([
      ["package", "source"],
      ["source", "selection"],
    ]);
  });

  it("leaves enough room for an organic evidence curve", () => {
    const selection = OG_NODES.selection;
    const review = OG_NODES.review;

    expect(review.x - (selection.x + selection.width)).toBeGreaterThanOrEqual(
      50,
    );
  });

  it("keeps every connector endpoint beneath its node edge", () => {
    for (const connector of OG_CONNECTORS) {
      const source = OG_NODES[connector.source];
      const target = OG_NODES[connector.target];

      expect(connector.start.x).toBeGreaterThanOrEqual(source.x);
      expect(connector.start.x).toBeLessThanOrEqual(source.x + source.width);
      expect(connector.start.y).toBeGreaterThanOrEqual(source.y);
      expect(connector.start.y).toBeLessThanOrEqual(source.y + source.height);
      expect(connector.end.x).toBeGreaterThanOrEqual(target.x);
      expect(connector.end.x).toBeLessThanOrEqual(target.x + target.width);
      expect(connector.end.y).toBeGreaterThanOrEqual(target.y);
      expect(connector.end.y).toBeLessThanOrEqual(target.y + target.height);
    }
  });

  it("prevents Bezier controls from overshooting and curling back", () => {
    for (const connector of OG_CONNECTORS) {
      const minX = Math.min(connector.start.x, connector.end.x);
      const maxX = Math.max(connector.start.x, connector.end.x);

      expect(connector.control1.x).toBeGreaterThanOrEqual(minX);
      expect(connector.control1.x).toBeLessThanOrEqual(maxX);
      expect(connector.control2.x).toBeGreaterThanOrEqual(minX);
      expect(connector.control2.x).toBeLessThanOrEqual(maxX);
    }
  });

  it("renders the approved active-evidence path", () => {
    const activeEvidence = OG_CONNECTORS.find(
      (connector) => connector.id === "selection-review",
    );

    expect(activeEvidence).toBeDefined();
    expect(connectorPath(activeEvidence!)).toBe(
      "M272 324 C300 324 320 250 345 250",
    );
  });
});
