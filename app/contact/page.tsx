import type { Metadata } from "next";
import { PublicPlaceholderPage } from "@/components/landing/public-placeholder-page";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PublicPlaceholderPage
      description="This public contact page is a safe placeholder. It does not collect messages or personal information yet."
      eyebrow="Public page"
      title="Contact"
    />
  );
}
