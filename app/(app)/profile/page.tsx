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
        <h2 className="text-lg font-semibold">Mock Profile</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div>
            <dt className="font-medium">Name</dt>
            <dd className="text-neutral-600">Alex Morgan</dd>
          </div>
          <div>
            <dt className="font-medium">Email</dt>
            <dd className="text-neutral-600">alex@example.com</dd>
          </div>
          <div>
            <dt className="font-medium">Plan</dt>
            <dd className="text-neutral-600">Mock local entitlement</dd>
          </div>
        </dl>
      </Card>
    </>
  );
}
