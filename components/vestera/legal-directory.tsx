"use client";

import { useMemo, useState } from "react";
import { useVestera, type PractitionerInput } from "@/contexts/vestera-context";
import { ADMIN_SERVICES, type Practitioner } from "@/lib/vestera/data";
import {
  Button,
  Card,
  cx,
  Eyebrow,
  Field,
  IconCheck,
  IconLock,
  IconPin,
  IconPlus,
  IconScale,
  IconShieldCheck,
  Pill,
  TextInput,
} from "./ui";
import { Overlay, Sheet } from "./pieces";

export function LegalDirectory({ onClose }: { onClose: () => void }) {
  const { practitioners } = useVestera();
  const [registerOpen, setRegisterOpen] = useState(false);

  const approved = useMemo(() => practitioners.filter((p) => p.approval === "approved"), [practitioners]);
  const pending = useMemo(() => practitioners.filter((p) => p.approval === "pending"), [practitioners]);

  return (
    <Overlay
      title="VESTERA Legal Network"
      onClose={onClose}
      footer={
        <Button variant="primary" className="w-full" onClick={() => setRegisterOpen(true)}>
          <IconPlus className="h-4 w-4" /> Register as a practitioner
        </Button>
      }
    >
      <div className="space-y-5 p-4">
        <Card className="p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vst-accent-soft)] text-[var(--vst-accent-deep)]">
            <IconScale className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm leading-relaxed text-[var(--vst-muted-ink)]">
            A directory of registered legal practitioners with property expertise. Approved practitioners are clearly
            marked so you can engage them with confidence.
          </p>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <Eyebrow>Approved practitioners</Eyebrow>
            <span className="text-xs text-[var(--vst-faint-ink)]">{approved.length}</span>
          </div>
          <div className="space-y-3">
            {approved.map((p) => (
              <PractitionerCard key={p.id} p={p} />
            ))}
          </div>
        </div>

        {pending.length > 0 ? (
          <div>
            <Eyebrow className="mb-3">Pending approval</Eyebrow>
            <div className="space-y-3">
              {pending.map((p) => (
                <PractitionerCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {registerOpen ? <RegisterSheet onClose={() => setRegisterOpen(false)} /> : null}
    </Overlay>
  );
}

function PractitionerCard({ p }: { p: Practitioner }) {
  const approved = p.approval === "approved";
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-[var(--vst-ink)]">
            {p.piUsername}
            {approved ? <IconShieldCheck className="h-4 w-4 text-[var(--vst-accent)]" /> : null}
          </p>
          <p className="text-sm font-medium text-[var(--vst-muted-ink)]">{p.lawFirm}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--vst-faint-ink)]">
            <IconPin className="h-3.5 w-3.5" />
            {p.location}
          </p>
        </div>
        {approved ? <Pill tone="avail">Approved</Pill> : <Pill tone="offer">Pending</Pill>}
      </div>
      {p.specialties.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {p.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[var(--vst-panel-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--vst-muted-ink)]"
            >
              {s}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

function RegisterSheet({ onClose }: { onClose: () => void }) {
  const { registerPractitioner } = useVestera();
  const [username, setUsername] = useState("");
  const [firm, setFirm] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [specs, setSpecs] = useState<Set<string>>(new Set());

  const valid = username.trim() && firm.trim() && location.trim();

  const toggle = (name: string) => {
    setSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const submit = () => {
    if (!valid) return;
    const input: PractitionerInput = {
      piUsername: username,
      lawFirm: firm,
      location,
      email,
      specialties: Array.from(specs),
    };
    registerPractitioner(input);
    onClose();
  };

  return (
    <Sheet title="Practitioner registration" onClose={onClose}>
      <p className="mb-4 flex items-start gap-2 rounded-xl bg-[var(--vst-panel-2)] px-3 py-2.5 text-xs leading-relaxed text-[var(--vst-muted-ink)]">
        <IconLock className="mt-0.5 h-4 w-4 shrink-0" />
        Submit your practice details for review. Your registration is marked pending until VESTERA approval conditions
        are met.
      </p>
      <div className="space-y-3">
        <Field label="Pi username">
          <TextInput value={username} onChange={(e) => setUsername(e.target.value)} placeholder="your_pi_username" maxLength={120} />
        </Field>
        <Field label="Law firm">
          <TextInput value={firm} onChange={(e) => setFirm(e.target.value)} placeholder="Firm or chambers name" maxLength={120} />
        </Field>
        <Field label="Location">
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, country" maxLength={120} />
        </Field>
        <Field label="Email">
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@firm.example" inputMode="email" maxLength={120} />
        </Field>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Areas of expertise</span>
          <div className="flex flex-wrap gap-2">
            {ADMIN_SERVICES.map((s) => {
              const on = specs.has(s.name);
              return (
                <button
                  key={s.id}
                  onClick={() => toggle(s.name)}
                  className={cx(
                    "vst-press rounded-full border px-3 py-1.5 text-xs font-semibold",
                    on
                      ? "border-transparent bg-[var(--vst-accent)] text-[var(--vst-on-hero)]"
                      : "border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-muted-ink)]",
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Button variant="primary" className="mt-4 w-full" onClick={submit} disabled={!valid}>
        <IconCheck className="h-4 w-4" /> Submit registration
      </Button>
    </Sheet>
  );
}
