import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PrintExportButton } from "@/features/preview/print-export-button";
import { PreviewPanel } from "@/features/preview/preview-panel";

export default function CVPreviewPage() {
  return (
    <>
      <PageHeader
        actions={
          <div className="flex gap-2">
            <ButtonLink href="/cv" variant="secondary">
              Back to Builder
            </ButtonLink>
            <PrintExportButton />
          </div>
        }
        description="Live mock CV preview rendered through iframe srcDoc."
        title="Preview CV"
      />
      <PreviewPanel />
    </>
  );
}
