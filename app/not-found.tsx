import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">VESTERA</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This page is unavailable. Return to the marketplace home screen.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          Open VESTERA
        </Link>
      </section>
    </main>
  );
}
