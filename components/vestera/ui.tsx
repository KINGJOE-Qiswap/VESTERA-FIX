"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------- Icons ----------
type IconProps = { className?: string };
function S({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5"}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const IconBrowse = (p: IconProps) => (
  <S className={p.className}>
    <path d="M3 10.5 12 4l9 6.5" />
    <path d="M5 9.5V20h14V9.5" />
    <path d="M9.5 20v-5h5v5" />
  </S>
);
export const IconSearch = (p: IconProps) => (
  <S className={p.className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </S>
);
export const IconPlus = (p: IconProps) => (
  <S className={p.className}>
    <path d="M12 5v14M5 12h14" />
  </S>
);
export const IconChat = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 5h16v11H8l-4 3z" />
  </S>
);
export const IconUser = (p: IconProps) => (
  <S className={p.className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </S>
);
export const IconBed = (p: IconProps) => (
  <S className={p.className}>
    <path d="M3 8v11M3 13h18v6M21 19v-4a3 3 0 0 0-3-3H10v4" />
    <circle cx="7" cy="10" r="1.4" />
  </S>
);
export const IconRuler = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 8 16 20l4-4L8 4z" />
    <path d="M9 7l1.5 1.5M12 10l1.5 1.5M7 9 8.5 10.5" />
  </S>
);
export const IconPin = (p: IconProps) => (
  <S className={p.className}>
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </S>
);
export const IconShieldCheck = (p: IconProps) => (
  <S className={p.className}>
    <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </S>
);
export const IconClose = (p: IconProps) => (
  <S className={p.className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);
export const IconBack = (p: IconProps) => (
  <S className={p.className}>
    <path d="M15 5l-7 7 7 7" />
  </S>
);
export const IconChevron = (p: IconProps) => (
  <S className={p.className}>
    <path d="M9 6l6 6-6 6" />
  </S>
);
export const IconChevronDown = (p: IconProps) => (
  <S className={p.className}>
    <path d="M6 9l6 6 6-6" />
  </S>
);
export const IconCamera = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
    <circle cx="12" cy="13" r="3.2" />
  </S>
);
export const IconTrash = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
  </S>
);
export const IconEdit = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 20h4L18 10l-4-4L4 16z" />
    <path d="m13.5 6.5 4 4" />
  </S>
);
export const IconSend = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 12 20 4l-6 16-3-7z" />
  </S>
);
export const IconScale = (p: IconProps) => (
  <S className={p.className}>
    <path d="M12 4v16M6 20h12M12 6l-6 2 3 5a3 3 0 0 1-6 0M12 6l6 2-3 5a3 3 0 0 0 6 0" />
  </S>
);
export const IconEye = (p: IconProps) => (
  <S className={p.className}>
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
    <circle cx="12" cy="12" r="2.6" />
  </S>
);
export const IconDoc = (p: IconProps) => (
  <S className={p.className}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 13h6M9 17h6" />
  </S>
);
export const IconCheck = (p: IconProps) => (
  <S className={p.className}>
    <path d="m5 12 4 4 10-10" />
  </S>
);
export const IconLock = (p: IconProps) => (
  <S className={p.className}>
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </S>
);
export const IconBuilding = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 21V6l7-3v18M11 21V9l9-2v14" />
    <path d="M14.5 11h2M14.5 14h2M14.5 17h2M7 8h1M7 11h1M7 14h1" />
  </S>
);
export const IconStore = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 9V5h16v4M4 9l1.2-4M20 9 18.8 5M4 9v11h16V9M4 9a3 3 0 0 0 6 0 3 3 0 0 0 4 0 3 3 0 0 0 6 0" />
  </S>
);
export const IconLayers = (p: IconProps) => (
  <S className={p.className}>
    <path d="M12 3 3 8l9 5 9-5z" />
    <path d="M3 13l9 5 9-5" />
  </S>
);
export const IconLand = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 18h16M6 18l3-9 3 5 2-3 4 7" />
    <path d="M4 14v6M20 14v6" />
  </S>
);
export const IconFilter = (p: IconProps) => (
  <S className={p.className}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </S>
);
export const IconArrowRight = (p: IconProps) => (
  <S className={p.className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </S>
);
export const IconHandshake = (p: IconProps) => (
  <S className={p.className}>
    <path d="m3 12 4-4 5 4 2-2 3 3 4-3" />
    <path d="m8 12 3 3a2 2 0 0 0 3 0l1-1" />
  </S>
);
export const IconStamp = (p: IconProps) => (
  <S className={p.className}>
    <path d="M9 3h6l-1 6a3 3 0 0 1-4 0zM5 15h14M4 21h16v-4H4z" />
  </S>
);
export const IconGrid = (p: IconProps) => (
  <S className={p.className}>
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </S>
);

export function PropertyTypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === "commercial") return <IconStore className={className} />;
  if (type === "apartment") return <IconLayers className={className} />;
  if (type === "land") return <IconLand className={className} />;
  return <IconBuilding className={className} />;
}

