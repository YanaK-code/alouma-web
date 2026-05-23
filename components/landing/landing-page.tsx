import type { ReactNode } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const APP_ENTRY_ROUTE = "/login";

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#preview", label: "Preview" },
  { href: "#privacy", label: "Privacy" },
];

const proofCues = [
  "Guided CV building",
  "Clean PDF export",
  "Privacy-conscious by design",
];

const steps = [
  {
    title: "Answer guided prompts",
    copy: "Start with focused questions that pull out the details recruiters actually scan for.",
  },
  {
    title: "Shape the structure",
    copy: "Organize your experience, skills, education, and projects into a calm, readable flow.",
  },
  {
    title: "Export a clean PDF",
    copy: "Preview the result and move toward a tidy PDF without fighting the layout.",
  },
];

const previewStates = [
  {
    label: "Guided builder",
    title: "A prompt at a time",
    copy: "Focused editing cards keep the next decision obvious.",
  },
  {
    label: "CV preview",
    title: "Readable structure",
    copy: "A live preview keeps hierarchy, spacing, and sections visible.",
  },
  {
    label: "PDF export",
    title: "Output first",
    copy: "Export cues keep the final document in mind from the start.",
  },
  {
    label: "Job tailoring",
    title: "Context-aware review",
    copy: "Tailoring support stays framed as guidance, not automatic overwrite.",
  },
];

const features = [
  {
    title: "Guided, not overwhelming",
    copy: "Alouma breaks the blank-page problem into smaller prompts with practical boundaries.",
  },
  {
    title: "Built for readable CVs",
    copy: "Sections are shaped around scanning, hierarchy, and the rhythm of a real hiring review.",
  },
  {
    title: "PDF-first output",
    copy: "The editing experience keeps export quality close, so the final CV stays clean.",
  },
  {
    title: "AI with boundaries",
    copy: "AI support is designed to suggest and clarify while keeping you in control of the final text.",
  },
];

const faqs = [
  {
    question: "Is Alouma free to try?",
    answer:
      "The current web version includes a placeholder entry flow. Final trial and pricing details should be confirmed before production.",
  },
  {
    question: "Can I export a PDF?",
    answer:
      "Yes. The internal app flow already includes CV preview and PDF export work for the active draft.",
  },
  {
    question: "Is this ATS-friendly?",
    answer:
      "Alouma is designed around readable, predictable CV structure. No product can guarantee every ATS result, but clean hierarchy helps.",
  },
  {
    question: "Does AI rewrite my CV automatically?",
    answer:
      "No. AI is framed as guidance and suggestion. Your CV should not be overwritten without your explicit choice.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your CV is sensitive. The web version is being built with privacy boundaries and secure account handling as production work continues.",
  },
  {
    question: "Can I use it on web and iPhone?",
    answer:
      "Alouma is being brought from iPhone into a web experience. Cross-device details belong in a later product pass.",
  },
];

const footerLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/support", label: "Support" },
  { href: "/terms", label: "Terms" },
  { href: "/delete-account", label: "Delete account" },
  { href: "/contact", label: "Contact" },
];

function PrimaryCta({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <ButtonLink className={className} href={APP_ENTRY_ROUTE} variant="primary">
      {children}
    </ButtonLink>
  );
}

