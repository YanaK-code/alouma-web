import type { Metadata } from "next";
import { PublicPlaceholderPage } from "@/components/landing/public-placeholder-page";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <PublicPlaceholderPage
      description="This public terms page is a safe placeholder. Final terms should be reviewed before the web version is released."
      eyebrow="Public page"
      title="Terms"
    />
  );
}
