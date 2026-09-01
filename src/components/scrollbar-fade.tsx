"use client";

import { useEffect } from "react";

/**
 * Toggles html[data-scrolling] while the page is being scrolled so the CSS
 * in globals.css can fade the page scrollbar in, then hides it again once
 * scrolling settles. Renders nothing.
 */
export function ScrollbarFade() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;

    function handleScroll() {
      root.setAttribute("data-scrolling", "");
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        root.removeAttribute("data-scrolling");
      }, 900);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timer) clearTimeout(timer);
      root.removeAttribute("data-scrolling");
    };
  }, []);

  return null;
}
