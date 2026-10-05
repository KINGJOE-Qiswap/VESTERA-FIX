"use client";

import { useMemo, useState } from "react";
import { useVestera } from "@/contexts/vestera-context";
import {
  fold,
  formatPi,
  matchesQuery,
  PROPERTY_TYPES,
  type PropertyType,
} from "@/lib/vestera/data";
import {
  Button,
  cx,
  Eyebrow,
  IconClose,
  IconSearch,
  PropertyTypeIcon,
  TextInput,
} from "./ui";
import { PropertyCard } from "./property-card";
import { EmptyState } from "./ui";

export function SearchScreen() {
  const { allListings } = useVestera();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [types, setTypes] = useState<Set<PropertyType>>(new Set());
  const [minPi, setMinPi] = useState("");
  const [maxPi, setMaxPi] = useState("");

  const toggleType = (t: PropertyType) => {
    setTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const results = useMemo(() => {
    const min = Number(minPi) || 0;
    const max = Number(maxPi) || Infinity;
    const loc = fold(location.trim());
    return allListings.filter((l) => {
      if (!matchesQuery(l, query)) return false;
      if (types.size > 0 && !types.has(l.propertyType)) return false;
      if (loc && !fold(l.location).includes(loc)) return false;
      if (l.priceInPi < min || l.priceInPi > max) return false;
      return true;
    });
  }, [allListings, query, types, location, minPi, maxPi]);

  const activeFilters = types.size + (location.trim() ? 1 : 0) + (minPi ? 1 : 0) + (maxPi ? 1 : 0);
  const clearAll = () => {
    setQuery("");
    setLocation("");
    setTypes(new Set());
    setMinPi("");
    setMaxPi("");
  };

  return (
    <div className="vst-app-bg min-h-full pb-28">
      <header className="vst-safe-top px-4 pt-4">
        <h1 className="vst-display text-2xl font-bold text-[var(--vst-ink)]">Search</h1>
        <p className="text-sm text-[var(--vst-muted-ink)]">Filter by location, price in Pi, and property type.</p>
      </header>

      <section className="px-4 pt-4">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--vst-faint-ink)]" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keyword, code or title"
            className="pl-11"
            inputMode="search"
          />
        </div>
      </section>

      <section className="px-4 pt-4">
        <Eyebrow className="mb-2">Property type</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => {
            const on = types.has(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={cx(
                  "vst-press flex items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-semibold",
                  on
                    ? "border-transparent bg-[var(--vst-accent)] text-[var(--vst-on-hero)]"
                    : "border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-muted-ink)]",
                )}
              >
                <PropertyTypeIcon type={t.id} className="h-4 w-4" />
                {t.short}
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 px-4 pt-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Location</span>
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or area" />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Min price (π)</span>
            <TextInput
              value={minPi}
              onChange={(e) => setMinPi(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              inputMode="decimal"
              className="vst-nums"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Max price (π)</span>
            <TextInput
              value={maxPi}
              onChange={(e) => setMaxPi(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="Any"
              inputMode="decimal"
              className="vst-nums"
            />
          </label>
        </div>
      </section>

      <section className="flex items-center justify-between px-4 pt-4">
        <span className="text-sm font-semibold text-[var(--vst-ink)]">
          {results.length} {results.length === 1 ? "match" : "matches"}
        </span>
        {activeFilters > 0 ? (
          <Button variant="ghost" className="px-2 py-1 text-[var(--vst-muted-ink)]" onClick={clearAll}>
            <IconClose className="h-4 w-4" />
            Clear filters
          </Button>
        ) : null}
      </section>

      <section className="px-4 pt-2">
        {results.length === 0 ? (
          <EmptyState
            icon={<IconSearch className="h-6 w-6" />}
            title="No properties match"
            body="Try widening the price range or removing a filter."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
