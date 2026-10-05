"use client";

import { useState, type ReactNode } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  INSPECTION_STATUS_META,
  relativeTime,
  SERVICE_STATUS_META,
  type InspectionRequest,
  type ServiceRequest,
} from "@/lib/vestera/data";
import {
  Button,
  Card,
  cx,
  Eyebrow,
  Field,
  IconArrowRight,
  IconChat,
  IconCheck,
  IconEdit,
  IconEye,
  IconLock,
  IconScale,
  IconShieldCheck,
  KycBadge,
  TextInput,
} from "./ui";
import { EmptyState } from "./ui";
import { Sheet } from "./pieces";
import { WalletConnectionButton } from "./pi-payment-button";
import { useNav } from "./nav";

export function AccountScreen() {
  const {
    name,
    email,
    myListings,
    sentInspections,
    receivedInspections,
    serviceRequests,
    chats,
    setTab,
    now,
  } = useVestera();
  const nav = useNav();
  const [editOpen, setEditOpen] = useState(false);
  const [inspTab, setInspTab] = useState<"sent" | "received">("sent");

  const displayName = name.trim() || "Pi Pioneer";
  const inspections = inspTab === "sent" ? sentInspections : receivedInspections;

  return (
    <div className="vst-app-bg min-h-full pb-28">
      <header className="vst-safe-top px-4 pt-4">
        <div className="overflow-hidden rounded-2xl vst-hero-grad p-5 text-[var(--vst-on-hero)]">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="vst-display truncate text-xl font-bold">{displayName}</p>
              <p className="truncate text-xs text-[var(--vst-on-hero-soft)]">{email || "No email added"}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold">
                <IconShieldCheck className="h-3.5 w-3.5" /> Pi KYC Verified
              </span>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="vst-press flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
              aria-label="Edit profile"
            >
              <IconEdit className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3 px-4 pt-4">
        <Stat label="Listings" value={String(myListings.length)} onClick={() => setTab("sell")} />
        <Stat label="Requests" value={String(serviceRequests.length)} />
        <Stat label="Chats" value={String(chats.length)} onClick={() => setTab("chat")} />
      </section>

      <section className="px-4 pt-4"><Card className="space-y-2 p-4"><Eyebrow>Pi Wallet</Eyebrow><p className="text-xs text-[var(--vst-muted-ink)]">Connect your wallet for Nigeria mat payments.</p><WalletConnectionButton /></Card></section>

      <section className="grid grid-cols-1 gap-2.5 px-4 pt-4">
        <LinkRow icon={<IconEdit className="h-5 w-5" />} label="My Listings" hint="Manage your properties" onClick={() => setTab("sell")} />
        <LinkRow icon={<IconScale className="h-5 w-5" />} label="VESTERA Admin Services" hint="Legal transaction support" onClick={() => nav.openServices(null)} />
        <LinkRow icon={<IconShieldCheck className="h-5 w-5" />} label="Legal Network Directory" hint="Approved practitioners" onClick={nav.openLegal} />
        <LinkRow icon={<IconChat className="h-5 w-5" />} label="Chat threads" hint="Secure messaging" onClick={() => setTab("chat")} />
        <LinkRow icon={<IconScale className="h-5 w-5" />} label="My Escrow" hint="Buyer and seller payment records" onClick={() => setTab("escrow")} />
        <LinkRow icon={<IconEye className="h-5 w-5" />} label="Nigeria MAT" hint="Lagos, Abuja, Eastern and other states" onClick={() => setTab("nigeria")} />
        <LinkRow icon={<IconShieldCheck className="h-5 w-5" />} label="Agent Dashboard" hint="Manage verified-agent listings" onClick={() => setTab("agent")} />
        <LinkRow icon={<IconLock className="h-5 w-5" />} label="Privacy Policy" hint="How your data is handled" onClick={nav.openPrivacy} />
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <Eyebrow>Inspection requests</Eyebrow>
          <div className="flex rounded-lg bg-[var(--vst-panel-2)] p-0.5">
            {(["sent", "received"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setInspTab(t)}
                className={cx(
                  "vst-press rounded-md px-3 py-1 text-xs font-semibold capitalize",
                  inspTab === t ? "bg-[var(--vst-panel)] text-[var(--vst-ink)] shadow-sm" : "text-[var(--vst-muted-ink)]",
                )}
              >
                {t} ({t === "sent" ? sentInspections.length : receivedInspections.length})
              </button>
            ))}
          </div>
        </div>
        {inspections.length === 0 ? (
          <EmptyState icon={<IconEye className="h-6 w-6" />} title={`No ${inspTab} requests`} />
        ) : (
          <div className="space-y-2">
            {inspections.map((r) => (
              <InspectionRow key={r.id} req={r} now={now} />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 pt-6">
        <Eyebrow className="mb-3">Service requests</Eyebrow>
        {serviceRequests.length === 0 ? (
          <EmptyState icon={<IconScale className="h-6 w-6" />} title="No service requests" body="Request VESTERA Admin Services from any listing." />
        ) : (
          <div className="space-y-2">
            {serviceRequests.map((r) => (
              <ServiceRow key={r.id} req={r} now={now} />
            ))}
          </div>
        )}
      </section>

      {editOpen ? <EditProfileSheet onClose={() => setEditOpen(false)} /> : null}
    </div>
  );
}

function Stat({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <Card className={cx("p-3 text-center", onClick && "vst-press cursor-pointer")} onClick={onClick}>
      <p className="vst-display text-xl font-bold text-[var(--vst-ink)]">{value}</p>
      <p className="text-[11px] font-medium text-[var(--vst-muted-ink)]">{label}</p>
    </Card>
  );
}

function LinkRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="vst-press flex w-full items-center gap-3 rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)] p-3.5 text-left"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vst-accent-soft)] text-[var(--vst-accent-deep)]">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-[var(--vst-ink)]">{label}</p>
        <p className="text-xs text-[var(--vst-muted-ink)]">{hint}</p>
      </div>
      <IconArrowRight className="h-5 w-5 text-[var(--vst-faint-ink)]" />
    </button>
  );
}

