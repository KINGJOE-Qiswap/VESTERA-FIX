"use client";

import { useState, type ReactNode } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  formatPi,
  PROPERTY_TYPE_MAP,
  propertyTypeLabel,
  type Listing,
} from "@/lib/vestera/data";
import {
  Button,
  Card,
  cx,
  Eyebrow,
  IconBed,
  IconChat,
  IconEdit,
  IconEye,
  IconPin,
  IconRuler,
  IconScale,
  KycBadge,
  PropertyTypeIcon,
  TextArea,
} from "./ui";
import { Gallery, Overlay, Sheet, StatusPill, VerifiedName } from "./pieces";
import { useNav } from "./nav";
import { PiPaymentCard } from "./pi-payment-button";

export function ListingDetail({ listingId, onClose }: { listingId: string; onClose: () => void }) {
  const { getListing, isOwn, requestInspection, openChatForListing, setTab, createEscrow } = useVestera();
  const nav = useNav();
  const listing = getListing(listingId);
  const [inspectOpen, setInspectOpen] = useState(false);

  if (!listing) {
    return (
      <Overlay title="Listing" onClose={onClose}>
        <div className="p-6 text-center text-sm text-[var(--vst-muted-ink)]">This listing is no longer available.</div>
      </Overlay>
    );
  }

  const meta = PROPERTY_TYPE_MAP[listing.propertyType];
  const own = isOwn(listing);

  const message = () => {
    openChatForListing(listing);
    setTab("chat");
    onClose();
  };

  return (
    <Overlay
      title={listing.code}
      onClose={onClose}
      footer={
        own ? (
          <Button variant="primary" className="w-full" onClick={() => nav.editListing(listing.id)}>
            <IconEdit className="h-4 w-4" /> Edit this listing
          </Button>
        ) : (
          <div className="space-y-2">
            <PiPaymentCard purpose="escrow" />
            <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setInspectOpen(true)}>
              <IconEye className="h-4 w-4" /> Inspection
            </Button>
            <Button variant="gold" onClick={() => { createEscrow(listing); setTab("escrow"); onClose(); }}>
              Buy with Pi
            </Button>
            <Button variant="primary" onClick={() => nav.openServices(listing)}>
              <IconScale className="h-4 w-4" /> Admin Service
            </Button>
            </div>
          </div>
        )
      }
    >
      <Gallery photos={listing.photos} type={listing.propertyType} />

      <div className="space-y-5 p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--vst-accent-deep)]">
              <PropertyTypeIcon type={listing.propertyType} className="h-4 w-4" />
              {propertyTypeLabel(listing.propertyType)}
            </span>
            <StatusPill status={listing.status} />
          </div>
          <h1 className="vst-display text-2xl font-bold leading-tight text-[var(--vst-ink)]">{listing.title}</h1>
          <p className="flex items-center gap-1.5 text-sm text-[var(--vst-muted-ink)]">
            <IconPin className="h-4 w-4" />
            {listing.location || "Location provided on request"}
          </p>
        </div>

        <div className="flex items-end justify-between rounded-2xl bg-[var(--vst-gold-soft)] px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[color-mix(in_oklch,var(--vst-gold)_60%,black)]">
              Price at Global Consensus Value
            </p>
            <p className="vst-display text-2xl font-bold text-[var(--vst-ink)]">{formatPi(listing.priceInPi)}</p>
          </div>
          <PropertyTypeIcon type={listing.propertyType} className="h-8 w-8 text-[color-mix(in_oklch,var(--vst-gold)_55%,black)]" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Spec icon={<IconRuler className="h-4 w-4" />} label="Size" value={listing.sizeLabel || "—"} />
          {meta.showBedrooms ? (
            <Spec icon={<IconBed className="h-4 w-4" />} label="Bedrooms" value={listing.bedrooms > 0 ? String(listing.bedrooms) : "—"} />
          ) : (
            <Spec icon={<PropertyTypeIcon type={listing.propertyType} className="h-4 w-4" />} label="Type" value={meta.short} />
          )}
          <Spec icon={<IconPin className="h-4 w-4" />} label="Reference" value={listing.code} mono />
          <Spec icon={<IconEye className="h-4 w-4" />} label="Status" value={PROPERTY_TYPE_MAP[listing.propertyType].short} />
        </div>

        <div>
          <Eyebrow className="mb-2">Description</Eyebrow>
          <p className="vst-pre text-sm leading-relaxed text-[var(--vst-ink)]">{listing.description || "No description provided."}</p>
        </div>

        <Card className="p-4">
          <Eyebrow className="mb-2">Listed by</Eyebrow>
          <div className="flex items-center justify-between">
            <VerifiedName name={listing.ownerName} verified={listing.ownerVerified} className="text-base" />
            {listing.ownerVerified ? <KycBadge /> : null}
          </div>
          {!own ? (
            <Button variant="outline" className="mt-3 w-full" onClick={message}>
              <IconChat className="h-4 w-4" /> Message seller
            </Button>
          ) : (
            <p className="mt-2 text-xs text-[var(--vst-faint-ink)]">This is your listing.</p>
          )}
        </Card>

        <p className="text-center text-[11px] text-[var(--vst-faint-ink)]">
          Inspection requests are logged for follow-up. No payment is charged in this build.
        </p>
      </div>

      {inspectOpen ? (
        <InspectionSheet
          listing={listing}
          onClose={() => setInspectOpen(false)}
          onSubmit={(note) => {
            requestInspection(listing, note);
            setInspectOpen(false);
          }}
        />
      ) : null}
    </Overlay>
  );
}

function Spec({ icon, label, value, mono }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--vst-line)] bg-[var(--vst-panel)] p-3">
      <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--vst-faint-ink)]">
        {icon}
        {label}
      </span>
      <p className={cx("mt-1 text-sm font-semibold text-[var(--vst-ink)]", mono && "vst-nums")}>{value}</p>
    </div>
  );
}

function InspectionSheet({
  listing,
  onClose,
  onSubmit,
}: {
  listing: Listing;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  return (
    <Sheet title="Request inspection" onClose={onClose}>
      <p className="mb-3 text-sm text-[var(--vst-muted-ink)]">
        Send an inspection request for <span className="font-semibold text-[var(--vst-ink)]">{listing.title}</span>. The
        seller will follow up to arrange a viewing.
      </p>
      <TextArea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note — preferred dates, questions, etc. (optional)"
        maxLength={600}
      />
      <Button variant="primary" className="mt-4 w-full" onClick={() => onSubmit(note)}>
        <IconEye className="h-4 w-4" /> Send inspection request
      </Button>
    </Sheet>
  );
}
