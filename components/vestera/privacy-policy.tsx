"use client";

import { IconLock, IconShieldCheck } from "./ui";
import { Overlay } from "./pieces";

const CLAUSES: Array<{ n: string; title: string; body: string }> = [
  {
    n: "01",
    title: "Information We Collect",
    body: "VESTERA collects only your Pi Network username and your activity within the app that is necessary to operate the marketplace — the listings you create, inspection and service requests you make, and your conversations with other parties.",
  },
  {
    n: "02",
    title: "What We Do Not Store",
    body: "VESTERA does not store passwords. VESTERA does not collect, process or store any FIAT financial data. Authentication is handled entirely through Pi Network.",
  },
  {
    n: "03",
    title: "Property Documents",
    body: "Property documents supplied by agents and legal practitioners are used solely for administrative verification in connection with VESTERA Admin Services. They are not used for any other purpose.",
  },
  {
    n: "04",
    title: "Data Sharing",
    body: "VESTERA does not share your data with third parties. Information exchanged between buyers, sellers and practitioners remains within the transaction to which it relates.",
  },
  {
    n: "05",
    title: "Agreement",
    body: "By using VESTERA, you acknowledge and agree to Pi Network's Privacy Policy, which governs the handling of your Pi identity and related data.",
  },
];

export function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  return (
    <Overlay title="Privacy Policy" onClose={onClose} formal>
      <article className="mx-auto max-w-md px-5 py-6">
        <header className="border-b border-[var(--vst-line)] pb-5 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--vst-ink)] text-[var(--vst-panel)]">
            <IconLock className="h-6 w-6" />
          </span>
          <h1 className="vst-display mt-4 text-2xl font-bold tracking-tight text-[var(--vst-ink)]">
            VESTERA Privacy Policy
          </h1>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[var(--vst-faint-ink)]">
            Effective across the marketplace
          </p>
        </header>

        <p className="pt-6 text-sm leading-relaxed text-[var(--vst-muted-ink)]">
          This policy explains, in plain terms, what VESTERA collects and how your information is handled. VESTERA is
          committed to holding the minimum data necessary to operate a trustworthy property marketplace on Pi Network.
        </p>

        <div className="mt-6 space-y-6">
          {CLAUSES.map((c) => (
            <section key={c.n} className="border-l-2 border-[var(--vst-ink)] pl-4">
              <p className="vst-nums text-xs font-semibold text-[var(--vst-faint-ink)]">{c.n}</p>
              <h2 className="vst-display mt-1 text-base font-semibold text-[var(--vst-ink)]">{c.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--vst-ink)]">{c.body}</p>
            </section>
          ))}
        </div>

        <footer className="mt-8 flex items-center gap-2 rounded-xl border border-[var(--vst-line)] bg-[var(--vst-panel)] px-4 py-3">
          <IconShieldCheck className="h-5 w-5 text-[var(--vst-accent)]" />
          <p className="text-xs leading-relaxed text-[var(--vst-muted-ink)]">
            All users are Pi KYC verified. Trust signals are displayed throughout the app at every transaction
            touchpoint.
          </p>
        </footer>
      </article>
    </Overlay>
  );
}
