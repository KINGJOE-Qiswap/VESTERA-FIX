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

  const listings = useMemo(() => {
    return allListings.filter((l) => {
      const regionMatch = l.region === region;
      const stateMatch = !state || (l.location || "").toLowerCase().includes(state.toLowerCase());
      const queryMatch = !query || `${l.title} ${l.location}`.toLowerCase().includes(query.toLowerCase());
      const minOk = !minPrice || l.pricePi >= Number(minPrice);
      const maxOk = !maxPrice || l.pricePi <= Number(maxPrice);
      const bedOk = !bedrooms || String(l.bedrooms) === bedrooms;
      return regionMatch && stateMatch && queryMatch && minOk && maxOk && bedOk;
    });
  }, [allListings, region, state, query, minPrice, maxPrice, bedrooms]);

  const activeFilterCount = [state, minPrice, maxPrice, bedrooms, titleType !== "Any title" ? "1" : ""].filter(Boolean).length;

  const saveLabel = saveName.trim() || `${meta.label.replace(" MAT", "")} - ${region}`;

  return (
    <section className="space-y-4 p-4 pb-24">
      <div className="flex items-center gap-2">
        <Button onClick={() => setTab("browse")} className="vst-press flex items-center gap-1">
          <IconBack className="h-5 w-5" />
        </Button>
        <div>
          <p className="vst-eyebrow">Nigeria property assurance</p>
          <h1 className="text-xl font-bold">{meta.label}</h1>
        </div>
      </div>

      <Card className="space-y-3 p-3">
        <p className="text-sm font-semibold">Choose region</p>
        <div className="flex flex-wrap gap-2">
          {NIGERIA_REGIONS.map((r) => (
            <Pill key={r.id} active={r.id === region} onClick={() => setRegion(r.id)}>
              {r.label}
            </Pill>
          ))}
        </div>
        <TextInput placeholder="Search title or location..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <TextInput placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
          <TextInput placeholder="Bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
          <TextInput placeholder="Min Pi" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <TextInput placeholder="Max Pi" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          {TITLE_TYPES.map((t) => (
            <Pill key={t} active={titleType === t} onClick={() => setTitleType(t)}>
              {t}
            </Pill>
          ))}
        </div>
        <p className="text-xs opacity-70">{listings.length} listings found • {activeFilterCount} filters active</p>
        <div className="flex gap-2">
          <TextInput placeholder="Save this search as..." value={saveName} onChange={(e) => setSaveName(e.target.value)} />
          <Button onClick={() => { saveSearch({ name: saveLabel, region, state, query, minPrice, maxPrice, bedrooms, titleType }); setSaveName(""); }}>
            Save
          </Button>
        </div>
        <Button onClick={() => setShowSaved(!showSaved)} className="w-full">
          {showSaved ? "Hide saved searches" : `Saved searches (${savedSearches.length})`}
        </Button>
        {showSaved ? (
          <div className="space-y-2">
            {savedSearches.length === 0 ? <p className="text-sm opacity-70">No saved searches yet.</p> : null}
            {savedSearches.map((s: any) => (
              <div key={s.id || s.name} className="flex items-center justify-between gap-2 rounded-lg border p-2">
                <span className="text-sm">{s.name}</span>
                <Button onClick={() => deleteSavedSearch(s.id)}>Delete</Button>
              </div>
            ))}
          </div>
        ) : null}
      </Card>

      <div className="space-y-3">
        {listings.map((l) => (
          <PropertyCard key={l.id} listing={l} />
        ))}
      </div>
    </section>
  );
}
