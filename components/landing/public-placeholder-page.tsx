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
    <main className="min-h-screen bg-[var(--alouma-canvas)] px-4 py-8 text-[var(--alouma-jet)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          className="inline-flex rounded-sm text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--alouma-focus)]"
          href="/"
        >
          Alouma
        </Link>
        <section className="mt-16 rounded-[1.5rem] border border-[var(--alouma-hairline)] bg-[var(--alouma-surface)] p-8 shadow-[var(--alouma-shadow-soft)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--alouma-mustard-strong)]">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--alouma-muted)]">
            {description}
          </p>
          <p className="mt-6 rounded-2xl border border-[var(--alouma-hairline)] bg-[var(--alouma-surface-soft)] p-4 text-sm leading-6 text-[var(--alouma-muted)]">
            TODO: Replace this placeholder with reviewed product, legal, and
            compliance content before production launch.
          </p>
        </section>
      </div>
    </main>
  );
}
