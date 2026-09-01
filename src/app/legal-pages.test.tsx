import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";

afterEach(() => {
  cleanup();
});

describe("public website legal pages", () => {
  it("limits the privacy notice to website and research-list data", () => {
    render(<PrivacyPage />);

    expect(
      screen.getByRole("heading", { name: "Privacy notice" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Google Forms/)).toBeInTheDocument();
    expect(screen.getAllByText(/Cloudflare/).length).toBeGreaterThan(0);
    expect(document.body.textContent).not.toMatch(
      /beta product|documents you upload|AI model providers|account details/i,
    );
  });

  it("states that website use does not create product access or support", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { name: "Website terms" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /does not create an account, product entitlement, trial, or support commitment/i,
      ),
    ).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(
      /private beta|documents you upload|AI-generated answers|beta accounts/i,
    );
  });
});
