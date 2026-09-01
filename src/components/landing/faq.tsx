import type { ReactNode } from "react";

const FAQS: { answer: ReactNode; question: string }[] = [
  {
    answer:
      "Sangrep is an early product direction for review work where source structure, scope, citations, and human judgment need to remain connected. The application is still in development.",
    question: "What is Sangrep?",
  },
  {
    answer:
      "No. There is no public application or supported release available from this website today. The page and its illustrations do not announce product availability.",
    question: "Can I download or use it today?",
  },
  {
    answer:
      "We collect the email address you submit through Google Forms and may send occasional research or availability updates. Joining does not create an account, entitlement, trial, or product access.",
    question: "What happens when I join the research list?",
  },
  {
    answer:
      "No. The website accepts only the email address entered in the research form. Do not send documents, confidential material, credentials, or customer data through the website.",
    question: "Does this website accept document uploads?",
  },
  {
    answer:
      "The website code is available under Apache-2.0. Sangrep names, logos, marketing copy, and designated brand artwork remain reserved brand content. The repository carries the exact file-level classification.",
    question: "How is this website source licensed?",
  },
  {
    answer: (
      <>
        Do not open a public issue. Use the repository&apos;s private
        vulnerability-reporting channel or email{" "}
        <a className="text-citation" href="mailto:security@sangrep.com">
          security@sangrep.com
        </a>
        .
      </>
    ),
    question: "How do I report a security issue?",
  },
];

export function Faq() {
  return (
    <section className="border-t border-border px-6 py-14 md:px-10" id="faq">
      <div className="mx-auto max-w-3xl">
        <p className="m-0 text-label uppercase tracking-[0.09em] text-muted">
          FAQ
        </p>
        <h2 className="m-0 mb-4 mt-2 text-[1.375rem] font-medium tracking-[-0.01em]">
          Questions about this public preview
        </h2>
        {FAQS.map(({ answer, question }) => (
          <details className="group border-b border-border py-4" key={question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-medium [&::-webkit-details-marker]:hidden">
              {question}
              <span
                aria-hidden="true"
                className="text-muted transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="m-0 mt-3 text-small leading-relaxed text-muted">
              {answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
