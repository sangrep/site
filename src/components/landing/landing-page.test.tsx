import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { LandingPage } from "./landing-page";

afterEach(() => {
  cleanup();
});

describe("LandingPage", () => {
  it("frames the page as research rather than released product behavior", () => {
    render(<LandingPage />);

    expect(screen.getByText("Early product research")).toBeInTheDocument();
    expect(
      screen.getByText(
        /This is a product direction, not a released application/,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The whole package. Every answer traced.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Illustrative review trail from source package to reviewer decision",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Join the research list" }),
    ).toHaveLength(2);

    for (const unsupported of [
      "Current capabilities",
      "Roadmap",
      "Parsed today",
      "Coming soon",
    ]) {
      expect(
        screen.queryByText(new RegExp(unsupported)),
      ).not.toBeInTheDocument();
    }
  });

  it("presents product principles and an evidence-centered review loop", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: "Review should stay connected to evidence",
      }),
    ).toBeInTheDocument();
    for (const principle of [
      "Keep the package intact",
      "Make scope visible",
      "Treat citations as navigation",
      "Keep judgment human",
      "Show gaps plainly",
    ]) {
      expect(
        screen.getByRole("heading", { name: principle }),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("heading", {
        name: "A review loop, not a feature list",
      }),
    ).toBeInTheDocument();
    for (const step of [
      "Start with context",
      "Preserve the package",
      "Choose the scope",
      "Follow the source",
      "Make the call",
    ]) {
      expect(screen.getByRole("heading", { name: step })).toBeInTheDocument();
    }
  });

  it("answers only website and availability questions", () => {
    render(<LandingPage />);

    for (const question of [
      "What is Sangrep?",
      "Can I download or use it today?",
      "What happens when I join the research list?",
      "Does this website accept document uploads?",
      "How is this website source licensed?",
      "How do I report a security issue?",
    ]) {
      expect(screen.getByText(question)).toBeInTheDocument();
    }
  });

  it("keeps navigation, legal links, and the Graphite brand surface intact", () => {
    render(<LandingPage />);

    expect(screen.getByRole("link", { name: "Principles" })).toHaveAttribute(
      "href",
      "#principles",
    );
    expect(screen.getByRole("link", { name: "Approach" })).toHaveAttribute(
      "href",
      "#approach",
    );
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute(
      "href",
      "#faq",
    );
    expect(
      screen.getByRole("link", { name: "Privacy notice" }),
    ).toHaveAttribute("href", "/privacy");
    expect(screen.getByRole("link", { name: "Website terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/sangrep/site",
    );

    expect(document.querySelector('[data-slot="landing"]')).toHaveClass("dark");
    expect(document.body.textContent).not.toContain("—");
  });
});
