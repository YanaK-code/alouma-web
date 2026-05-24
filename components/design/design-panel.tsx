"use client";

import { cn } from "@/lib/utils/cn";
import { useResumeStore } from "@/lib/stores/resume-store";
import type { Resume } from "@/schemas/resume";

const templates = [
  {
    key: "novo_classic",
    label: "Essential",
    description:
      "Airy, clean, recruiter-friendly. Best for early-career, junior, and mid-level profiles that need clarity and breathing room.",
  },
  {
    key: "structured",
    label: "Structured",
    description:
      "Denser, more formal, stronger sectioning. Best for mid-senior profiles with more experience and stronger content volume.",
  },
] as const;

const accentOptions = [
  { label: "Mustard / Alouma gold", value: "#F2D04E" },
  { label: "Deep graphite", value: "#24221B" },
  { label: "Muted blue-grey", value: "#6F7F87" },
  { label: "Deep green", value: "#315944" },
  { label: "Muted clay", value: "#A8644C" },
  { label: "Silver / neutral", value: "#AEB6BA" },
] as const;

function activeAccentForTemplate(resume: Resume) {
  if (resume.template === "structured") {
    return resume.structuredSecondaryAccentColor || "#F2D04E";
  }

  return resume.accentColor;
}

export function DesignPanel({ compact = false }: { compact?: boolean }) {
  const resume = useResumeStore((state) => state.activeResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const activeTemplate = resume.template === "structured" ? "structured" : "novo_classic";
  const activeAccent = activeAccentForTemplate(resume).toLowerCase();

  function selectTemplate(template: (typeof templates)[number]["key"]) {
    updateResume((current) => ({
      ...current,
      template,
      structuredPrimaryAccentColor:
        template === "structured"
          ? current.structuredPrimaryAccentColor || "#24221B"
          : current.structuredPrimaryAccentColor,
      structuredSecondaryAccentColor:
        template === "structured"
          ? current.structuredSecondaryAccentColor || current.accentColor || "#F2D04E"
          : current.structuredSecondaryAccentColor,
    }));
  }

  function selectAccent(value: string) {
    updateResume((current) =>
      current.template === "structured"
        ? {
            ...current,
            structuredPrimaryAccentColor: current.structuredPrimaryAccentColor || "#24221B",
            structuredSecondaryAccentColor: value,
          }
        : {
            ...current,
            accentColor: value,
          },
    );
  }

  return (
    <section className="rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-4 shadow-[var(--alouma-shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
            Design
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">
            Template and accent
          </h2>
        </div>
      </div>

      <div className={cn("mt-4 grid gap-2", compact ? "sm:grid-cols-2" : "")}>
        {templates.map((template) => (
          <button
            aria-pressed={activeTemplate === template.key}
            className={cn(
              "rounded-[8px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
              activeTemplate === template.key
                ? "border-[var(--alouma-jet)] bg-white"
                : "border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] hover:border-[var(--alouma-hairline-strong)] hover:bg-white",
            )}
            key={template.key}
            onClick={() => selectTemplate(template.key)}
            type="button"
          >
            <span className="block text-sm font-semibold text-[var(--alouma-jet)]">
              {template.label}
            </span>
            <span className="mt-1 block text-xs leading-5 text-[var(--alouma-muted)]">
              {template.description}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
          Accent
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {accentOptions.map((accent) => (
            <button
              aria-label={accent.label}
              aria-pressed={activeAccent === accent.value.toLowerCase()}
              className={cn(
                "h-8 w-8 rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                activeAccent === accent.value.toLowerCase()
                  ? "border-[var(--alouma-jet)] ring-2 ring-[var(--alouma-jet)]/10"
                  : "border-[var(--alouma-hairline-strong)] hover:border-[var(--alouma-jet)]",
              )}
              key={accent.value}
              onClick={() => selectAccent(accent.value)}
              style={{ backgroundColor: accent.value }}
              title={accent.label}
              type="button"
            />
          ))}
        </div>
        <p className="mt-3 text-xs leading-5 text-[var(--alouma-muted)]">
          Accent changes apply to the active CV template and use the same renderer fields as export.
        </p>
      </div>

      <div className="mt-5 rounded-[8px] border border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)] px-3 py-2 text-xs font-semibold text-[var(--alouma-muted)]">
        Active: {activeTemplate === "structured" ? "Structured" : "Essential"}
      </div>
    </section>
  );
}
