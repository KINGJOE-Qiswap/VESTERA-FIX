"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  PROPERTY_TYPES,
  type Listing,
  type PropertyType,
} from "@/lib/vestera/data";
import {
  cx,
  Eyebrow,
  IconArrowRight,
  IconScale,
  KycBadge,
  PropertyTypeIcon,
  VesteraLogo,
} from "./ui";
import { PropertyCard } from "./property-card";
import { useNav } from "./nav";

export function BrowseScreen() {
  const { allListings, setTab } = useVestera();
  const nav = useNav();
  const [filter, setFilter] = useState<PropertyType | "all">("all");

  const listings = useMemo(() => {
    const base = filter === "all" ? allListings : allListings.filter((l) => l.propertyType === filter);
    // available first, then under-offer, then sold
    const rank = (l: Listing) => (l.status === "available" ? 0 : l.status === "under_offer" ? 1 : 2);
    return [...base].sort((a, b) => rank(a) - rank(b) || b.createdAt - a.createdAt);
  }, [allListings, filter]);

  return (
    <div className="vst-app-bg min-h-full pb-28">
      <header className="vst-safe-top px-4 pt-4">
        <div className="flex items-center gap-3">
          <VesteraLogo />
          <div className="flex-1">
            <h1 className="vst-display text-xl font-bold leading-none text-[var(--vst-ink)]">VESTERA</h1>
            <p className="text-[11px] font-medium text-[var(--vst-muted-ink)]">Property, priced in Pi at GCV</p>
          </div>
          <KycBadge label="Pi Verified" />
        </div>
      </header>

      <section className="px-4 pt-4">
        <button
          onClick={() => nav.openServices(null)}
          className="vst-press flex w-full items-center gap-3 overflow-hidden rounded-2xl vst-hero-grad p-4 text-left text-[var(--vst-on-hero)]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <IconScale className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="text-[15px] font-bold">VESTERA Admin Services</p>
            <p className="text-xs text-[var(--vst-on-hero-soft)]">
              Approved legal practitioners for due diligence, deeds & transfers.
            </p>
          </div>
          <IconArrowRight className="h-5 w-5" />
        </button>
      </section>

      <section className="px-4 pt-4"><div className="mb-2 flex items-center justify-between"><Eyebrow>Nigeria MAT</Eyebrow><button onClick={() => setTab("nigeria")} className="text-xs font-semibold text-[var(--vst-accent-deep)]">View all</button></div><div className="grid grid-cols-3 gap-2">{["LAGOS MAT", "ABUJA MAT", "EASTERN MAT"].map((label) => <button key={label} onClick={() => setTab("nigeria")} className="vst-press rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)] p-3 text-left"><span className="block text-[11px] font-bold text-[var(--vst-accent-deep)]">{label}</span><span className="mt-1 block text-[10px] text-[var(--vst-muted-ink)]">Explore verified titles</span></button>)}</div></section>

      <section className="pt-4">
        <div className="vst-no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All properties
          </Chip>
          {PROPERTY_TYPES.map((t) => (
            <Chip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)} type={t.id}>
              {t.short}
            </Chip>
          ))}
        </div>
      </section>

      <section className="px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <Eyebrow>{filter === "all" ? "Featured listings" : "Filtered"}</Eyebrow>
          <span className="text-xs text-[var(--vst-faint-ink)]">{listings.length} results</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {listings.map((l, i) => (
            <div key={l.id} className="vst-fade-up" style={{ animationDelay: `${Math.min(i, 6) * 0.03}s` }}>
              <PropertyCard listing={l} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
  type,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  type?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "vst-press flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold",
        active
          ? "border-transparent bg-[var(--vst-ink)] text-[var(--vst-panel)]"
          : "border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-muted-ink)]",
      )}
    >
      {type ? <PropertyTypeIcon type={type} className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}
