import "@testing-library/jest-dom/vitest";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "./waitlist-form";

const FORM_VIEW_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSccYOjrsi5PfnJGFvxavOZRf4UyNxeKimlB-WhzEJDeX2ScUg/viewform";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("WaitlistForm", () => {
  it("uses an explicit user-controlled Google Form submission", () => {
    render(<WaitlistForm />);

    const form = screen
      .getByRole("button", { name: "Continue to Google Form" })
      .closest("form");
    expect(form).toHaveAttribute("action", FORM_VIEW_URL);
    expect(form).toHaveAttribute("method", "get");
    expect(form).toHaveAttribute("target", "_blank");
    expect(form).toHaveAttribute("rel", "noreferrer");

    expect(screen.getByLabelText("Email")).toHaveAttribute(
      "name",
      "entry.1016929436",
    );
    expect(screen.getByDisplayValue("pp_url")).toHaveAttribute("name", "usp");
    expect(
      screen.getByText(
        "You’ll review and submit your details on Google Forms.",
      ),
    ).toBeInTheDocument();
  });

  it("cannot turn an unverified request into confirmed enrollment", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);
    render(<WaitlistForm />);

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    const form = screen
      .getByRole("button", { name: "Continue to Google Form" })
      .closest("form");
    if (!form) throw new Error("research form missing");
    fireEvent.submit(form);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(
      screen.queryByText("You're on the research list."),
    ).not.toBeInTheDocument();
  });

  it("keeps validation in the browser before leaving the site", () => {
    render(<WaitlistForm />);

    const email = screen.getByLabelText("Email");
    expect(email).toBeRequired();
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("maxlength", "254");
  });
});
