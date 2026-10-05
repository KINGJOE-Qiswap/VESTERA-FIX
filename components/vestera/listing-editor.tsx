"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useVestera, type ListingInput } from "@/contexts/vestera-context";
import {
  DESC_CAP,
  MAX_PHOTOS,
  PROPERTY_TYPES,
  PROPERTY_TYPE_MAP,
  TITLE_CAP,
  NIGERIA_REGIONS,
  type NigeriaRegion,
  type PropertyType,
} from "@/lib/vestera/data";
import {
  Button,
  cx,
  Field,
  IconCamera,
  IconClose,
  IconPlus,
  PropertyTypeIcon,
  TextArea,
  TextInput,
} from "./ui";
import { Overlay, PropertyArt } from "./pieces";

export function ListingEditor({ editId, onClose }: { editId: string | "new"; onClose: () => void }) {
  const { getListing, addListing, updateListing, setTab } = useVestera();
  const editing = editId !== "new" ? getListing(editId) : undefined;

  const [title, setTitle] = useState(editing?.title ?? "");
  const [type, setType] = useState<PropertyType>(editing?.propertyType ?? "residential");
  const [location, setLocation] = useState(editing?.location ?? "");
  const [sizeLabel, setSizeLabel] = useState(editing?.sizeLabel ?? "");
  const [bedrooms, setBedrooms] = useState(editing?.bedrooms ? String(editing.bedrooms) : "");
  const [price, setPrice] = useState(editing?.priceInPi ? String(editing.priceInPi) : "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [region, setRegion] = useState<NigeriaRegion>(editing?.region ?? "lagos");
  const [state, setState] = useState(editing?.state ?? "");
  const [titleType, setTitleType] = useState(editing?.titleType ?? "C of O");
  const regionMeta = NIGERIA_REGIONS.find((r) => r.id === region)!;
  const [photoQueries, setPhotoQueries] = useState<string[]>(
    editing && editing.photos.length ? editing.photos.map((p) => p.query) : [""],
  );
  const [touched, setTouched] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  useEffect(() => () => uploadedPhotos.forEach((url) => URL.revokeObjectURL(url)), [uploadedPhotos]);

  const meta = PROPERTY_TYPE_MAP[type];
  const priceNum = Number(price);
  const valid = title.trim().length > 0 && location.trim().length > 0 && priceNum > 0 && region.length > 0 && state.trim().length > 0;

  const previewPhotos = useMemo(
    () =>
      photoQueries
        .filter((q) => q.trim())
        .map((q, i) => ({ id: `pv${i}`, hue: meta.hue, query: q.trim() })),
    [photoQueries, meta.hue],
  );

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    const input: ListingInput = {
      title,
      propertyType: type,
      description,
      location,
      sizeLabel,
      bedrooms: Number(bedrooms) || 0,
      priceInPi: priceNum,
      photoQueries: photoQueries.map((q) => q.trim()).filter(Boolean),
      region,
      state,
      titleType,
      isVerifiedNg: false,
    };
    if (editing) {
      updateListing(editing.id, input);
    } else {
      addListing(input);
      setTab("sell");
    }
    onClose();
  };

  const updatePhoto = (i: number, v: string) => {
    setPhotoQueries((prev) => prev.map((p, idx) => (idx === i ? v : p)));
  };
  const addPhoto = () => setPhotoQueries((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, ""]));
  const removePhoto = (i: number) => setPhotoQueries((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)));

  return (
    <Overlay
      title={editing ? "Edit listing" : "List a property"}
      onClose={onClose}
      footer={
        <Button variant="primary" className="w-full" onClick={submit} disabled={!valid}>
          {editing ? "Save changes" : "Publish listing"}
        </Button>
      }
    >
      <div className="space-y-5 p-4">
        <div>
          <p className="mb-2 text-xs font-semibold text-[var(--vst-muted-ink)]">Property type</p>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map((t) => {
              const on = type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={cx(
                    "vst-press flex items-center gap-2 rounded-xl border px-3 py-3 text-left text-sm font-semibold",
                    on
                      ? "border-[var(--vst-accent)] bg-[var(--vst-accent-soft)] text-[var(--vst-accent-deep)]"
                      : "border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-muted-ink)]",
                  )}
                >
                  <PropertyTypeIcon type={t.id} className="h-5 w-5" />
                  {t.short}
                </button>
              );
            })}
          </div>
        </div>

        <Field label="Title">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hillcrest Modern Family Villa"
            maxLength={TITLE_CAP}
          />
          {touched && !title.trim() ? <span className="text-[11px] text-[var(--vst-sold)]">Title is required.</span> : null}
        </Field>

        <Field label="Location">
          <TextInput value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / area" maxLength={120} />
          {touched && !location.trim() ? (
            <span className="text-[11px] text-[var(--vst-sold)]">Location is required.</span>
          ) : null}
        </Field>

        <div className="rounded-2xl border border-[var(--vst-accent)] bg-[var(--vst-accent-soft)] p-3"><p className="mb-2 text-xs font-bold text-[var(--vst-accent-deep)]">Nigeria MAT details</p><div className="grid grid-cols-2 gap-2"><Field label="Region"><select value={region} onChange={(e) => { setRegion(e.target.value as NigeriaRegion); setState(""); }} className="vst-input w-full">{NIGERIA_REGIONS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></Field><Field label="State"><select value={state} onChange={(e) => setState(e.target.value)} className="vst-input w-full"><option value="">Select state</option>{regionMeta.states.map((s) => <option key={s}>{s}</option>)}</select></Field></div><div className="mt-2"><Field label="Title type"><TextInput value={titleType} onChange={(e) => setTitleType(e.target.value)} placeholder="C of O, Deed, Gazette" /></Field>{touched && !state.trim() ? <p className="mt-1 text-[11px] text-[var(--vst-sold)]">Region and state are required.</p> : null}</div></div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price in Pi (GCV)">
            <TextInput
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0"
              inputMode="decimal"
              className="vst-nums"
            />
            {touched && !(priceNum > 0) ? <span className="text-[11px] text-[var(--vst-sold)]">Enter a price.</span> : null}
          </Field>
          <Field label={meta.showBedrooms ? "Bedrooms" : "Bedrooms (n/a)"}>
            <TextInput
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={meta.showBedrooms ? "0" : "—"}
              inputMode="numeric"
              disabled={!meta.showBedrooms}
              className="vst-nums"
            />
          </Field>
        </div>

        <Field label="Size" hint="e.g. 420 m² on 900 m² plot">
          <TextInput value={sizeLabel} onChange={(e) => setSizeLabel(e.target.value)} placeholder="Land / building size" maxLength={120} />
        </Field>

        <Field label="Description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the property, its features and condition."
            maxLength={DESC_CAP}
            className="min-h-32"
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">Photos</span>
            <span className="text-[11px] text-[var(--vst-faint-ink)]">Describe each shot for the gallery</span>
          </div>
          <label className="vst-press flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--vst-accent)] bg-[var(--vst-accent-soft)] px-3 py-3 text-sm font-semibold text-[var(--vst-accent-deep)]">
            <IconCamera className="h-5 w-5" /> Take photo or choose from gallery
            <input
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className="sr-only"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const files = Array.from(event.target.files ?? []).slice(0, MAX_PHOTOS);
                setUploadedPhotos((previous) => {
                  previous.forEach((url) => URL.revokeObjectURL(url));
                  return files.map((file) => URL.createObjectURL(file));
                });
              }}
            />
          </label>
          {uploadedPhotos.length > 0 ? (
            <div className="vst-no-scrollbar mb-3 flex gap-2 overflow-x-auto">
              {uploadedPhotos.map((url, index) => <img key={url} src={url} alt={`Selected property photo ${index + 1}`} className="h-24 w-32 shrink-0 rounded-xl object-cover" />)}
            </div>
          ) : null}
          {previewPhotos.length > 0 ? (
            <div className="vst-no-scrollbar mb-3 flex gap-2 overflow-x-auto">
              {previewPhotos.map((p) => (
                <PropertyArt key={p.id} photo={p} type={type} className="h-24 w-32 shrink-0" />
              ))}
            </div>
          ) : null}
          <div className="space-y-2">
            {photoQueries.map((q, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--vst-panel-2)] text-[var(--vst-faint-ink)]">
                  <IconCamera className="h-5 w-5" />
                </span>
                <TextInput
                  value={q}
                  onChange={(e) => updatePhoto(i, e.target.value)}
                  placeholder={i === 0 ? "e.g. modern white villa exterior with pool" : "another view"}
                  maxLength={120}
                />
                {photoQueries.length > 1 ? (
                  <button
                    onClick={() => removePhoto(i)}
                    className="vst-press flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[var(--vst-muted-ink)]"
                    aria-label="Remove photo"
                  >
                    <IconClose className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {photoQueries.length < MAX_PHOTOS ? (
            <Button variant="outline" className="mt-2 w-full py-2 text-sm" onClick={addPhoto}>
              <IconPlus className="h-4 w-4" /> Add another photo
            </Button>
          ) : null}
        </div>

        {!editing ? (
          <p className="text-center text-[11px] text-[var(--vst-faint-ink)]">
            A unique VESTERA property code is generated automatically when you publish.
          </p>
        ) : null}
      </div>
    </Overlay>
  );
}
