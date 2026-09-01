import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  description:
    "Terms for using the Sangrep public website and joining its research list.",
  title: "Website terms",
};

export default function TermsPage() {
  return (
    <LegalPage title="Website terms" updated="September 2, 2026">
      <LegalSection title="Scope">
        <p className="m-0">
          These terms apply to the sangrep.com website and its research-list
          form. Using the website or joining the list does not create an
          account, product entitlement, trial, or support commitment.
        </p>
      </LegalSection>
      <LegalSection title="Research list">
        <p className="m-0">
          You may submit an email address and optional research answers. Submit
          only information you are allowed to share. Do not submit documents,
          credentials, customer material, or confidential information.
        </p>
      </LegalSection>
      <LegalSection title="Acceptable use">
        <p className="m-0">
          Do not misuse the website, interfere with its operation, probe it for
          vulnerabilities outside an authorized program, scrape it in a way that
          degrades service, or use it to violate another person&apos;s rights or
          applicable law.
        </p>
      </LegalSection>
      <LegalSection title="Product direction and illustrations">
        <p className="m-0">
          Product descriptions and illustrations explain an early direction.
          They are not a released application, product specification,
          availability promise, supported-format statement, professional advice,
          or warranty.
        </p>
      </LegalSection>
      <LegalSection title="Intellectual property">
        <p className="m-0">
          The Sangrep name, logos, marketing copy, and designated brand artwork
          remain reserved brand content. The public source repository states the
          separate terms that apply to website code and contributions.
        </p>
      </LegalSection>
      <LegalSection title="Third-party services">
        <p className="m-0">
          Cloudflare hosts the website and Google Forms handles research-list
          submissions. Their services are subject to their own terms and may
          change or become unavailable.
        </p>
      </LegalSection>
      <LegalSection title="Availability and warranties">
        <p className="m-0">
          The website is provided as available and may change or be withdrawn.
          To the extent permitted by law, it is provided without warranties, and
          Sangrep is not responsible for decisions made from website
          illustrations or research material.
        </p>
      </LegalSection>
      <LegalSection title="Contact and changes">
        <p className="m-0">
          Material changes will appear on this page with a revised date.
          Questions go to{" "}
          <a className="text-citation" href="mailto:legal@sangrep.com">
            legal@sangrep.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
