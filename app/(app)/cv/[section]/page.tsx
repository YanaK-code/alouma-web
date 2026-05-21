import { notFound } from "next/navigation";
import { SectionEditor } from "@/features/cv-builder/section-editor";
import { isCvSection } from "@/lib/router/routes";

export default async function CVSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;

  if (!isCvSection(section)) {
    notFound();
  }

  return <SectionEditor section={section} />;
}
