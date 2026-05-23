import type { Metadata } from "next";
import { PublicPlaceholderPage } from "@/components/landing/public-placeholder-page";

export const metadata: Metadata = {
  title: "Delete Account",
};

export default function DeleteAccountPage() {
  return (
    <PublicPlaceholderPage
      description="This public delete account page is a safe placeholder. It does not perform account deletion, verify identity, or mutate user data."
      eyebrow="Public page"
      title="Delete account"
    />
  );
}
