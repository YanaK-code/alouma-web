import type { Metadata } from "next";
import { PublicPlaceholderPage } from "@/components/landing/public-placeholder-page";

export const metadata: Metadata = {
  title: "Privacy",
};

export default function PrivacyPage() {
  return (
    <PublicPlaceholderPage
      description="This public privacy page is a safe placeholder. It does not make final claims about data handling, retention, subprocessors, or production security controls."
      eyebrow="Public page"
      title="Privacy"
    />
  );
}
