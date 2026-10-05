"use client";

import { useState } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  formatPi,
  LISTING_STATUS_META,
  PROPERTY_TYPE_MAP,
  type Listing,
  type ListingStatus,
} from "@/lib/vestera/data";
import {
  Button,
  Card,
  cx,
  Eyebrow,
  IconEdit,
  IconPlus,
  IconTrash,
} from "./ui";
import { ConfirmButton, PropertyArt, StatusPill } from "./pieces";
import { EmptyState } from "./ui";
import { useNav } from "./nav";

const STATUS_ORDER: ListingStatus[] = ["available", "under_offer", "sold"];

export function SellScreen() {
  const { myListings, receivedInspections } = useVestera();
  const nav = useNav();

  const active = myListings.filter((l) => l.status !== "sold").length;

  return (
    <div className="vst-app-bg min-h-full pb-28">
      <header className="vst-safe-top px-4 pt-4">
        <h1 className="vst-display text-2xl font-bold text-[var(--vst-ink)]">My Listings</h1>
        <p className="text-sm text-[var(--vst-muted-ink)]">Publish and manage properties under your Pi account.</p>
      </header>

      <section className="px-4 pt-4">
        <Button variant="primary" className="w-full" onClick={nav.newListing}>
          <IconPlus className="h-5 w-5" /> List a property
        </Button>
      </section>

      <section className="grid grid-cols-3 gap-3 px-4 pt-4">
        <Stat label="Listings" value={String(myListings.length)} />
        <Stat label="Active" value={String(active)} />
        <Stat label="Inspections" value={String(receivedInspections.length)} />
      </section>

      <section className="px-4 pt-5">
        <Eyebrow className="mb-3">Your portfolio</Eyebrow>
        {myListings.length === 0 ? (
          <EmptyState
            icon={<IconPlus className="h-6 w-6" />}
            title="No listings yet"
            body="List your first property to get a VESTERA reference code and publish to the marketplace."
            action={
              <Button variant="primary" onClick={nav.newListing}>
                <IconPlus className="h-4 w-4" /> Create listing
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {myListings.map((l) => (
              <ManageRow key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-3 text-center">
      <p className="vst-display text-xl font-bold text-[var(--vst-ink)]">{value}</p>
      <p className="text-[11px] font-medium text-[var(--vst-muted-ink)]">{label}</p>
    </Card>
  );
}

function ManageRow({ listing }: { listing: Listing }) {
  const { setListingStatus, deleteListing } = useVestera();
  const nav = useNav();
  const [statusOpen, setStatusOpen] = useState(false);
  const meta = PROPERTY_TYPE_MAP[listing.propertyType];

  return (
    <Card className="overflow-hidden">
      <button className="flex w-full items-stretch gap-3 p-3 text-left" onClick={() => nav.openListing(listing.id)}>
        <PropertyArt photo={listing.photos[0]} type={listing.propertyType} className="h-20 w-24 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--vst-accent-deep)]">
              {meta.short} · {listing.code}
            </p>
            <p className="vst-clamp-1 text-sm font-semibold text-[var(--vst-ink)]">{listing.title}</p>
          </div>
          <div className="flex items-center justify-between">
            <span className="vst-display text-sm font-bold text-[var(--vst-ink)]">{formatPi(listing.priceInPi)}</span>
            <StatusPill status={listing.status} />
          </div>
        </div>
      </button>

      <div className="flex items-center gap-2 border-t border-[var(--vst-line-soft)] p-2.5">
        <Button variant="outline" className="flex-1 py-2 text-xs" onClick={() => nav.editListing(listing.id)}>
          <IconEdit className="h-4 w-4" /> Edit
        </Button>
        <Button variant="outline" className="flex-1 py-2 text-xs" onClick={() => setStatusOpen((v) => !v)}>
          Status
        </Button>
        <ConfirmButton
          className="flex-1 py-2 text-xs"
          label={
            <span className="flex items-center gap-1">
              <IconTrash className="h-4 w-4" /> Remove
            </span>
          }
          confirmLabel="Confirm remove"
          onConfirm={() => deleteListing(listing.id)}
        />
      </div>

      {statusOpen ? (
        <div className="flex gap-2 border-t border-[var(--vst-line-soft)] p-2.5">
          {STATUS_ORDER.map((s) => {
            const m = LISTING_STATUS_META[s];
            const on = listing.status === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setListingStatus(listing.id, s);
                  setStatusOpen(false);
                }}
                className={cx(
                  "vst-press flex-1 rounded-lg px-2 py-2 text-xs font-semibold",
                  on ? "text-[var(--vst-panel)]" : "text-[var(--vst-muted-ink)]",
                )}
                style={on ? { backgroundColor: `var(${m.varName})` } : { backgroundColor: `var(${m.softVar})` }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </Card>
  );
}
