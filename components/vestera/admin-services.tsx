"use client";

import { useMemo, useState, type ComponentType } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  ADMIN_SERVICES,
  type Listing,
  type Practitioner,
  type ServiceDef,
} from "@/lib/vestera/data";
import {
  Button,
  Card,
  Eyebrow,
  IconArrowRight,
  IconCheck,
  IconDoc,
  IconHandshake,
  IconScale,
  IconShieldCheck,
  IconStamp,
  KycBadge,
  Select,
  TextArea,
} from "./ui";
import { Overlay, Sheet } from "./pieces";
import { useNav } from "./nav";

const SERVICE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  due_diligence: IconShieldCheck,
  coordination: IconHandshake,
  deeds: IconDoc,
  endorsements: IconStamp,
  mediation: IconScale,
};

export function AdminServices({ listing, onClose }: { listing: Listing | null; onClose: () => void }) {
  const nav = useNav();
  const [picked, setPicked] = useState<ServiceDef | null>(null);

  return (
    <Overlay title="VESTERA Admin Services" onClose={onClose}>
      <div className="space-y-5 p-4">
        <Card className="overflow-hidden">
          <div className="vst-hero-grad p-4 text-[var(--vst-on-hero)]">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <IconScale className="h-6 w-6" />
            </span>
            <h2 className="vst-display mt-3 text-lg font-bold">End-to-end transaction support</h2>
            <p className="mt-1 text-sm text-[var(--vst-on-hero-soft)]">
              Approved legal practitioners with property expertise guide your transaction from due diligence to
              document issuance.
            </p>
          </div>
          {listing ? (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <Eyebrow>For property</Eyebrow>
                <p className="vst-clamp-1 text-sm font-semibold text-[var(--vst-ink)]">{listing.title}</p>
              </div>
              <span className="vst-nums shrink-0 text-xs text-[var(--vst-muted-ink)]">{listing.code}</span>
            </div>
          ) : null}
        </Card>

        <div className="space-y-3">
          {ADMIN_SERVICES.map((svc) => {
            const Icon = SERVICE_ICON[svc.id] ?? IconScale;
            return (
              <Card key={svc.id} className="flex items-start gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--vst-accent-soft)] text-[var(--vst-accent-deep)]">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--vst-ink)]">{svc.name}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--vst-muted-ink)]">{svc.blurb}</p>
                  <Button
                    variant="outline"
                    className="mt-3 py-2 text-xs"
                    onClick={() => setPicked(svc)}
                  >
                    Request service <IconArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <button
          onClick={nav.openLegal}
          className="vst-press flex w-full items-center gap-3 rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)] p-4 text-left"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vst-panel-2)] text-[var(--vst-ink)]">
            <IconScale className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--vst-ink)]">VESTERA Legal Network</p>
            <p className="text-xs text-[var(--vst-muted-ink)]">Browse approved practitioners & law firms.</p>
          </div>
          <IconArrowRight className="h-5 w-5 text-[var(--vst-faint-ink)]" />
        </button>
      </div>

      {picked ? (
        <RequestServiceSheet service={picked} listing={listing} onClose={() => setPicked(null)} onDone={() => setPicked(null)} />
      ) : null}
    </Overlay>
  );
}

function RequestServiceSheet({
  service,
  listing,
  onClose,
  onDone,
}: {
  service: ServiceDef;
  listing: Listing | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const { practitioners, requestService } = useVestera();
  const [note, setNote] = useState("");
  const [practitionerId, setPractitionerId] = useState("");

  const approved = useMemo(() => practitioners.filter((p) => p.approval === "approved"), [practitioners]);
  const chosen: Practitioner | null = approved.find((p) => p.id === practitionerId) ?? null;

  return (
    <Sheet title={service.name} onClose={onClose}>
      <p className="mb-3 text-sm leading-relaxed text-[var(--vst-muted-ink)]">{service.blurb}</p>

      <div className="mb-3 flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Preferred practitioner (optional)</span>
        <Select value={practitionerId} onChange={(e) => setPractitionerId(e.target.value)}>
          <option value="">No preference — assign for me</option>
          {approved.map((p) => (
            <option key={p.id} value={p.id}>
              {p.piUsername} · {p.lawFirm}
            </option>
          ))}
        </Select>
      </div>

      {chosen ? (
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-[var(--vst-accent-soft)] px-3 py-2">
          <KycBadge label="Approved" />
          <span className="text-xs text-[var(--vst-accent-deep)]">{chosen.location}</span>
        </div>
      ) : null}

      <TextArea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Describe your request (optional)"
        maxLength={600}
      />

      <Button
        variant="primary"
        className="mt-4 w-full"
        onClick={() => {
          requestService(listing, service.id, chosen, note);
          onDone();
        }}
      >
        <IconCheck className="h-4 w-4" /> Submit request
      </Button>
      <p className="mt-2 text-center text-[11px] text-[var(--vst-faint-ink)]">
        Your request is tracked in your account. No payment is charged in this build.
      </p>
    </Sheet>
  );
}
