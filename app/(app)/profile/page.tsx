import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        description="Placeholder for future user profile and account information."
        title="Profile"
      />
      <Card className="max-w-2xl">
        <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">Mock Profile</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-semibold">Name</dt>
            <dd className="text-[var(--alouma-muted)]">Alex Morgan</dd>
          </div>
          <div>
            <dt className="font-semibold">Email</dt>
            <dd className="text-[var(--alouma-muted)]">alex@example.com</dd>
          </div>
          <div>
            <dt className="font-semibold">Placeholder paywall step</dt>
            <dd className="text-[var(--alouma-muted)]">Not connected (placeholder)</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
