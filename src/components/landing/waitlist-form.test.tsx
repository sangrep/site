import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { WaitlistForm } from "./waitlist-form";

const FORM_RESPONSE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSccYOjrsi5PfnJGFvxavOZRf4UyNxeKimlB-WhzEJDeX2ScUg/formResponse";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.localStorage.clear();
});

describe("WaitlistForm", () => {
  it("rejects an invalid email without posting", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<WaitlistForm />);

    await userEvent.type(screen.getByLabelText("Email"), "not-an-email");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the email to the Google Form and shows success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);
    render(<WaitlistForm />);

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );

    expect(
      await screen.findByText("You're on the research list."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(FORM_RESPONSE_URL);
    expect(init.method).toBe("POST");
    expect(init.mode).toBe("no-cors");
    expect(String(init.body)).toBe("entry.1016929436=ada%40example.com");

    // Success offers the optional follow-up form, prefilled with the email.
    const followUp = screen.getByRole("link", {
      name: "Tell us about your document packages",
    });
    expect(followUp.getAttribute("href")).toContain("viewform?usp=pp_url");
    expect(followUp.getAttribute("href")).toContain("ada%40example.com");
  });

  it("shows an error and preserves the typed email when the POST fails", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network down"));
    vi.stubGlobal("fetch", fetchMock);
    render(<WaitlistForm />);

    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );

    expect(
      await screen.findByText(
        "Something went wrong. Your email is still here, try again.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveValue("ada@example.com");
  });

  it("pretends success without posting when the honeypot is filled", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<WaitlistForm />);

    await userEvent.type(screen.getByLabelText("Email"), "bot@example.com");
    const honeypot = container.querySelector<HTMLInputElement>(
      'input[name="website"]',
    );
    if (!honeypot) throw new Error("honeypot input missing");
    // Bots fill hidden fields; simulate directly since it's not focusable.
    await userEvent.type(honeypot, "https://spam.example", {
      pointerEventsCheck: 0,
    });
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );

    expect(
      await screen.findByText("You're on the research list."),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throttles rapid repeat submissions without posting again", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal("fetch", fetchMock);

    const first = render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );
    expect(
      await screen.findByText("You're on the research list."),
    ).toBeInTheDocument();
    first.unmount();

    // A fresh form within the cooldown window quietly skips the POST.
    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText("Email"), "ada@example.com");
    await userEvent.click(
      screen.getByRole("button", { name: "Join the research list" }),
    );
    expect(
      await screen.findByText("You're on the research list."),
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
