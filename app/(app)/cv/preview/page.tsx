import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { DesignPanel } from "@/components/design/design-panel";
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
        description="Live CV preview rendered through the same iframe contract used by PDF export."
        title="Preview CV"
      />
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(720px,1fr)_320px]">
        <PreviewPanel defaultZoom="actual" />
        <aside className="grid content-start gap-4">
          <DesignPanel />
          <section className="rounded-[10px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--alouma-muted-soft)]">
              Export source
            </p>
            <p className="mt-2">
              Downloaded PDF remains the source of truth. Preview changes should move toward
              export parity, not the other way around.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
