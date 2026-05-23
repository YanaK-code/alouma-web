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
        description="Your calm command center for the current CV draft."
        title="Dashboard"
      />
      <section className="mb-6 rounded-[24px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-8">
        <p className="alouma-eyebrow">Active workspace</p>
        <h2 className="alouma-display-section mt-3 max-w-2xl text-2xl sm:text-3xl">
          Keep the draft moving, then preview before export.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--alouma-ink)]">
          The web version mirrors the core flow: write, structure, match, save, and preview.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card className="grid min-h-48 gap-5" key={card.href}>
            <div>
              <div className="mb-4 h-1 w-10 rounded-full bg-[var(--alouma-mustard)]" />
              <h2 className="text-lg font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                {card.description}
              </p>
            </div>
            <ButtonLink className="mt-auto w-fit" href={card.href} variant="secondary">
              Open
            </ButtonLink>
          </Card>
        ))}
      </div>
    </>
  );
}
