import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import type { CSSProperties, ReactNode } from "react";

import {
  connectorPath,
  OG_CONNECTORS,
  OG_GRAPH,
  OG_IMAGE_SIZE,
  OG_NODES,
  type OgNodeId,
} from "./og-image-model";

export const dynamic = "force-static";

export const alt =
  "Sangrep early product research: review connected to evidence";
export const contentType = "image/png";
export const size = OG_IMAGE_SIZE;

const GRID_SIZE = 48;
const GRID_COLUMNS = Array.from(
  { length: Math.ceil(size.width / GRID_SIZE) + 1 },
  (_, index) => index * GRID_SIZE,
);
const GRID_ROWS = Array.from(
  { length: Math.ceil(size.height / GRID_SIZE) + 1 },
  (_, index) => index * GRID_SIZE,
);

const BRAND_BARS = [
  { color: "#F4F2FB", left: 20, top: 5, width: 34 },
  { color: "#8078EE", left: 6, top: 18, width: 29 },
  { color: "#42D8BA", left: 20, top: 31, width: 18 },
  { color: "#8078EE", left: 6, top: 44, width: 29 },
] as const;

const MONO = "Geist Mono";
const SANS = "Geist Sans";

type NodeCardProps = {
  accent?: boolean;
  children: ReactNode;
  id: OgNodeId;
  style?: CSSProperties;
};

