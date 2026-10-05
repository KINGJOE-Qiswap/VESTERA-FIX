"use client";

import { formatPi, PROPERTY_TYPE_MAP, type Listing } from "@/lib/vestera/data";
import { IconBed, IconPin, IconRuler, KycBadge, PiMark, Pill } from "./ui";
import { PropertyArt, StatusPill } from "./pieces";
import { useNav } from "./nav";

export function PropertyCard({ listing }: { listing: Listing }) {
  const nav = useNav();
  const meta = PROPERTY_TYPE_MAP[listing.propertyType];
  return (
    <button
      onClick={() => nav.openListing(listing.id)}
      className="vst-press group flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)] text-left"
    >
      <div className="relative">
        <PropertyArt photo={listing.photos[0]} type={listing.propertyType} rounded="rounded-none" className="aspect-[16/10] w-full" />
        <div className="absolute left-3 top-3">
          <StatusPill status={listing.status} />
        </div>
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/45 px-2.5 py-1 backdrop-blur-sm">
          <span className="flex items-center gap-1 text-sm font-bold text-white">
            {formatPi(listing.priceInPi)}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide text-white/80">at GCV</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--vst-accent-deep)]">
            {meta.short}
          </span>
          <span className="text-[11px] text-[var(--vst-faint-ink)]">· {listing.code}</span>
          {listing.isVerifiedAgent ? <Pill tone="avail">Verified Agent</Pill> : null}
        </div>
        <h3 className="vst-display vst-clamp-2 text-[15px] font-semibold leading-snug text-[var(--vst-ink)]">
          {listing.title}
        </h3>
        <p className="flex items-center gap-1 text-xs text-[var(--vst-muted-ink)]">
          <IconPin className="h-3.5 w-3.5 shrink-0" />
          <span className="vst-clamp-1">{listing.location || "Location on request"}</span>
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-[var(--vst-muted-ink)]">
          <span className="flex items-center gap-1">
            <IconRuler className="h-3.5 w-3.5" />
            <span className="vst-clamp-1">{listing.sizeLabel || "—"}</span>
          </span>
          {meta.showBedrooms && listing.bedrooms > 0 ? (
            <span className="flex items-center gap-1">
              <IconBed className="h-3.5 w-3.5" />
              {listing.bedrooms} bed
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-[var(--vst-line-soft)] pt-2.5">
          <span className="flex items-center gap-1 truncate text-xs font-medium text-[var(--vst-ink)]">
            {listing.ownerName}
          </span>
          {listing.ownerVerified ? <KycBadge /> : null}
        </div>
      </div>
    </button>
  );
}
