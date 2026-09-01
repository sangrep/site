import { LandingPage } from "@/components/landing/landing-page";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      description:
        "Sangrep is early product research into document review connected to evidence, not a released application or availability promise.",
      name: "sangrep",
      url: "https://sangrep.com/",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sangrep is an early product direction for review work where source structure, scope, citations, and human judgment need to remain connected. The application is still in development.",
          },
          name: "What is Sangrep?",
        },
        {
          "@type": "Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. There is no public application or supported release available from this website today.",
          },
          name: "Can I download or use it today?",
        },
        {
          "@type": "Question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The website accepts only an email address for optional research and availability updates. It does not accept document uploads.",
          },
          name: "What information does this website accept?",
        },
      ],
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        type="application/ld+json"
      />
      <LandingPage />
    </>
  );
}
