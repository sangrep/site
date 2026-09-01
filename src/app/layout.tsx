import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ScrollbarFade } from "@/components/scrollbar-fade";

import "./globals.css";

const description =
  "Sangrep is early product research into document review connected to evidence, not a released application or availability promise.";
const title = "sangrep · document review connected to evidence";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  applicationName: "sangrep",
  description,
  keywords: [
    "document review",
    "source-connected review",
    "citation navigation",
    "document packages",
    "due diligence",
    "audit",
    "evidence bundles",
    "review research",
  ],
  metadataBase: new URL("https://sangrep.com"),
  openGraph: {
    description,
    locale: "en_US",
    siteName: "sangrep",
    title,
    type: "website",
    url: "/",
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    index: true,
  },
  title: {
    default: title,
    template: "%s · sangrep",
  },
  twitter: {
    card: "summary_large_image",
    description,
    site: "@sangrephq",
    title,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={`${GeistSans.variable} ${GeistMono.variable}`} lang="en">
      <body>
        <ScrollbarFade />
        {children}
      </body>
    </html>
  );
}