function SecondaryCta({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) {
  return (
    <ButtonLink href={href} variant="secondary">
      {children}
    </ButtonLink>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[560px] lg:mx-0">
      <p className="sr-only">
        Product mockup showing a CV preview, a guided prompt card, and a PDF export cue.
      </p>
      <div
        aria-hidden="true"
        className="rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-6 sm:p-8"
      >
        <div className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6">
          <div className="flex items-center justify-between border-b border-[var(--alouma-hairline)] pb-4">
            <div>
              <div className="h-2.5 w-24 rounded-full bg-[var(--alouma-jet)]" />
              <div className="mt-2 h-2 w-36 rounded-full bg-[var(--alouma-jet)]/25" />
            </div>
            <span className="rounded-[8px] bg-[var(--alouma-mustard-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--alouma-mustard-strong)]">
              CV
            </span>
          </div>
          <div className="mt-6 grid gap-5">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-[var(--alouma-jet)]/65" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-[var(--alouma-jet)]/15" />
                <div className="h-2 w-10/12 rounded-full bg-[var(--alouma-jet)]/15" />
                <div className="h-2 w-8/12 rounded-full bg-[var(--alouma-jet)]/15" />
              </div>
            </div>
            <div className="grid grid-cols-[0.7fr_1fr] gap-5">
              <div className="space-y-2">
                <div className="h-2 w-12 rounded-full bg-[var(--alouma-jet)]/40" />
                <div className="h-2 w-full rounded-full bg-[var(--alouma-jet)]/10" />
                <div className="h-2 w-4/5 rounded-full bg-[var(--alouma-jet)]/10" />
                <div className="h-2 w-3/5 rounded-full bg-[var(--alouma-jet)]/10" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-20 rounded-full bg-[var(--alouma-jet)]/40" />
                <div className="h-2 w-full rounded-full bg-[var(--alouma-jet)]/10" />
                <div className="h-2 w-11/12 rounded-full bg-[var(--alouma-jet)]/10" />
                <div className="h-2 w-7/12 rounded-full bg-[var(--alouma-jet)]/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-4">
            <p className="alouma-eyebrow text-[10px]">Guided prompt</p>
            <p className="mt-2 text-sm font-semibold leading-5 text-[var(--alouma-jet)]">
              What impact did this role create?
            </p>
          </div>
          <div className="rounded-[12px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-4">
            <p className="alouma-eyebrow text-[10px]">Export cue</p>
            <p className="mt-2 text-sm font-semibold leading-5 text-[var(--alouma-jet)]">
              PDF ready preview
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--alouma-jet)]/10">
              <div className="h-full w-4/5 rounded-full bg-[var(--alouma-mustard)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {previewStates.map((state, index) => (
          <span
            className={
              index === 0
                ? "rounded-full bg-[var(--alouma-jet)] px-3 py-1.5 text-xs font-semibold text-white"
                : "rounded-full border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--alouma-muted)]"
            }
            key={state.label}
          >
            {state.label}
          </span>
        ))}
      </div>
      <div className="mt-6 grid gap-3">
        {previewStates.map((state, index) => (
          <article
            className={
              index === 0
                ? "rounded-[12px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-4"
                : "rounded-[12px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] p-4"
            }
            key={state.label}
          >
            <p
              className={
                index === 0
                  ? "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-mustard-strong)]"
                  : "text-xs font-semibold uppercase tracking-[0.16em] text-[var(--alouma-muted)]"
              }
            >
              {state.label}
            </p>
            <h3 className="mt-2 text-base font-semibold text-[var(--alouma-jet)]">
              {state.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
              {state.copy}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--alouma-canvas)] text-[var(--alouma-jet)]">
      <header className="border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)]">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        >
          <Link
            className="text-lg font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            href="/"
          >
            Alouma
          </Link>
          <div className="hidden items-center gap-1 text-sm font-medium text-[var(--alouma-muted)] md:flex">
            {navLinks.map((link) => (
              <Link
                className="rounded-[8px] px-3 py-2 transition-colors duration-150 hover:bg-[var(--alouma-jet)]/5 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="hidden text-sm font-medium text-[var(--alouma-muted)] transition-colors hover:text-[var(--alouma-jet)] sm:inline-flex"
              href={APP_ENTRY_ROUTE}
            >
              Sign in
            </Link>
            <PrimaryCta>Start building</PrimaryCta>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[7fr_5fr] lg:px-8">
          <div>
            <p className="alouma-eyebrow">Calm structure for serious CVs</p>
            <h1 className="alouma-display-hero mt-6 max-w-3xl text-5xl sm:text-6xl lg:text-7xl">
              Build a CV that feels clear before it feels clever.
            </h1>
            <p className="alouma-body-lead mt-6 max-w-2xl text-lg sm:text-xl">
              Alouma guides your content, structures it like a recruiter would expect,
              and helps you export a clean PDF without layout chaos.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryCta>Build my CV</PrimaryCta>
              <SecondaryCta href="#how-it-works">See how it works</SecondaryCta>
            </div>
          </div>
          <HeroVisual />
        </section>

        <section className="border-y border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)]">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
            <p className="max-w-3xl text-base leading-7 text-[var(--alouma-ink)]">
              Designed around recruiter-grade structure, clean PDF export, and guided editing.
            </p>
            <div className="flex flex-wrap gap-2">
              {proofCues.map((cue) => (
                <span
                  className="rounded-full border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-3 py-1.5 text-xs font-semibold text-[var(--alouma-muted)]"
                  key={cue}
                >
                  {cue}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
          id="how-it-works"
        >
          <div className="max-w-2xl">
            <p className="alouma-eyebrow">How it works</p>
            <h2 className="alouma-display-section mt-3 text-3xl sm:text-4xl">
              Clear steps, no layout wrestling.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => {
              const featured = index === 1;
              const stepClass = featured
                ? "rounded-[24px] border border-[var(--alouma-mustard)] bg-[var(--alouma-mustard-soft)] p-8"
                : "rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-8";

              return (
                <article className={stepClass} key={step.title}>
                  <span
                    className={
                      featured
                        ? "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--alouma-jet)] text-sm font-semibold text-[var(--alouma-mustard)]"
                        : "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--alouma-surface-soft)] text-sm font-semibold text-[var(--alouma-jet)]"
                    }
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                    {step.copy}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-[var(--alouma-surface)]" id="preview">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="alouma-eyebrow">Product preview</p>
              <h2 className="alouma-display-section mt-3 text-3xl sm:text-4xl">
                A quiet workspace for building something important.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
                The web product flow is already in place. This landing page simply points
                people into that flow and previews the tone: guided prompts, readable
                structure, PDF awareness, and careful job tailoring support.
              </p>
              <div className="mt-8">
                <PrimaryCta>Start building</PrimaryCta>
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="alouma-eyebrow">What you get</p>
            <h2 className="alouma-display-section mt-3 text-3xl sm:text-4xl">
              Practical structure, recruiter-readable output.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6"
                key={feature.title}
              >
                <div className="mb-5 h-1 w-10 rounded-full bg-[var(--alouma-mustard)]" />
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="border-y border-[var(--alouma-hairline)] bg-[var(--alouma-surface-strong)]"
          id="privacy"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[5fr_7fr] lg:px-8">
            <div>
              <p className="alouma-eyebrow">Privacy</p>
              <h2 className="alouma-display-section mt-3 text-3xl sm:text-4xl">
                Your CV is personal. Alouma treats it that way.
              </h2>
            </div>
            <p className="text-base leading-7 text-[var(--alouma-ink)]">
              The web version is being built with clear privacy boundaries, secure
              account handling, and no unnecessary exposure of user data.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="alouma-eyebrow">FAQ</p>
            <h2 className="alouma-display-section mt-3 text-3xl sm:text-4xl">
              Practical answers before you start.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article
                className="rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6"
                key={faq.question}
              >
                <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--alouma-jet)]">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] px-6 py-16 sm:px-12 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="alouma-eyebrow">Start now</p>
              <h2 className="alouma-display-section mt-3 text-3xl sm:text-5xl">
                Turn the blank page into a CV that reads cleanly.
              </h2>
              <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
                Walk the guided flow, shape the structure, and export a PDF that holds up
                in a recruiter review.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <PrimaryCta>Build my CV</PrimaryCta>
                <SecondaryCta href="#how-it-works">See how it works</SecondaryCta>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-sm font-semibold tracking-[-0.01em]">Alouma</p>
          <nav
            aria-label="Footer"
            className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--alouma-muted)]"
          >
            {footerLinks.map((link) => (
              <Link
                className="rounded-[6px] transition-colors duration-150 hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