function NodeCard({ accent = false, children, id, style }: NodeCardProps) {
  const node = OG_NODES[id];

  return (
    <div
      style={{
        background: "#16181E",
        border: `1px solid ${accent ? "#756CE5" : "#343840"}`,
        borderRadius: 12,
        boxShadow: accent
          ? "0 0 38px rgba(124, 108, 255, 0.24)"
          : "0 16px 36px rgba(0, 0, 0, 0.28)",
        display: "flex",
        flexDirection: "column",
        height: node.height,
        left: node.x,
        overflow: "hidden",
        padding: "12px 14px",
        position: "absolute",
        top: node.y,
        width: node.width,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function NodeTitle({
  children,
  accent = false,
}: {
  children: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        color: accent ? "#C1BAFF" : "#F0F1F4",
        display: "flex",
        fontFamily: MONO,
        fontSize: accent ? 16 : 14,
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function NodeMeta({
  children,
  wrap = false,
}: {
  children: ReactNode;
  wrap?: boolean;
}) {
  return (
    <div
      style={{
        color: "#848B97",
        display: "flex",
        fontFamily: MONO,
        fontSize: 10,
        lineHeight: wrap ? 1.35 : 1,
        marginTop: 6,
        whiteSpace: wrap ? "normal" : "nowrap",
      }}
    >
      {children}
    </div>
  );
}

function DepthLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        alignItems: "center",
        color: "#9F98F1",
        display: "flex",
        fontFamily: MONO,
        fontSize: 8,
        fontWeight: 600,
        gap: 6,
        letterSpacing: "0.04em",
        marginTop: 8,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          background: "rgba(124, 108, 255, 0.2)",
          border: "1px solid #8078EE",
          borderRadius: 2,
          display: "flex",
          height: 7,
          width: 7,
        }}
      />
      {children}
    </div>
  );
}

export default async function OpengraphImage() {
  const [sansRegular, sansSemibold, monoRegular, monoSemibold] =
    await Promise.all([
      readFile(
        new URL(
          "../../node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf",
          import.meta.url,
        ),
      ),
      readFile(
        new URL(
          "../../node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf",
          import.meta.url,
        ),
      ),
      readFile(
        new URL(
          "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf",
          import.meta.url,
        ),
      ),
      readFile(
        new URL(
          "../../node_modules/geist/dist/fonts/geist-mono/GeistMono-SemiBold.ttf",
          import.meta.url,
        ),
      ),
    ]);

  return new ImageResponse(
    <div
      style={{
        backgroundColor: "#0C0D10",
        backgroundImage:
          "radial-gradient(circle at 84% 42%, rgba(124, 108, 255, 0.24), rgba(12, 13, 16, 0) 39%)",
        color: "#F0F1F4",
        display: "flex",
        fontFamily: SANS,
        height: "100%",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          inset: 0,
          opacity: 0.075,
          position: "absolute",
        }}
      >
        {GRID_COLUMNS.map((left) => (
          <div
            key={`column-${left}`}
            style={{
              background: "#FFFFFF",
              bottom: 0,
              display: "flex",
              left,
              position: "absolute",
              top: 0,
              width: 1,
            }}
          />
        ))}
        {GRID_ROWS.map((top) => (
          <div
            key={`row-${top}`}
            style={{
              background: "#FFFFFF",
              display: "flex",
              height: 1,
              left: 0,
              position: "absolute",
              right: 0,
              top,
            }}
          />
        ))}
      </div>

      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 16,
          left: 68,
          position: "absolute",
          top: 47,
        }}
      >
        <div
          style={{
            display: "flex",
            height: 56,
            position: "relative",
            width: 56,
          }}
        >
          {BRAND_BARS.map((bar) => (
            <div
              key={`${bar.left}-${bar.top}`}
              style={{
                background: bar.color,
                borderRadius: 999,
                display: "flex",
                height: 7,
                left: bar.left,
                position: "absolute",
                top: bar.top,
                width: bar.width,
              }}
            />
          ))}
        </div>
        <div
          style={{
            color: "#F4F4F6",
            display: "flex",
            fontFamily: SANS,
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "-0.038em",
          }}
        >
          sangrep
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          left: 68,
          position: "absolute",
          top: 386,
        }}
      >
        <div
          style={{
            color: "#AAA6C8",
            display: "flex",
            fontFamily: MONO,
            fontSize: 15,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          EARLY PRODUCT RESEARCH
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: SANS,
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 0.96,
            marginTop: 20,
          }}
        >
          <div style={{ display: "flex" }}>Keep review</div>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#A99FFF" }}>connected.</span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          height: OG_GRAPH.height,
          left: OG_GRAPH.left,
          position: "absolute",
          top: OG_GRAPH.top,
          width: OG_GRAPH.width,
        }}
      >
        <svg
          height={OG_GRAPH.height}
          style={{ left: 0, position: "absolute", top: 0 }}
          viewBox={`0 0 ${OG_GRAPH.width} ${OG_GRAPH.height}`}
          width={OG_GRAPH.width}
        >
          {OG_CONNECTORS.map((connector) => (
            <path
              d={connectorPath(connector)}
              fill="none"
              key={connector.id}
              stroke={connector.color}
              strokeLinecap="round"
              strokeWidth={connector.strokeWidth}
            />
          ))}
        </svg>

        <NodeCard id="package">
          <NodeTitle>Source package</NodeTitle>
          <NodeMeta>primary + supporting material</NodeMeta>
          <DepthLabel>relationship preserved</DepthLabel>
        </NodeCard>

        <NodeCard id="source" style={{ borderColor: "#4B4F5A" }}>
          <NodeTitle>Selected source</NodeTitle>
          <NodeMeta>review boundary</NodeMeta>
          <DepthLabel>inside visible scope</DepthLabel>
        </NodeCard>

        <NodeCard id="selection" style={{ borderColor: "#6962C8" }}>
          <NodeTitle>Source reference</NodeTitle>
          <NodeMeta>section · passage</NodeMeta>
          <DepthLabel>linked context</DepthLabel>
        </NodeCard>

        <NodeCard id="gap" style={{ paddingTop: 11 }}>
          <NodeTitle>Evidence gap</NodeTitle>
          <NodeMeta>requires reviewer attention</NodeMeta>
        </NodeCard>

        <NodeCard accent id="review">
          <NodeTitle accent>Review note</NodeTitle>
          <NodeMeta wrap>
            A source-connected note prepared for human review.
          </NodeMeta>
          <div
            style={{
              alignSelf: "flex-start",
              background: "rgba(124, 108, 255, 0.18)",
              borderRadius: 5,
              color: "#B8AEFF",
              display: "flex",
              fontFamily: MONO,
              fontSize: 9,
              fontWeight: 600,
              marginTop: 11,
              padding: "6px 8px",
              whiteSpace: "nowrap",
            }}
          >
            source reference → reviewer
          </div>
        </NodeCard>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          data: sansRegular,
          name: SANS,
          style: "normal",
          weight: 400,
        },
        {
          data: sansSemibold,
          name: SANS,
          style: "normal",
          weight: 600,
        },
        {
          data: monoRegular,
          name: MONO,
          style: "normal",
          weight: 400,
        },
        {
          data: monoSemibold,
          name: MONO,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