// ---------- Brand ----------
export function VesteraLogo({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl text-[var(--vst-on-hero)] vst-hero-grad",
        className,
      )}
    >
      <IconBrowse className="h-5 w-5" />
    </span>
  );
}

export function PiMark({ className }: { className?: string }) {
  return <span className={cx("vst-nums font-semibold", className)}>π</span>;
}

// ---------- Buttons ----------
type Variant = "primary" | "solid" | "outline" | "ghost" | "danger" | "gold";
const VARIANTS: Record<Variant, string> = {
  primary: "vst-hero-grad text-[var(--vst-on-hero)] shadow-sm",
  solid: "bg-[var(--vst-ink)] text-[var(--vst-panel)]",
  outline: "border border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-ink)]",
  ghost: "text-[var(--vst-ink)]",
  danger: "border border-[color-mix(in_oklch,var(--vst-sold)_40%,var(--vst-line))] bg-[var(--vst-sold-soft)] text-[var(--vst-sold)]",
  gold: "bg-[var(--vst-gold)] text-[var(--vst-ink)]",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cx(
        "vst-press inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50 disabled:pointer-events-none",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function IconButton({
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cx(
        "vst-press inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--vst-line)] bg-[var(--vst-panel)] text-[var(--vst-ink)]",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------- Surfaces ----------
export function Card({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-[var(--vst-line)] bg-[var(--vst-panel)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--vst-faint-ink)]", className)}>
      {children}
    </p>
  );
}

export function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cx("vst-display text-xl font-semibold text-[var(--vst-ink)]", className)}>{children}</h2>;
}

type PillTone = "neutral" | "accent" | "gold" | "avail" | "offer" | "sold";
export function Pill({
  tone = "neutral",
  children,
  className,
}: {
  tone?: PillTone;
  children: ReactNode;
  className?: string;
}) {
  const map: Record<PillTone, { bg: string; fg: string }> = {
    neutral: { bg: "var(--vst-panel-2)", fg: "var(--vst-muted-ink)" },
    accent: { bg: "var(--vst-accent-soft)", fg: "var(--vst-accent-deep)" },
    gold: { bg: "var(--vst-gold-soft)", fg: "color-mix(in oklch, var(--vst-gold) 60%, black)" },
    avail: { bg: "var(--vst-avail-soft)", fg: "var(--vst-avail)" },
    offer: { bg: "var(--vst-offer-soft)", fg: "color-mix(in oklch, var(--vst-offer) 62%, black)" },
    sold: { bg: "var(--vst-sold-soft)", fg: "var(--vst-sold)" },
  };
  const s = map[tone];
  return (
    <span
      className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold", className)}
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {children}
    </span>
  );
}

export function KycBadge({ label = "Pi KYC", className }: { label?: string; className?: string }) {
  return (
    <span
      className={cx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", className)}
      style={{ backgroundColor: "var(--vst-accent-soft)", color: "var(--vst-accent-deep)" }}
    >
      <IconShieldCheck className="h-3 w-3" />
      {label}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "vst-spin inline-block rounded-full border-2 border-[var(--vst-line)] border-t-[var(--vst-accent)]",
        className ?? "h-5 w-5",
      )}
    />
  );
}

// ---------- Form fields ----------
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-[var(--vst-muted-ink)]">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-[var(--vst-faint-ink)]">{hint}</span> : null}
    </label>
  );
}

const inputBase =
  "w-full rounded-xl border border-[var(--vst-line)] bg-[var(--vst-panel)] px-3.5 py-3 text-sm text-[var(--vst-ink)] outline-none placeholder:text-[var(--vst-faint-ink)] focus:border-[var(--vst-accent)]";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cx(inputBase, props.className)} />;
}
export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cx(inputBase, "min-h-24 resize-none leading-relaxed", props.className)} />;
}
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cx(inputBase, "appearance-none pr-9", props.className)} />;
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--vst-line)] bg-[var(--vst-panel)] px-6 py-12 text-center">
      {icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--vst-panel-2)] text-[var(--vst-faint-ink)]">
          {icon}
        </span>
      ) : null}
      <p className="vst-display text-base font-semibold text-[var(--vst-ink)]">{title}</p>
      {body ? <p className="max-w-xs text-sm leading-relaxed text-[var(--vst-muted-ink)]">{body}</p> : null}
      {action}
    </div>
  );
}
