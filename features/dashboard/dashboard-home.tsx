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
      <section className="mb-5 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-jet)] p-6 text-white shadow-[var(--alouma-shadow-soft)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard)]">
          Active workspace
        </p>
        <h2 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight">
          Keep the draft moving, then preview before export.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          The web version mirrors the core flow: write, structure, match, save, and preview.
        </p>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card className="grid min-h-48 gap-5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(32,29,24,0.12)]" key={card.href}>
            <div>
              <div className="mb-4 h-1.5 w-10 rounded-full bg-[var(--alouma-mustard)]" />
              <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
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
