"use client";

import { useMemo, useState } from "react";
import { useVestera } from "@/contexts/vestera-context";
import { NIGERIA_REGIONS, TITLE_TYPES, type NigeriaRegion } from "@/lib/vestera/data";
import { Button, Card, IconBack, Pill, TextInput } from "./ui";
import { PropertyCard } from "./property-card";

export function NigeriaMatScreen() {
  const { allListings, savedSearches, saveSearch, deleteSavedSearch, setTab } = useVestera();
  const [region, setRegion] = useState<NigeriaRegion>("lagos");
  const [state, setState] = useState("");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [titleType, setTitleType] = useState("Any title");
  const [saveName, setSaveName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const meta = NIGERIA_REGIONS.find((r) => r.id === region)!;
  const listings = useMemo(() => allListings.filter((l) => {
    const regionMatch = l.region === region || (!l.region && region === "lagos" && /lagos/i.test(l.location));
    const searchMatch = !query || `${l.title} ${l.location} ${l.code}`.toLowerCase().includes(query.toLowerCase());
    return regionMatch && (!state || l.state === state || l.location.includes(state)) && searchMatch && (!minPrice || l.priceInPi >= Number(minPrice)) && (!maxPrice || l.priceInPi <= Number(maxPrice)) && (!bedrooms || l.bedrooms >= Number(bedrooms)) && (titleType === "Any title" || l.titleType === titleType);
  }), [allListings, region, state, query, minPrice, maxPrice, bedrooms, titleType]);
  const activeFilterCount = [state, minPrice, maxPrice, bedrooms, titleType !== "Any title" ? titleType : ""].filter(Boolean).length;
  const saveLabel = saveName.trim() || `${meta.label.replace(" MAT", "")} ${bedrooms || "all"}bed${maxPrice ? ` under ${maxPrice} Pi` : ""}`;
  const resetFilters = () => { setState(""); setMinPrice(""); setMaxPrice(""); setBedrooms(""); setTitleType("Any title"); setQuery(""); };

  return <section className="space-y-4 p-4 pb-24">
    <div className="flex items-center gap-2">
      <button onClick={() => setTab("browse")} className="vst-press flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--vst-panel)] text-[var(--vst-ink)]" aria-label="Back to home">
        <IconBack className="h-5 w-5" />
      </button>
      <div><p className="vst-eyebrow">Nigeria property assurance</p><h1 className="vst-display text-3xl font-bold text-[var(--vst-ink)]">Nigeria MAT</h1></div>
    </div>
    <Card className="border-[var(--vst-accent)] bg-[var(--vst-accent-soft)] p-5 text-center"><p className="vst-display text-xl font-bold text-[var(--vst-accent-deep)]">MAT Listings Coming Soon</p><p className="mt-1 text-sm text-[var(--vst-muted-ink)]">Nigeria MAT listings will appear here when the marketplace opens.</p></Card><p className="mt-1 text-sm text-[var(--vst-muted-ink)]">Search verified titles across Nigeria with filters built for diaspora buyers.</p></div>
    <div className="grid grid-cols-2 gap-2">{NIGERIA_REGIONS.map((r) => <button key={r.id} onClick={() => { setRegion(r.id); setState(""); }} className={`rounded-2xl border p-3 text-left text-xs font-bold ${region === r.id ? "border-[var(--vst-accent)] bg-[var(--vst-accent-soft)] text-[var(--vst-accent-deep)]" : "border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-muted-ink)]"}`}>{r.label}<span className="mt-1 block text-[10px] font-normal">{r.states.length} states</span></button>)}</div>
    <Card className="space-y-3 p-3"><div className="flex items-center justify-between"><p className="text-sm font-bold text-[var(--vst-ink)]">Filter {meta.label}</p><button onClick={resetFilters} className="text-xs font-semibold text-[var(--vst-accent-deep)]">Reset</button></div><TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search location, title or code" /><div className="grid grid-cols-2 gap-2"><label className="text-xs text-[var(--vst-muted-ink)]">State<select value={state} onChange={(e) => setState(e.target.value)} className="vst-input mt-1 w-full"><option value="">All states</option>{meta.states.map((s) => <option key={s}>{s}</option>)}</select></label><label className="text-xs text-[var(--vst-muted-ink)]">Bedrooms<select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="vst-input mt-1 w-full"><option value="">Any</option>{[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}+ bedrooms</option>)}</select></label><label className="text-xs text-[var(--vst-muted-ink)]">Min Price Pi<input value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" placeholder="0" className="vst-input mt-1 w-full" /></label><label className="text-xs text-[var(--vst-muted-ink)]">Max Price Pi<input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" placeholder="Any" className="vst-input mt-1 w-full" /></label></div><label className="text-xs text-[var(--vst-muted-ink)]">Title Type<select value={titleType} onChange={(e) => setTitleType(e.target.value)} className="vst-input mt-1 w-full">{TITLE_TYPES.map((t) => <option key={t}>{t}</option>)}</select></label><div className="flex items-center justify-between"><Pill tone="accent">{listings.length} properties · {activeFilterCount} filters</Pill><span className="text-xs text-[var(--vst-muted-ink)]">Pi GCV pricing</span></div></Card>
    <PiPaymentCard purpose="checkout" />
    <Card className="space-y-2 border-[var(--vst-gold)] bg-[var(--vst-gold-soft)] p-3"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-[var(--vst-ink)]">Save this search</p><p className="text-xs text-[var(--vst-muted-ink)]">Keep this filter ready for your next visit.</p></div><Button variant="gold" className="px-3 py-2" onClick={() => setShowSaved((v) => !v)}>{showSaved ? "Close" : "Save Search"}</Button></div>{showSaved ? <div className="flex gap-2"><TextInput value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder={saveLabel} /><Button variant="primary" className="shrink-0 px-3 py-2" onClick={() => { saveSearch({ name: saveLabel, region, state, minPrice: Number(minPrice) || 0, maxPrice: Number(maxPrice) || 0, bedrooms: Number(bedrooms) || 0, titleType }); setSaveName(""); }}>Save</Button></div> : null}</Card>
    {savedSearches.length ? <Card className="space-y-2 p-3"><p className="text-sm font-bold text-[var(--vst-ink)]">Saved searches</p>{savedSearches.map((s) => <div key={s.id} className="flex items-center justify-between gap-2 border-t border-[var(--vst-line)] pt-2"><button className="min-w-0 text-left" onClick={() => { setRegion(s.region); setState(s.state); setMinPrice(s.minPrice ? String(s.minPrice) : ""); setMaxPrice(s.maxPrice ? String(s.maxPrice) : ""); setBedrooms(s.bedrooms ? String(s.bedrooms) : ""); setTitleType(s.titleType); }}><span className="block truncate text-xs font-semibold text-[var(--vst-ink)]">{s.name}</span><span className="text-[10px] text-[var(--vst-muted-ink)]">{s.state || "All states"} · {s.titleType}</span></button><button onClick={() => deleteSavedSearch(s.id)} className="text-[11px] font-semibold text-[var(--vst-sold)]">Remove</button></div>)}</Card> : null}
    <div className="space-y-3">{listings.map((l) => <PropertyCard key={l.id} listing={l} />)}{!listings.length ? <Card className="p-6 text-center text-sm text-[var(--vst-muted-ink)]">No listings match these filters yet.</Card> : null}</div>
  </section>;
}