function InspectionRow({ req, now }: { req: InspectionRequest; now: number }) {
  const meta = INSPECTION_STATUS_META[req.status];
  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="vst-clamp-1 text-sm font-semibold text-[var(--vst-ink)]">{req.listingTitle}</p>
          <p className="vst-nums text-[11px] text-[var(--vst-faint-ink)]">{req.listingCode}</p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `var(${meta.softVar})`, color: `var(${meta.varName})` }}
        >
          {meta.label}
        </span>
      </div>
      {req.note ? <p className="vst-pre mt-1.5 text-xs text-[var(--vst-muted-ink)]">{req.note}</p> : null}
      <p className="mt-1.5 text-[11px] text-[var(--vst-faint-ink)]">
        {req.direction === "sent" ? "Requested" : "Received"} · {relativeTime(req.createdAt, now)}
      </p>
    </Card>
  );
}

function ServiceRow({ req, now }: { req: ServiceRequest; now: number }) {
  const meta = SERVICE_STATUS_META[req.status];
  return (
    <Card className="p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--vst-ink)]">{req.serviceName}</p>
          {req.listingTitle ? <p className="vst-clamp-1 text-xs text-[var(--vst-muted-ink)]">{req.listingTitle}</p> : null}
          {req.practitionerName ? (
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--vst-accent-deep)]">
              <IconShieldCheck className="h-3.5 w-3.5" /> {req.practitionerName}
            </p>
          ) : null}
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ backgroundColor: `var(${meta.softVar})`, color: `var(${meta.varName})` }}
        >
          {meta.label}
        </span>
      </div>
      {req.note ? <p className="vst-pre mt-1.5 text-xs text-[var(--vst-muted-ink)]">{req.note}</p> : null}
      <p className="mt-1.5 text-[11px] text-[var(--vst-faint-ink)]">Requested · {relativeTime(req.createdAt, now)}</p>
    </Card>
  );
}

function EditProfileSheet({ onClose }: { onClose: () => void }) {
  const { name, email, setProfile } = useVestera();
  const [n, setN] = useState(name);
  const [e, setE] = useState(email);
  return (
    <Sheet title="Edit profile" onClose={onClose}>
      <div className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--vst-accent-soft)] px-3 py-2">
        <KycBadge />
        <span className="text-xs text-[var(--vst-accent-deep)]">Your Pi identity is verified.</span>
      </div>
      <div className="space-y-3">
        <Field label="Display name" hint="Shown on your listings and in chat">
          <TextInput value={n} onChange={(ev) => setN(ev.target.value)} placeholder="Your name" maxLength={120} />
        </Field>
        <Field label="Email" hint="Secondary verification channel for account security">
          <TextInput value={e} onChange={(ev) => setE(ev.target.value)} placeholder="you@example.com" inputMode="email" maxLength={120} />
        </Field>
      </div>
      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => {
          setProfile(n, e);
          onClose();
        }}
      >
        <IconCheck className="h-4 w-4" /> Save profile
      </Button>
    </Sheet>
  );
}
