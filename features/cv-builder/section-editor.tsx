"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, TextArea, TextInput } from "@/components/ui/field";
import type { CvSection } from "@/lib/router/routes";
import { cvSectionLabels } from "@/lib/router/routes";
import { useResumeStore } from "@/lib/stores/resume-store";

export function SectionEditor({ section }: { section: CvSection }) {
  const resume = useResumeStore((state) => state.activeResume);
  const updateResume = useResumeStore((state) => state.updateResume);
  const saveDraft = useResumeStore((state) => state.saveDraft);
  const label = cvSectionLabels[section];
  const firstExperience = resume.experience[0];
  const firstEducation = resume.education[0];

  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <Button onClick={saveDraft} variant="secondary">
              Save Draft
            </Button>
            <ButtonLink href="/cv/preview" variant="secondary">
              Preview
            </ButtonLink>
          </div>
        }
        description="Edit the active local draft. Changes persist in browser storage."
        title={label}
      />
      <Card className="max-w-3xl">
        {section === "basics" ? (
          <div className="grid gap-4">
            <Field label="Full name">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, fullName: event.target.value },
                  }))
                }
                value={resume.basics.fullName}
              />
            </Field>
            <Field label="Headline">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, headline: event.target.value },
                  }))
                }
                value={resume.basics.headline}
              />
            </Field>
            <Field label="Email">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, email: event.target.value },
                  }))
                }
                value={resume.basics.email}
              />
            </Field>
            <Field label="Phone">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, phone: event.target.value },
                  }))
                }
                value={resume.basics.phone}
              />
            </Field>
            <Field label="Location">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, location: event.target.value },
                  }))
                }
                value={resume.basics.location}
              />
            </Field>
            <Field label="Website">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    basics: { ...current.basics, website: event.target.value },
                  }))
                }
                value={resume.basics.website}
              />
            </Field>
          </div>
        ) : null}

        {section === "summary" ? (
          <Field label="Professional summary">
            <TextArea
              onChange={(event) => updateResume({ summary: event.target.value })}
              value={resume.summary}
            />
          </Field>
        ) : null}

        {section === "skills" ? (
          <Field label="Skills, comma separated">
            <TextArea
              onChange={(event) =>
                updateResume({
                  skills: event.target.value
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
                })
              }
              value={resume.skills.join(", ")}
            />
          </Field>
        ) : null}

        {section === "programs-tools" ? (
          <Field label="Programs & tools, comma separated">
            <TextArea
              onChange={(event) =>
                updateResume({
                  programsTools: event.target.value
                    .split(",")
                    .map((tool) => tool.trim())
                    .filter(Boolean),
                })
              }
              value={resume.programsTools.join(", ")}
            />
          </Field>
        ) : null}

        {section === "experience" && firstExperience ? (
          <div className="grid gap-4">
            <Field label="Role">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    experience: current.experience.map((item, index) =>
                      index === 0 ? { ...item, role: event.target.value } : item,
                    ),
                  }))
                }
                value={firstExperience.role}
              />
            </Field>
            <Field label="Company">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    experience: current.experience.map((item, index) =>
                      index === 0 ? { ...item, company: event.target.value } : item,
                    ),
                  }))
                }
                value={firstExperience.company}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Location">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((item, index) =>
                        index === 0 ? { ...item, location: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstExperience.location}
                />
              </Field>
              <Field label="Start date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((item, index) =>
                        index === 0 ? { ...item, startDate: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstExperience.startDate}
                />
              </Field>
              <Field label="End date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      experience: current.experience.map((item, index) =>
                        index === 0 ? { ...item, endDate: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstExperience.endDate}
                />
              </Field>
            </div>
            <Field label="Bullets">
              <TextArea
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    experience: current.experience.map((item, index) =>
                      index === 0
                        ? {
                            ...item,
                            bullets: event.target.value
                              .split("\n")
                              .map((bullet) => bullet.trim())
                              .filter(Boolean),
                          }
                        : item,
                    ),
                  }))
                }
                value={firstExperience.bullets.join("\n")}
              />
            </Field>
          </div>
        ) : null}

        {section === "education" && firstEducation ? (
          <div className="grid gap-4">
            <Field label="School">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    education: current.education.map((item, index) =>
                      index === 0 ? { ...item, school: event.target.value } : item,
                    ),
                  }))
                }
                value={firstEducation.school}
              />
            </Field>
            <Field label="Degree">
              <TextInput
                onChange={(event) =>
                  updateResume((current) => ({
                    ...current,
                    education: current.education.map((item, index) =>
                      index === 0 ? { ...item, degree: event.target.value } : item,
                    ),
                  }))
                }
                value={firstEducation.degree}
              />
            </Field>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Location">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((item, index) =>
                        index === 0 ? { ...item, location: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstEducation.location}
                />
              </Field>
              <Field label="Start date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((item, index) =>
                        index === 0 ? { ...item, startDate: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstEducation.startDate}
                />
              </Field>
              <Field label="End date">
                <TextInput
                  onChange={(event) =>
                    updateResume((current) => ({
                      ...current,
                      education: current.education.map((item, index) =>
                        index === 0 ? { ...item, endDate: event.target.value } : item,
                      ),
                    }))
                  }
                  value={firstEducation.endDate}
                />
              </Field>
            </div>
          </div>
        ) : null}

        {![
          "basics",
          "summary",
          "skills",
          "programs-tools",
          "experience",
          "education",
        ].includes(section) ? (
          <Field label={`${label} notes`}>
            <TextArea
              onChange={(event) =>
                updateResume((current) => ({
                  ...current,
                  meta: {
                    ...current.meta,
                    sectionNotes: {
                      ...current.meta.sectionNotes,
                      [section]: event.target.value,
                    },
                  },
                }))
              }
              value={resume.meta.sectionNotes[section] ?? ""}
            />
          </Field>
        ) : null}
      </Card>
    </>
  );
}
