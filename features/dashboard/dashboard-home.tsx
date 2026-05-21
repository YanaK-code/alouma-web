import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const cards = [
  {
    title: "Continue CV",
    description: "Open the section list and continue editing the active draft.",
    href: "/cv",
  },
  {
    title: "Preview CV",
    description: "See the current draft rendered through the iframe preview.",
    href: "/cv/preview",
  },
  {
    title: "Match to Job",
    description: "Paste a job description and see a mocked match result.",
    href: "/match",
  },
  {
    title: "Saved CVs",
    description: "Placeholder for saved resumes and future export history.",
    href: "/saved",
  },
  {
    title: "Settings",
    description: "Placeholder settings and profile controls.",
    href: "/settings",
  },
];

export function DashboardHome() {
  return (
    <>
      <PageHeader
        description="Working app skeleton for the core iOS flow."
        title="Dashboard"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card className="grid gap-4" key={card.href}>
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-neutral-600">{card.description}</p>
            </div>
            <ButtonLink className="w-fit" href={card.href} variant="secondary">
              Open
            </ButtonLink>
          </Card>
        ))}
      </div>
    </>
  );
}
