import type { Metadata } from "next";
import { PublicPlaceholderPage } from "@/components/landing/public-placeholder-page";

export const metadata: Metadata = {
  title: "Support",
};

export default function SupportPage() {
  return (
    <PublicPlaceholderPage
      description="This public support page is a safe placeholder. It does not submit requests, create tickets, or expose account data."
      eyebrow="Public page"
      title="Support"
    />
  );
}
