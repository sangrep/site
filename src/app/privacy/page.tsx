import type { Metadata } from "next";

import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  description:
    "How the Sangrep website and research list handle submitted and request data.",
  title: "Privacy notice",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice" updated="September 2, 2026">
      <LegalSection title="Scope">
        <p className="m-0">
          This notice covers the sangrep.com website and its research-list form.
          It does not describe a Sangrep application, product account, trial, or
          customer workspace. Questions go to{" "}
          <a className="text-citation" href="mailto:privacy@sangrep.com">
            privacy@sangrep.com
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title="Information collected">
        <p className="m-0">
          The landing page can open Google Forms with the email address you
          entered prefilled. Google receives your response only after you review
          and submit the form there. We collect that email address and any
          optional research answers you choose to provide through Google Forms.
        </p>
        <p className="m-0">
          Cloudflare hosts the website and may process standard request
          information, such as an IP address, user agent, requested page, and
          request time, to deliver and protect the site.
        </p>
      </LegalSection>
      <LegalSection title="What this website does not collect">
        <p className="m-0">
          This website has no product sign-in and no document-upload field. Do
          not send documents, credentials, customer material, or confidential
          information through the research form.
        </p>
      </LegalSection>
      <LegalSection title="How information is used">
        <p className="m-0">
          We use research-list information to understand interest, conduct
          optional product research, respond to requests, and send occasional
          updates about public availability. We do not sell research-list
          information.
        </p>
      </LegalSection>
      <LegalSection title="Cookies and analytics">
        <p className="m-0">
          The website does not include advertising trackers or a site analytics
          script. Continuing to Google Forms takes you to a third-party service
          governed by its own terms and privacy practices.
        </p>
      </LegalSection>
      <LegalSection title="Retention and deletion">
        <p className="m-0">
          We keep research-list information only while it is useful for the
          purposes above or required for legitimate legal and security needs.
          Email{" "}
          <a className="text-citation" href="mailto:privacy@sangrep.com">
            privacy@sangrep.com
          </a>{" "}
          to ask for access, correction, or deletion.
        </p>
      </LegalSection>
      <LegalSection title="Security and transfers">
        <p className="m-0">
          We use reasonable measures appropriate to this small public website,
          but no internet transmission is perfectly secure. Cloudflare and
          Google may process information in countries other than your own.
        </p>
      </LegalSection>
      <LegalSection title="Changes">
        <p className="m-0">
          Material changes will appear on this page with a revised date. The
          current notice applies only to the website and research list described
          above.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
