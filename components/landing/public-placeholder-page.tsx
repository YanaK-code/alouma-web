import Link from "next/link";

export function PublicPlaceholderPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen bg-[var(--alouma-canvas)] text-[var(--alouma-jet)]">
      <header className="border-b border-[var(--alouma-hairline)] bg-[var(--alouma-canvas)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            className="rounded-[6px] text-lg font-semibold tracking-[-0.01em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
            href="/"
          >
            Alouma
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8">
        <section className="rounded-[24px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-8 sm:p-12">
          <p className="alouma-eyebrow">{eyebrow}</p>
          <h1 className="alouma-display-section mt-4 text-4xl sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            {description}
          </p>
          <p className="mt-8 rounded-[16px] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            TODO: Replace this placeholder with reviewed product, legal, and
            compliance content before production launch.
          </p>
        </section>
      </div>
    </main>
  );
}
