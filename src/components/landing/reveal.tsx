"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    // Content is visible by default (SSR, no-JS); only elements that start
    // below the fold get hidden and revealed on scroll.
    if (element.getBoundingClientRect().top <= window.innerHeight) return;

    element.dataset.reveal = "pending";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        "data-[reveal=pending]:translate-y-6 data-[reveal=pending]:opacity-0",
        className,
      )}
      ref={ref}
    >
      {children}
    </div>
  );
}
