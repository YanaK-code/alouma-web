import type { ReactNode } from "react";
import Link from "next/link";

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
    <Link
      className={`inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--alouma-mustard)] px-6 text-sm font-semibold text-[var(--alouma-jet)] shadow-[0_14px_30px_rgba(91,69,20,0.16)] transition duration-150 hover:-translate-y-0.5 hover:bg-[#d4a43a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
      href={APP_ENTRY_ROUTE}
    >
      {children}
    </Link>
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
    <Link
      className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--alouma-hairline-strong)] bg-[var(--alouma-surface)] px-6 text-sm font-semibold text-[var(--alouma-jet)] transition duration-150 hover:-translate-y-0.5 hover:border-[rgba(17,17,15,0.25)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
      href={href}
    >
      {children}
    </Link>
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
        className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4 shadow-[var(--alouma-shadow-card)] sm:p-6"
      >
        <div className="absolute inset-x-6 top-6 h-24 rounded-full bg-white/40 blur-3xl" />
        <div className="relative ml-auto w-[78%] rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-5 shadow-[0_20px_45px_rgba(32,29,24,0.12)]">
          <div className="flex items-center justify-between border-b border-[#11110f]/10 pb-4">
            <div>
              <div className="h-2.5 w-24 rounded-full bg-[#11110f]" />
              <div className="mt-2 h-2 w-36 rounded-full bg-[#11110f]/25" />
            </div>
            <div className="rounded-full bg-[#c99a2e]/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6e5012]">
              CV
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <div>
              <div className="h-2.5 w-20 rounded-full bg-[#11110f]/60" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-[#11110f]/15" />
                <div className="h-2 w-10/12 rounded-full bg-[#11110f]/15" />
                <div className="h-2 w-8/12 rounded-full bg-[#11110f]/15" />
              </div>
            </div>
            <div className="grid grid-cols-[0.7fr_1fr] gap-4">
              <div className="space-y-2">
                <div className="h-2 w-12 rounded-full bg-[#11110f]/40" />
                <div className="h-2 w-full rounded-full bg-[#11110f]/10" />
                <div className="h-2 w-4/5 rounded-full bg-[#11110f]/10" />
                <div className="h-2 w-3/5 rounded-full bg-[#11110f]/10" />
              </div>
              <div className="space-y-2">
                <div className="h-2 w-20 rounded-full bg-[#11110f]/40" />
                <div className="h-2 w-full rounded-full bg-[#11110f]/10" />
                <div className="h-2 w-11/12 rounded-full bg-[#11110f]/10" />
                <div className="h-2 w-7/12 rounded-full bg-[#11110f]/10" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-4 top-24 w-[58%] rounded-2xl border border-[var(--alouma-hairline)] bg-white/92 p-4 shadow-[0_18px_40px_rgba(32,29,24,0.12)] backdrop-blur sm:left-7">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#c99a2e]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e5012]">
              Guided prompt
            </p>
          </div>
          <p className="mt-3 text-sm font-semibold leading-5 text-[#11110f]">
            What impact did this role create?
          </p>
          <div className="mt-4 rounded-xl border border-[#11110f]/10 bg-[#f4f1ea] p-3">
            <div className="h-2 w-full rounded-full bg-[#11110f]/20" />
            <div className="mt-2 h-2 w-9/12 rounded-full bg-[#11110f]/20" />
          </div>
        </div>

        <div className="absolute bottom-7 right-5 w-[64%] rounded-2xl border border-white/10 bg-[var(--alouma-jet)] p-4 text-white shadow-[0_18px_42px_rgba(32,29,24,0.22)] sm:right-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                Export cue
              </p>
              <p className="mt-1 text-sm font-semibold">PDF ready preview</p>
            </div>
            <div className="rounded-full bg-[#c99a2e] px-3 py-1 text-xs font-semibold text-[#11110f]">
              Clean
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-4/5 rounded-full bg-[#c99a2e]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="rounded-[1.5rem] border border-[#11110f]/10 bg-[var(--alouma-jet)] p-4 text-white shadow-[var(--alouma-shadow-card)] sm:p-5">
      <div className="rounded-2xl border border-white/10 bg-[#1b1a17] p-4">
        <div className="flex flex-wrap gap-2">
          {previewStates.map((state, index) => (
            <span
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                index === 0
                  ? "border-[#c99a2e] bg-[#c99a2e] text-[#11110f]"
                  : "border-white/10 bg-white/5 text-white/70"
              }`}
              key={state.label}
            >
              {state.label}
            </span>
          ))}
        </div>
        <div className="mt-5 grid gap-3">
          {previewStates.map((state, index) => (
            <article
              className={`rounded-2xl border p-4 ${
                index === 0
                  ? "border-[#c99a2e]/50 bg-[#c99a2e]/10"
                  : "border-white/10 bg-white/[0.04]"
              }`}
              key={state.label}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c99a2e]">
                {state.label}
              </p>
              <h3 className="mt-2 text-base font-semibold">{state.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">{state.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--alouma-canvas)] text-[var(--alouma-jet)]">
      <header className="sticky top-0 z-50 border-b border-[var(--alouma-hairline)] bg-[rgba(243,240,234,0.9)] backdrop-blur-xl">
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
        >
          <Link
            className="text-lg font-semibold tracking-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            href="/"
          >
            Alouma
          </Link>
          <div className="order-3 flex w-full items-center gap-1 overflow-x-auto text-sm font-medium text-[#11110f]/70 sm:order-2 sm:w-auto sm:overflow-visible">
            {navLinks.map((link) => (
              <Link
                className="rounded-xl px-3 py-2 transition duration-150 hover:bg-[#11110f]/5 hover:text-[#11110f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <PrimaryCta className="order-2 min-h-10 px-4 sm:order-3">
            Start building
          </PrimaryCta>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)] lg:px-8 lg:pb-24 lg:pt-24">
          <div>
            <p className="inline-flex rounded-xl border border-[var(--alouma-hairline)] bg-[rgba(251,250,246,0.72)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
              Calm structure for serious CVs
            </p>
            <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-normal text-[var(--alouma-jet)] sm:text-6xl lg:text-7xl">
              Build a CV that feels clear before it feels clever.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--alouma-muted)] sm:text-xl">
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
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
            <p className="max-w-3xl text-base font-medium leading-7 text-[#2d2a25]">
              Designed around recruiter-grade structure, clean PDF export, and guided editing.
            </p>
            <div className="flex flex-wrap gap-2">
              {proofCues.map((cue) => (
                <span
                  className="rounded-xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] px-3 py-2 text-xs font-semibold text-[var(--alouma-muted)]"
                  key={cue}
                >
                  {cue}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
          id="how-it-works"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Clear steps, no layout wrestling.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 shadow-[var(--alouma-shadow-soft)] transition duration-150 hover:-translate-y-1 hover:shadow-[0_22px_46px_rgba(32,29,24,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                key={step.title}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11110f] text-sm font-semibold text-[#c99a2e]">
                  {index + 1}
                </span>
                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#514d45]">{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--alouma-surface)]" id="preview">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
                Product preview
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
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

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <article
                className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6 shadow-[var(--alouma-shadow-soft)]"
                key={feature.title}
              >
                <div className="mb-5 h-1.5 w-12 rounded-full bg-[#c99a2e]" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[var(--alouma-hairline)] bg-[var(--alouma-jet)] text-white" id="privacy">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
              Your CV is personal. Alouma treats it that way.
            </h2>
            <p className="text-base leading-7 text-white/70">
              The web version is being built with clear privacy boundaries, secure
              account handling, and no unnecessary exposure of user data.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
              Practical answers before you start.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <article
                className="rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-6"
                key={faq.question}
              >
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--alouma-muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p className="text-sm font-semibold">Alouma</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#514d45]">
            {footerLinks.map((link) => (
              <Link
                className="rounded-sm transition duration-150 hover:text-[#11110f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
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
