"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  LISTING_STATUS_META,
  photoSrc,
  type ListingStatus,
  type PhotoRef,
} from "@/lib/vestera/data";
import { useVestera, type Toast } from "@/contexts/vestera-context";
import {
  Button,
  cx,
  IconBack,
  IconCheck,
  IconClose,
  IconShieldCheck,
  PropertyTypeIcon,
  Spinner,
  VesteraLogo,
} from "./ui";

export function LoadingScreen({ label = "Preparing VESTERA…" }: { label?: string }) {
  return (
    <div className="vst-app-bg flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6">
      <VesteraLogo className="h-14 w-14" />
      <p className="vst-display text-lg font-semibold tracking-tight text-[var(--vst-ink)]">VESTERA</p>
      <div className="flex items-center gap-2 text-sm text-[var(--vst-muted-ink)]">
        <Spinner className="h-4 w-4" />
        {label}
      </div>
    </div>
  );
}

export function StorageNotice() {
  const { storageTrouble } = useVestera();
  if (!storageTrouble) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[210] flex justify-center px-4">
      <div className="pointer-events-auto max-w-sm rounded-xl border border-[var(--vst-offer)] bg-[var(--vst-offer-soft)] px-4 py-2.5 text-xs font-medium text-[color-mix(in_oklch,var(--vst-offer)_60%,black)] shadow-sm">
        Saving to your Pi account is taking a moment — your changes are safe and will sync shortly.
      </div>
    </div>
  );
}

export function ToastHost() {
  const { toasts } = useVestera();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[200] flex flex-col items-center gap-2 px-4">
      {toasts.map((t: Toast) => (
        <div
          key={t.id}
          className={cx(
            "vst-toast pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg",
          )}
          style={{
            backgroundColor:
              t.tone === "ok"
                ? "var(--vst-avail)"
                : t.tone === "warn"
                  ? "var(--vst-offer)"
                  : "var(--vst-ink)",
            color: "var(--vst-panel)",
          }}
        >
          {t.tone === "ok" ? <IconCheck className="h-4 w-4" /> : null}
          {t.text}
        </div>
      ))}
    </div>
  );
}

// A polished property image tile. Uses placeholder photography over a type-hue wash.
export function PropertyArt({
  photo,
  type,
  className,
  rounded = "rounded-2xl",
  w = 800,
  h = 600,
}: {
  photo: PhotoRef | undefined;
  type: string;
  className?: string;
  rounded?: string;
  w?: number;
  h?: number;
}) {
  const hue = photo?.hue ?? 168;
  return (
    <div
      className={cx("relative overflow-hidden", rounded, className)}
      style={{
        background: `linear-gradient(150deg, oklch(0.7 0.09 ${hue}), oklch(0.55 0.11 ${hue}))`,
      }}
    >
      {photo ? (
        <img
          src={photoSrc(photo, w, h) || "/placeholder.svg"}
          alt=""
          crossOrigin="anonymous"
          className="h-full w-full object-cover mix-blend-luminosity opacity-90"
          loading="lazy"
        />
      ) : null}
      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/25 text-white backdrop-blur-sm">
        <PropertyTypeIcon type={type} className="h-4 w-4" />
      </span>
    </div>
  );
}

export function Gallery({ photos, type }: { photos: PhotoRef[]; type: string }) {
  const [idx, setIdx] = useState(0);
  const list = photos.length ? photos : [{ id: "x", hue: 168, query: "premium property" }];
  const active = list[Math.min(idx, list.length - 1)];
  return (
    <div className="relative">
      <PropertyArt photo={active} type={type} rounded="rounded-none" className="aspect-[4/3] w-full" w={1000} h={750} />
      {list.length > 1 ? (
        <>
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {list.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIdx(i)}
                aria-label={`Photo ${i + 1}`}
                className={cx(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-6 bg-white" : "w-1.5 bg-white/55",
                )}
              />
            ))}
          </div>
          <div className="absolute right-3 top-3 rounded-full bg-black/35 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            {idx + 1}/{list.length}
          </div>
        </>
      ) : null}
    </div>
  );
}

export function StatusPill({ status }: { status: ListingStatus }) {
  const meta = LISTING_STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ backgroundColor: `var(${meta.softVar})`, color: `var(${meta.varName})` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: `var(${meta.varName})` }} />
      {meta.label}
    </span>
  );
}

export function VerifiedName({
  name,
  verified,
  className,
}: {
  name: string;
  verified: boolean;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex items-center gap-1 font-semibold text-[var(--vst-ink)]", className)}>
      {name}
      {verified ? <IconShieldCheck className="h-4 w-4 text-[var(--vst-accent)]" /> : null}
    </span>
  );
}

// Full-screen overlay panel that slides up.
export function Overlay({
  title,
  onClose,
  children,
  footer,
  formal = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  formal?: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[120] flex justify-center bg-black/40">
      <div className="vst-sheet flex h-[100dvh] w-full max-w-md flex-col bg-[var(--vst-bg)]">
        <header
          className={cx(
            "vst-safe-top flex shrink-0 items-center gap-3 border-b border-[var(--vst-line)] px-4 py-3",
            formal ? "bg-[var(--vst-ink)] text-[var(--vst-panel)]" : "bg-[var(--vst-panel)]",
          )}
        >
          <button
            onClick={onClose}
            className="vst-press flex h-9 w-9 items-center justify-center rounded-xl"
            aria-label="Back"
          >
            <IconBack className="h-5 w-5" />
          </button>
          <h1 className={cx("vst-display flex-1 truncate text-base font-semibold", formal ? "" : "text-[var(--vst-ink)]")}>
            {title}
          </h1>
        </header>
        <div className="vst-no-scrollbar flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <div className="vst-safe-bottom shrink-0 border-t border-[var(--vst-line)] bg-[var(--vst-panel)] px-4 py-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Bottom sheet.
export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/45" onClick={onClose}>
      <div
        className="vst-sheet vst-safe-bottom max-h-[88dvh] w-full max-w-md overflow-y-auto vst-no-scrollbar rounded-t-3xl bg-[var(--vst-bg)] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--vst-line)]" />
        <div className="mb-3 flex items-center justify-between">
          <h2 className="vst-display text-lg font-semibold text-[var(--vst-ink)]">{title}</h2>
          <button
            onClick={onClose}
            className="vst-press flex h-8 w-8 items-center justify-center rounded-lg text-[var(--vst-muted-ink)]"
            aria-label="Close"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Two-step confirm button.
export function ConfirmButton({
  label,
  confirmLabel = "Tap again to confirm",
  onConfirm,
  className,
}: {
  label: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <Button
      variant="danger"
      className={className}
      onClick={() => {
        if (armed) {
          setArmed(false);
          onConfirm();
        } else {
          setArmed(true);
        }
      }}
    >
      {armed ? confirmLabel : label}
    </Button>
  );
}
