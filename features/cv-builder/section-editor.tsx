"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { DesignPanel } from "@/components/design/design-panel";
import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import { PreviewPanel } from "@/features/preview/preview-panel";
import type { CvSection } from "@/lib/router/routes";
import { cvSectionLabels } from "@/lib/router/routes";
import { builderSectionDescriptions, builderSections } from "@/lib/resume/readiness";
import { useResumeStore } from "@/lib/stores/resume-store";
import { cn } from "@/lib/utils/cn";
import type { Resume } from "@/schemas/resume";

type ExperienceItem = Resume["experience"][number];
type EducationItem = Resume["education"][number];
type LanguageItem = Resume["languages"][number];
type ProjectItem = Resume["projects"][number];
type CourseItem = Resume["courses"][number];
type LicenseItem = Resume["licenses"][number];
type AwardItem = Resume["awards"][number];
type VolunteerItem = Resume["volunteer"][number];

const fieldGrid = "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]";
const wideFieldGrid = "grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr))]";

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}`;
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function emptyExperience(): ExperienceItem {
  return {
    id: makeId("exp"),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [],
  };
}

function emptyEducation(): EducationItem {
  return {
    id: makeId("edu"),
    school: "",
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
  };
}

function emptyLanguage(): LanguageItem {
  return {
    id: makeId("lang"),
    name: "",
    proficiency: "",
  };
}

function emptyProject(): ProjectItem {
  return {
    id: makeId("project"),
    name: "",
    description: "",
  };
}

function emptyCourse(): CourseItem {
  return {
    id: makeId("course"),
    name: "",
    provider: "",
    date: "",
  };
}

function emptyLicense(): LicenseItem {
  return {
    id: makeId("license"),
    name: "",
    issuer: "",
    date: "",
  };
}

function emptyAward(): AwardItem {
  return {
    id: makeId("award"),
    name: "",
    issuer: "",
    date: "",
    description: "",
  };
}

function emptyVolunteer(): VolunteerItem {
  return {
    id: makeId("vol"),
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    bullets: [],
  };
}

function sectionNoteKey(section: CvSection) {
  return section;
}

function clearSectionNote(resume: Resume, section: CvSection) {
  return {
    ...resume.meta,
    sectionNotes: {
      ...resume.meta.sectionNotes,
      [sectionNoteKey(section)]: "",
    },
  };
}

function ItemFrame({
  children,
  onRemove,
  subtitle,
  title,
}: {
  children: ReactNode;
  onRemove: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <div className="grid gap-4 border-t border-[var(--alouma-hairline)] pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[var(--alouma-jet)]">{title}</h2>
          {subtitle ? (
            <p className="mt-1 truncate text-xs leading-5 text-[var(--alouma-muted)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        <Button className="min-h-8 px-2 text-xs" onClick={onRemove} variant="ghost">
          Remove
        </Button>
      </div>
      {children}
    </div>
  );
}

function EmptySection({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="border-t border-dashed border-[var(--alouma-hairline-strong)] py-5">
      <p className="text-sm leading-6 text-[var(--alouma-muted)]">
        No {label.toLowerCase()} added yet.
      </p>
      <Button className="mt-4" onClick={onAdd} variant="secondary">
        Add {label}
      </Button>
    </div>
  );
}

export function SectionEditor({ section }: { section: CvSection }) {
  const resume = useResumeStore((state) => state.activeResume);
  const hasHydrated = useResumeStore((state) => state.hasHydrated);
  const updateResume = useResumeStore((state) => state.updateResume);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const label = cvSectionLabels[section];

  if (!hasHydrated) {
    return (
      <div className="border-t border-[var(--alouma-hairline)] py-6 text-sm text-[var(--alouma-muted)]">
        Loading {label.toLowerCase()} editor...
      </div>
    );
  }

  function clearSection() {
    updateResume((current) => {
      switch (section) {
        case "basics":
          return {
            ...current,
            basics: {
              fullName: "",
              headline: "",
              email: "",
              phone: "",
              location: "",
              website: "",
              linkedin: "",
            },
          };
        case "summary":
          return { ...current, summary: "" };
        case "experience":
          return { ...current, experience: [] };
        case "education":
          return { ...current, education: [] };
        case "skills":
          return { ...current, skills: [] };
        case "programs-tools":
          return { ...current, programsTools: [] };
        case "languages":
          return { ...current, languages: [], meta: clearSectionNote(current, section) };
        case "projects":
          return { ...current, projects: [], meta: clearSectionNote(current, section) };
        case "courses":
          return { ...current, courses: [], meta: clearSectionNote(current, section) };
        case "licenses":
          return { ...current, licenses: [], meta: clearSectionNote(current, section) };
        case "awards":
          return { ...current, awards: [], meta: clearSectionNote(current, section) };
        case "volunteer":
          return { ...current, volunteer: [], meta: clearSectionNote(current, section) };
        case "interests":
          return { ...current, interests: [], meta: clearSectionNote(current, section) };
      }
    });
  }

  function renderStringList({
    addLabel,
    items,
    onAdd,
    onChange,
    onRemove,
  }: {
    addLabel: string;
    items: string[];
    onAdd: () => void;
    onChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
  }) {
    return (
      <div className="grid gap-4">
        {items.length ? (
          items.map((item, index) => (
            <div
              className="grid gap-3 [grid-template-columns:minmax(min(100%,240px),1fr)] sm:[grid-template-columns:minmax(0,1fr)_auto]"
              key={`${addLabel}-${index}`}
            >
              <TextInput
                onChange={(event) => onChange(index, event.target.value)}
                value={item}
              />
              <Button onClick={() => onRemove(index)} variant="ghost">
                Remove
              </Button>
            </div>
          ))
        ) : (
          <EmptySection label={addLabel} onAdd={onAdd} />
        )}
        {items.length ? (
          <div>
            <Button onClick={onAdd} variant="secondary">
              Add {addLabel}
            </Button>
          </div>
        ) : null}
      </div>
    );
  }

  function renderBasics() {
    return (
      <div className={wideFieldGrid}>
        {(
          [
            ["fullName", "Full name"],
            ["headline", "Headline"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["website", "Website"],
            ["linkedin", "LinkedIn"],
          ] as const
        ).map(([key, fieldLabel]) => (
          <Field key={key} label={fieldLabel}>
            <TextInput
              onChange={(event) =>
                updateResume((current) => ({
                  ...current,
                  basics: { ...current.basics, [key]: event.target.value },
                }))
              }
              value={resume.basics[key] ?? ""}
            />
          </Field>
        ))}
      </div>
    );
  }

  function renderSummary() {
    return (
      <Field label="Professional summary">
        <TextArea
          onChange={(event) => updateResume({ summary: event.target.value })}
          value={resume.summary}
        />
      </Field>
    );
  }

  function renderExperience() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        experience: [...current.experience, emptyExperience()],
      }));
    }

    if (!resume.experience.length) {
      return <EmptySection label="Experience" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.experience.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                experience: current.experience.filter((_, itemIndex) => itemIndex !== index),
              }))
            }
            subtitle={[item.role, item.company].filter(Boolean).join(" at ")}
            title={`Experience ${index + 1}`}
          >
            <div className={wideFieldGrid}>
              <Field label="Role">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, role: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.role}
                />
              </Field>
              <Field label="Company">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, company: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.company}
                />
              </Field>
            </div>
            <div className={fieldGrid}>
              <Field label="Location">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, location: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.location}
                />
              </Field>
              <Field label="Start date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, startDate: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.startDate}
                />
              </Field>
              <Field label="End date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, endDate: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.endDate}
                />
              </Field>
            </div>
            <Field label="Bullets">
              <TextArea
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    experience: current.experience.map((entry, itemIndex) =>
                      itemIndex === index
                        ? { ...entry, bullets: splitLines(event.target.value) }
                        : entry,
                    ),
                  }))
                }
                value={item.bullets.join("\n")}
              />
            </Field>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Experience
          </Button>
        </div>
      </div>
    );
  }

  function renderEducation() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        education: [...current.education, emptyEducation()],
      }));
    }

    if (!resume.education.length) {
      return <EmptySection label="Education" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.education.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                education: current.education.filter((_, itemIndex) => itemIndex !== index),
              }))
            }
            subtitle={[item.school, item.degree].filter(Boolean).join(" - ")}
            title={`Education ${index + 1}`}
          >
            <div className={wideFieldGrid}>
              <Field label="School">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, school: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.school}
                />
              </Field>
              <Field label="Degree">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, degree: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.degree}
                />
              </Field>
            </div>
            <div className={fieldGrid}>
              <Field label="Location">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, location: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.location}
                />
              </Field>
              <Field label="Start date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, startDate: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.startDate}
                />
              </Field>
              <Field label="End date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, endDate: event.target.value } : entry,
                      ),
                    }))
                  }
                  value={item.endDate}
                />
              </Field>
            </div>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Education
          </Button>
        </div>
      </div>
    );
  }

  function renderSkills() {
    return renderStringList({
      addLabel: "Skill",
      items: resume.skills,
      onAdd: () => updateResume((current) => ({ ...current, skills: [...current.skills, ""] })),
      onChange: (index, value) =>
        updateResume((current) => ({
          ...current,
          skills: current.skills.map((item, itemIndex) => (itemIndex === index ? value : item)),
        })),
      onRemove: (index) =>
        updateResume((current) => ({
          ...current,
          skills: current.skills.filter((_, itemIndex) => itemIndex !== index),
        })),
    });
  }

  function renderProgramsTools() {
    return renderStringList({
      addLabel: "Tool",
      items: resume.programsTools,
      onAdd: () =>
        updateResume((current) => ({ ...current, programsTools: [...current.programsTools, ""] })),
      onChange: (index, value) =>
        updateResume((current) => ({
          ...current,
          programsTools: current.programsTools.map((item, itemIndex) =>
            itemIndex === index ? value : item,
          ),
        })),
      onRemove: (index) =>
        updateResume((current) => ({
          ...current,
          programsTools: current.programsTools.filter((_, itemIndex) => itemIndex !== index),
        })),
    });
  }

  function renderLanguages() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        languages: [...current.languages, emptyLanguage()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.languages.length) {
      return <EmptySection label="Language" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.languages.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                languages: current.languages.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={[item.name, item.proficiency].filter(Boolean).join(" - ")}
            title={`Language ${index + 1}`}
          >
            <div className={wideFieldGrid}>
              <Field label="Language">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      languages: current.languages.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, name: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.name}
                />
              </Field>
              <Field label="Proficiency">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      languages: current.languages.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, proficiency: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.proficiency}
                />
              </Field>
            </div>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Language
          </Button>
        </div>
      </div>
    );
  }

  function renderProjects() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        projects: [...current.projects, emptyProject()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.projects.length) {
      return <EmptySection label="Project" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.projects.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={item.name}
            title={`Project ${index + 1}`}
          >
            <Field label="Project name">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    projects: current.projects.map((entry, itemIndex) =>
                      itemIndex === index ? { ...entry, name: event.target.value } : entry,
                    ),
                    meta: clearSectionNote(current, section),
                  }))
                }
                value={item.name}
              />
            </Field>
            <Field label="Description">
              <TextArea
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    projects: current.projects.map((entry, itemIndex) =>
                      itemIndex === index ? { ...entry, description: event.target.value } : entry,
                    ),
                    meta: clearSectionNote(current, section),
                  }))
                }
                value={item.description}
              />
            </Field>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Project
          </Button>
        </div>
      </div>
    );
  }

  function renderCourses() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        courses: [...current.courses, emptyCourse()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.courses.length) {
      return <EmptySection label="Course" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.courses.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                courses: current.courses.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={[item.name, item.provider].filter(Boolean).join(" - ")}
            title={`Course ${index + 1}`}
          >
            <div className={fieldGrid}>
              <Field label="Course">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      courses: current.courses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, name: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.name}
                />
              </Field>
              <Field label="Provider">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      courses: current.courses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, provider: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.provider}
                />
              </Field>
              <Field label="Date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      courses: current.courses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, date: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.date}
                />
              </Field>
            </div>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Course
          </Button>
        </div>
      </div>
    );
  }

  function renderLicenses() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        licenses: [...current.licenses, emptyLicense()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.licenses.length) {
      return <EmptySection label="License" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.licenses.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                licenses: current.licenses.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={[item.name, item.issuer].filter(Boolean).join(" - ")}
            title={`License ${index + 1}`}
          >
            <div className={fieldGrid}>
              <Field label="License">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      licenses: current.licenses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, name: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.name}
                />
              </Field>
              <Field label="Issuer">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      licenses: current.licenses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, issuer: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.issuer}
                />
              </Field>
              <Field label="Date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      licenses: current.licenses.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, date: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.date}
                />
              </Field>
            </div>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add License
          </Button>
        </div>
      </div>
    );
  }

  function renderAwards() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        awards: [...current.awards, emptyAward()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.awards.length) {
      return <EmptySection label="Award" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.awards.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                awards: current.awards.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={[item.name, item.issuer].filter(Boolean).join(" - ")}
            title={`Award ${index + 1}`}
          >
            <div className={fieldGrid}>
              <Field label="Award">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      awards: current.awards.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, name: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.name}
                />
              </Field>
              <Field label="Issuer">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      awards: current.awards.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, issuer: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.issuer}
                />
              </Field>
              <Field label="Date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      awards: current.awards.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, date: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.date}
                />
              </Field>
            </div>
            <Field label="Description">
              <TextArea
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    awards: current.awards.map((entry, itemIndex) =>
                      itemIndex === index ? { ...entry, description: event.target.value } : entry,
                    ),
                    meta: clearSectionNote(current, section),
                  }))
                }
                value={item.description}
              />
            </Field>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Award
          </Button>
        </div>
      </div>
    );
  }

  function renderVolunteer() {
    function addItem() {
      updateResume((current) => ({
        ...current,
        volunteer: [...current.volunteer, emptyVolunteer()],
        meta: clearSectionNote(current, section),
      }));
    }

    if (!resume.volunteer.length) {
      return <EmptySection label="Volunteer Role" onAdd={addItem} />;
    }

    return (
      <div className="grid gap-5">
        {resume.volunteer.map((item, index) => (
          <ItemFrame
            key={item.id}
            onRemove={() =>
              updateResume((current) => ({
                ...current,
                volunteer: current.volunteer.filter((_, itemIndex) => itemIndex !== index),
                meta: clearSectionNote(current, section),
              }))
            }
            subtitle={[item.role, item.organization].filter(Boolean).join(" at ")}
            title={`Volunteer ${index + 1}`}
          >
            <div className={wideFieldGrid}>
              <Field label="Role">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      volunteer: current.volunteer.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, role: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.role}
                />
              </Field>
              <Field label="Organization">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      volunteer: current.volunteer.map((entry, itemIndex) =>
                        itemIndex === index
                          ? { ...entry, organization: event.target.value }
                          : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.organization}
                />
              </Field>
            </div>
            <div className={fieldGrid}>
              <Field label="Location">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      volunteer: current.volunteer.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, location: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.location}
                />
              </Field>
              <Field label="Start date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      volunteer: current.volunteer.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, startDate: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.startDate}
                />
              </Field>
              <Field label="End date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      volunteer: current.volunteer.map((entry, itemIndex) =>
                        itemIndex === index ? { ...entry, endDate: event.target.value } : entry,
                      ),
                      meta: clearSectionNote(current, section),
                    }))
                  }
                  value={item.endDate}
                />
              </Field>
            </div>
            <Field label="Bullets">
              <TextArea
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    volunteer: current.volunteer.map((entry, itemIndex) =>
                      itemIndex === index
                        ? { ...entry, bullets: splitLines(event.target.value) }
                        : entry,
                    ),
                    meta: clearSectionNote(current, section),
                  }))
                }
                value={item.bullets.join("\n")}
              />
            </Field>
          </ItemFrame>
        ))}
        <div>
          <Button onClick={addItem} variant="secondary">
            Add Volunteer Role
          </Button>
        </div>
      </div>
    );
  }

  function renderInterests() {
    return renderStringList({
      addLabel: "Interest",
      items: resume.interests,
      onAdd: () =>
        updateResume((current) => ({
          ...current,
          interests: [...current.interests, ""],
          meta: clearSectionNote(current, section),
        })),
      onChange: (index, value) =>
        updateResume((current) => ({
          ...current,
          interests: current.interests.map((item, itemIndex) =>
            itemIndex === index ? value : item,
          ),
          meta: clearSectionNote(current, section),
        })),
      onRemove: (index) =>
        updateResume((current) => ({
          ...current,
          interests: current.interests.filter((_, itemIndex) => itemIndex !== index),
          meta: clearSectionNote(current, section),
        })),
    });
  }

  function renderSection() {
    switch (section) {
      case "basics":
        return renderBasics();
      case "summary":
        return renderSummary();
      case "experience":
        return renderExperience();
      case "education":
        return renderEducation();
      case "skills":
        return renderSkills();
      case "programs-tools":
        return renderProgramsTools();
      case "languages":
        return renderLanguages();
      case "projects":
        return renderProjects();
      case "courses":
        return renderCourses();
      case "licenses":
        return renderLicenses();
      case "awards":
        return renderAwards();
      case "volunteer":
        return renderVolunteer();
      case "interests":
        return renderInterests();
    }
  }

  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <ButtonLink href="/cv" variant="ghost">
              Sections
            </ButtonLink>
            <Button onClick={saveDraft} variant="secondary">
              Save Draft
            </Button>
            <Button onClick={clearSection} variant="ghost">
              Clear
            </Button>
            <ButtonLink href="/match" variant="secondary">
              Match
            </ButtonLink>
            <ButtonLink href="/cv/preview" variant="secondary">
              Preview
            </ButtonLink>
          </div>
        }
        description="Focused editing inside the guided builder. Changes update the active local draft and preview output."
        title={label}
      />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[200px_minmax(560px,1fr)] 2xl:grid-cols-[200px_minmax(560px,1fr)_minmax(420px,520px)]">
        <aside className="hidden xl:block">
          <nav className="sticky top-6 grid gap-1 border-l border-[var(--alouma-hairline)] pl-3">
            <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              CV sections
            </p>
            {builderSections.map((item) => (
              <Link
                className={cn(
                  "border-l-2 border-transparent px-3 py-2 text-sm font-medium text-[var(--alouma-muted)] transition hover:border-[var(--alouma-hairline-strong)] hover:text-[var(--alouma-jet)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--alouma-focus)]",
                  item === section && "border-[var(--alouma-jet)] bg-white/45 text-[var(--alouma-jet)]",
                )}
                href={`/cv/${item}`}
                key={item}
              >
                {cvSectionLabels[item]}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="grid min-w-0 gap-6">
          <section className="min-w-0">
            <div className="mb-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-[var(--alouma-jet)]">{label}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--alouma-muted)]">
                {section in builderSectionDescriptions
                  ? builderSectionDescriptions[section as keyof typeof builderSectionDescriptions]
                  : "Additional CV details preserved for renderer compatibility."}
              </p>
            </div>
            {renderSection()}
          </section>

          <details className="border-t border-[var(--alouma-hairline)] py-4 2xl:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--alouma-jet)]">
              Design and live preview
            </summary>
            <div className="mt-4 grid gap-4">
              <DesignPanel compact />
              <PreviewPanel />
            </div>
          </details>
        </section>

        <aside className="hidden min-w-0 gap-4 2xl:grid">
          <DesignPanel />
          <section className="min-w-0 border-t border-[var(--alouma-hairline)] pt-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
                  Preview
                </p>
                <h2 className="mt-1 text-base font-semibold text-[var(--alouma-jet)]">
                  Live output
                </h2>
              </div>
              <ButtonLink className="min-h-9 px-3 text-xs" href="/cv/preview" variant="secondary">
                Open
              </ButtonLink>
            </div>
            <PreviewPanel />
          </section>
        </aside>
      </div>
    </>
  );
}
