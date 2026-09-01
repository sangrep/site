import type { CSSProperties } from "react";

import styles from "./pipeline.module.css";

const ROWS: { dir: "left" | "right"; dur: string; widths: number[] }[] = [
  { dir: "left", dur: "62s", widths: [52, 96, 72, 128, 60, 84, 112] },
  { dir: "right", dur: "48s", widths: [88, 56, 116, 68, 98, 48, 132] },
  { dir: "left", dur: "40s", widths: [64, 108, 44, 92, 74, 126, 58] },
  { dir: "right", dur: "66s", widths: [118, 54, 82, 136, 62, 104, 48] },
  { dir: "left", dur: "52s", widths: [76, 124, 56, 96, 46, 114, 68] },
];

function Row({
  dir,
  dur,
  widths,
}: {
  dir: "left" | "right";
  dur: string;
  widths: number[];
}) {
  const loop = [...widths, ...widths];
  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden">
      <div
        className={`${styles.mTrack} ${
          dir === "left" ? styles.mLeft : styles.mRight
        }`}
        data-slot="ambient-evidence-lane"
        style={{ "--dur": dur } as CSSProperties}
      >
        {loop.map((width, index) => (
          <span
            className={`mx-5 h-px shrink-0 rounded-full ${
              index % 3 === 1 ? "bg-citation/35" : "bg-muted/25"
            }`}
            key={`${width}-${index}`}
            style={{ width }}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden flex-col justify-between overflow-hidden py-10 opacity-60 [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] sm:flex"
    >
      {ROWS.map((row) => (
        <Row key={`${row.dir}-${row.dur}`} {...row} />
      ))}
    </div>
  );
}
