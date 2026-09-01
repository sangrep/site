export const OG_IMAGE_SIZE = { height: 630, width: 1200 } as const;

export const OG_GRAPH = {
  height: 520,
  left: 580,
  top: 55,
  width: 560,
} as const;

export type OgNodeId = "package" | "source" | "selection" | "gap" | "review";

export type OgNode = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type Point = {
  x: number;
  y: number;
};

export type OgConnector = {
  color: string;
  control1: Point;
  control2: Point;
  end: Point;
  id: string;
  source: OgNodeId;
  start: Point;
  strokeWidth: number;
  target: OgNodeId;
};

export const OG_NODES: Record<OgNodeId, OgNode> = {
  package: { height: 76, width: 252, x: 0, y: 16 },
  source: { height: 76, width: 246, x: 56, y: 151 },
  selection: { height: 76, width: 157, x: 118, y: 286 },
  gap: { height: 54, width: 230, x: 0, y: 421 },
  review: { height: 156, width: 218, x: 342, y: 161 },
};

export const OG_NESTING: [OgNodeId, OgNodeId][] = [
  ["package", "source"],
  ["source", "selection"],
];

export const OG_CONNECTORS: OgConnector[] = [
  {
    color: "#505561",
    control1: { x: 126, y: 118 },
    control2: { x: 182, y: 116 },
    end: { x: 182, y: 154 },
    id: "package-source",
    source: "package",
    start: { x: 126, y: 89 },
    strokeWidth: 2,
    target: "source",
  },
  {
    color: "#6962C8",
    control1: { x: 182, y: 252 },
    control2: { x: 246, y: 250 },
    end: { x: 246, y: 289 },
    id: "source-selection",
    source: "source",
    start: { x: 182, y: 224 },
    strokeWidth: 2.5,
    target: "selection",
  },
  {
    color: "#8078EE",
    control1: { x: 300, y: 324 },
    control2: { x: 320, y: 250 },
    end: { x: 345, y: 250 },
    id: "selection-review",
    source: "selection",
    start: { x: 272, y: 324 },
    strokeWidth: 3,
    target: "review",
  },
  {
    color: "#505561",
    control1: { x: 290, y: 448 },
    control2: { x: 320, y: 300 },
    end: { x: 345, y: 300 },
    id: "gap-review",
    source: "gap",
    start: { x: 227, y: 448 },
    strokeWidth: 2,
    target: "review",
  },
];

export function connectorPath(connector: OgConnector): string {
  const { control1, control2, end, start } = connector;

  return `M${start.x} ${start.y} C${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`;
}
