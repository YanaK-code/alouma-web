import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Alouma - Guided CV Builder",
  description:
    "Build a clear, recruiter-ready CV with guided prompts, clean structure, and PDF-first export.",
  openGraph: {
    title: "Alouma - Guided CV Builder",
    description:
      "Alouma helps you shape your CV with calm guidance, readable structure, and clean PDF export.",
    type: "website",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
