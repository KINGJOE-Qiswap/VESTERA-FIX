// VESTERA — data model, constants, helpers and sanitizers.
// Single-user Pi storage: seed listings/practitioners are simulated verified peers merged
// with the user's own persisted data. Only the user's own data is written to Pi.

export type TabId = "browse" | "search" | "sell" | "chat" | "account" | "escrow" | "nigeria" | "agent";
export type EscrowStatus = "awaiting_payment" | "proof_submitted" | "approved" | "released";
export type NigeriaRegion = "lagos" | "abuja" | "eastern" | "other";
export interface SavedSearch {
  id: string;
  name: string;
  region: NigeriaRegion;
  state: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  titleType: string;
  createdAt: number;
}
export const TITLE_TYPES = ["Any title", "C of O", "Deed of Assignment", "Gazette", "Governor's Consent"] as const;

export interface EscrowPayment {
  id: string;
  propertyId: string;
  propertyCode: string;
  buyerPi: string;
  sellerPi: string;
  amountPi: number;
  status: EscrowStatus;
  txId: string;
  proofNote: string;
  createdAt: number;
  updatedAt: number;
}

export interface Agent {
  id: string;
  username: string;
  isVerified: boolean;
  propertiesListed: number;
  createdAt: number;
}

export const NIGERIA_REGIONS: Array<{ id: NigeriaRegion; label: string; states: string[] }> = [
  { id: "lagos", label: "LAGOS MAT", states: ["Lagos"] },
  { id: "abuja", label: "ABUJA MAT", states: ["FCT Abuja"] },
  { id: "eastern", label: "EASTERN MAT", states: ["Anambra", "Enugu", "Imo", "Abia", "Ebonyi", "Cross River", "Rivers"] },
  { id: "other", label: "OTHER STATES", states: ["Oyo", "Kano", "Kaduna", "Ogun", "Delta", "Edo", "Other"] },
];
export const NIGERIA_REGION_MAP = Object.fromEntries(NIGERIA_REGIONS.map((r) => [r.id, r])) as Record<NigeriaRegion, (typeof NIGERIA_REGIONS)[number]>; 
export const ESCROW_STATUS_META: Record<EscrowStatus, { label: string; tone: string }> = {
  awaiting_payment: { label: "Awaiting payment", tone: "--vst-offer" }, proof_submitted: { label: "Proof submitted", tone: "--vst-accent" }, approved: { label: "Approved", tone: "--vst-avail" }, released: { label: "Released", tone: "--vst-avail" },
};

export interface NigeriaPropertyMeta { region: NigeriaRegion; state: string; titleType: string; isVerifiedNg: boolean; } 
export interface AgentPropertyMeta { agentId?: string; isVerifiedAgent?: boolean; } 
export type PropertyMeta = NigeriaPropertyMeta & AgentPropertyMeta; 

export type PropertyType = "residential" | "commercial" | "apartment" | "land";
export type ListingStatus = "available" | "under_offer" | "sold";
export type InspectionStatus = "pending" | "scheduled" | "completed";
export type ServiceStatus = "requested" | "in_review" | "completed";
export type ApprovalStatus = "approved" | "pending";

export const ME_ID = "me";

export interface PropertyTypeMeta {
  id: PropertyType;
  label: string;
  short: string;
  hue: number;
  showBedrooms: boolean;
}

export const PROPERTY_TYPES: PropertyTypeMeta[] = [
  { id: "residential", label: "Residential Building", short: "Residential", hue: 168, showBedrooms: true },
  { id: "apartment", label: "Apartment", short: "Apartment", hue: 232, showBedrooms: true },
  { id: "commercial", label: "Commercial Building", short: "Commercial", hue: 285, showBedrooms: false },
  { id: "land", label: "Land / Plot", short: "Land", hue: 72, showBedrooms: false },
];

export const PROPERTY_TYPE_MAP: Record<PropertyType, PropertyTypeMeta> = PROPERTY_TYPES.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<PropertyType, PropertyTypeMeta>,
);

export function propertyTypeLabel(id: PropertyType): string {
  return PROPERTY_TYPE_MAP[id]?.label ?? "Property";
}
export function propertyTypeHue(id: PropertyType): number {
  return PROPERTY_TYPE_MAP[id]?.hue ?? 168;
}

export interface StatusMeta {
  label: string;
  varName: string;
  softVar: string;
}
export const LISTING_STATUS_META: Record<ListingStatus, StatusMeta> = {
  available: { label: "Available", varName: "--vst-avail", softVar: "--vst-avail-soft" },
  under_offer: { label: "Under Offer", varName: "--vst-offer", softVar: "--vst-offer-soft" },
  sold: { label: "Sold", varName: "--vst-sold", softVar: "--vst-sold-soft" },
};

export const INSPECTION_STATUS_META: Record<InspectionStatus, StatusMeta> = {
  pending: { label: "Pending", varName: "--vst-offer", softVar: "--vst-offer-soft" },
  scheduled: { label: "Scheduled", varName: "--vst-accent", softVar: "--vst-accent-soft" },
  completed: { label: "Completed", varName: "--vst-avail", softVar: "--vst-avail-soft" },
};

export const SERVICE_STATUS_META: Record<ServiceStatus, StatusMeta> = {
  requested: { label: "Requested", varName: "--vst-offer", softVar: "--vst-offer-soft" },
  in_review: { label: "In Review", varName: "--vst-accent", softVar: "--vst-accent-soft" },
  completed: { label: "Completed", varName: "--vst-avail", softVar: "--vst-avail-soft" },
};

export interface PhotoRef {
  id: string;
  hue: number;
  query: string;
}

export interface Listing {
  id: string;
  code: string;
  ownerId: string;
  ownerName: string;
  ownerVerified: boolean;
  title: string;
  propertyType: PropertyType;
  description: string;
  location: string;
  sizeLabel: string;
  bedrooms: number;
  priceInPi: number;
  photos: PhotoRef[];
  status: ListingStatus;
  seed?: boolean;
  createdAt: number;
  updatedAt: number;
  region?: NigeriaRegion;
  state?: string;
  titleType?: string;
  isVerifiedNg?: boolean;
  agentId?: string;
  isVerifiedAgent?: boolean;
}

export interface InspectionRequest {
  id: string;
  listingId: string;
  listingCode: string;
  listingTitle: string;
  ownerId: string;
  ownerName: string;
  requesterName: string;
  direction: "sent" | "received";
  note: string;
  status: InspectionStatus;
  createdAt: number;
}

export interface ServiceRequest {
  id: string;
  listingId: string;
  listingCode: string;
  listingTitle: string;
  serviceId: string;
  serviceName: string;
  practitionerId: string | null;
  practitionerName: string;
  note: string;
  status: ServiceStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  from: "me" | "peer";
  text: string;
  at: number;
}
export interface ChatThread {
  id: string;
  listingId: string;
  listingCode: string;
  listingTitle: string;
  peerName: string;
  peerVerified: boolean;
  messages: ChatMessage[];
  updatedAt: number;
}

export interface Practitioner {
  id: string;
  piUsername: string;
  lawFirm: string;
  location: string;
  email: string;
  specialties: string[];
  approval: ApprovalStatus;
  seed?: boolean;
  createdAt: number;
}

export interface ServiceDef {
  id: string;
  name: string;
  blurb: string;
}

export const ADMIN_SERVICES: ServiceDef[] = [
  { id: "due_diligence", name: "Due Diligence", blurb: "Verification of property and title documents before you commit." },
  { id: "coordination", name: "Transaction Coordination", blurb: "Coordination between buyers, sellers and agents through the deal." },
  { id: "deeds", name: "Deeds & Contracts", blurb: "Preparation of deeds and formal contracts of sale." },
  { id: "endorsements", name: "Government Endorsements", blurb: "Processing endorsements and issuance of property documents." },
  { id: "mediation", name: "Mediation", blurb: "Neutral mediation between parties for conflict resolution." },
];
export const SERVICE_MAP: Record<string, ServiceDef> = ADMIN_SERVICES.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, ServiceDef>,
);

export interface PrefsState {
  tab: TabId;
  name: string;
  email: string;
}

export const MAX_LISTINGS = 40;
export const MAX_INSPECTIONS = 80;
export const MAX_SERVICES = 80;
export const MAX_CHATS = 40;
export const MAX_MESSAGES = 60;
export const MAX_PRACTITIONERS = 40;
export const MAX_PHOTOS = 6;
export const TITLE_CAP = 90;
export const DESC_CAP = 1400;
export const FIELD_CAP = 120;
export const MSG_CAP = 600;
export const MAX_PRICE = 1_000_000;

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

export function makeCode(): string {
  const part = (n: number) => {
    let s = "";
    for (let i = 0; i < n; i++) s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    return s;
  };
  return `VST-${part(4)}-${part(4)}`;
}

export function formatPi(n: number): string {
  const v = Number.isFinite(n) ? n : 0;
  const s = v % 1 === 0 ? v.toLocaleString("en-US") : v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 3 });
  return `${s} π`;
}

export function img(query: string, w = 800, h = 600): string {
  return `/placeholder.svg?height=${h}&width=${w}&query=${encodeURIComponent(query)}`;
}

export function photoSrc(p: PhotoRef, w = 800, h = 600): string {
  return img(p.query || "premium real estate property", w, h);
}

export function relativeTime(ts: number, now = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return dateLabel(ts);
}

export function dateLabel(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchesQuery(listing: Listing, q: string): boolean {
  if (!q.trim()) return true;
  const hay = fold(
    [listing.title, listing.location, listing.description, listing.code, propertyTypeLabel(listing.propertyType), listing.ownerName].join(" "),
  );
  return fold(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((tok) => hay.includes(tok));
}

// ---------- Seed data ----------

function seedPhotos(queries: string[], hue: number): PhotoRef[] {
  return queries.map((q, i) => ({ id: `p${i}`, hue, query: q }));
}

export function buildSeedListings(now: number): Listing[] {
  const base: Array<Omit<Listing, "id" | "code" | "createdAt" | "updatedAt" | "ownerId" | "ownerVerified" | "seed">> = [
    {
      ownerName: "harmony_estates",
      title: "Hillcrest Modern Family Villa",
      propertyType: "residential",
      description:
        "A refined four-bedroom villa framed by mature gardens and floor-to-ceiling glazing. Open-plan living flows onto a shaded terrace with panoramic valley views. Finished to a premium standard throughout with a double garage and staff quarters.",
      location: "Hillcrest, Cape Town",
      sizeLabel: "420 m² on 900 m² plot",
      bedrooms: 4,
      priceInPi: 6.4,
      photos: seedPhotos(["modern white villa with pool exterior", "bright open plan living room", "villa garden terrace at dusk"], 168),
      status: "available",
    },
    {
      ownerName: "atlas_holdings",
      title: "Riverside Corner Office Block",
      propertyType: "commercial",
      description:
        "Six-storey commercial block on a prominent riverside corner with dedicated parking, backup power and high-speed fibre. Fully tenanted ground-floor retail with flexible upper-floor office suites. An exceptional yield-bearing asset.",
      location: "Central Business District, Lagos",
      sizeLabel: "2,100 m² gross lettable",
      bedrooms: 0,
      priceInPi: 18.2,
      photos: seedPhotos(["modern glass office building exterior", "commercial office lobby interior"], 285),
      status: "under_offer",
    },
    {
      ownerName: "meridian_living",
      title: "Skyline Two-Bed Apartment",
      propertyType: "apartment",
      description:
        "A light-filled two-bedroom apartment on the 14th floor of a managed tower. Wrap-around balcony, designer kitchen and access to a residents' gym, pool and 24-hour concierge. Move-in ready.",
      location: "Marina District, Dubai",
      sizeLabel: "96 m² internal",
      bedrooms: 2,
      priceInPi: 4.1,
      photos: seedPhotos(["luxury high rise apartment living room city view", "modern apartment kitchen"], 232),
      status: "available",
    },
    {
      ownerName: "greenfield_land",
      title: "Prime Serviced Residential Plot",
      propertyType: "land",
      description:
        "A level, fully-serviced residential plot in a gated development with tarred access roads, water and power connections at the boundary. Clean title with survey plan available. Ready to build.",
      location: "Karen, Nairobi",
      sizeLabel: "1,000 m² plot",
      bedrooms: 0,
      priceInPi: 2.8,
      photos: seedPhotos(["empty serviced land plot with survey markers", "gated estate access road"], 72),
      status: "available",
    },
    {
      ownerName: "harmony_estates",
      title: "Courtyard Townhouse",
      propertyType: "residential",
      description:
        "A three-bedroom townhouse arranged around a private courtyard. Underfloor heating, solar backup and a fitted study. Set in a secure cluster with landscaped commons and children's play areas.",
      location: "Sandton, Johannesburg",
      sizeLabel: "245 m² under roof",
      bedrooms: 3,
      priceInPi: 5.2,
      photos: seedPhotos(["contemporary townhouse with courtyard", "townhouse bedroom interior"], 168),
      status: "sold",
    },
    {
      ownerName: "meridian_living",
      title: "Garden Studio Apartment",
      propertyType: "apartment",
      description:
        "An efficiently designed studio opening onto a shared garden. Ideal first purchase or rental investment, with secure parking and fibre included. Low levies and excellent transport links.",
      location: "Kilimani, Nairobi",
      sizeLabel: "42 m² internal",
      bedrooms: 1,
      priceInPi: 1.6,
      photos: seedPhotos(["cozy garden studio apartment interior", "apartment building garden courtyard"], 232),
      status: "available",
    },
    {
      ownerName: "atlas_holdings",
      title: "Warehouse & Logistics Unit",
      propertyType: "commercial",
      description:
        "A clear-span warehouse with roller-shutter access, mezzanine office and generous truck turning circle. Located on an established industrial estate minutes from the ring road. Suits distribution and light manufacturing.",
      location: "Tema Industrial Area, Accra",
      sizeLabel: "1,450 m² floor area",
      bedrooms: 0,
      priceInPi: 9.5,
      photos: seedPhotos(["industrial warehouse exterior loading bay", "warehouse interior clear span"], 285),
      status: "available",
    },
    {
      ownerName: "greenfield_land",
      title: "Beachfront Development Land",
      propertyType: "land",
      description:
        "An exceptional beachfront parcel zoned for mixed-use development, with direct frontage and existing perimeter wall. Environmental studies completed. A rare coastal opportunity at Global Consensus Value.",
      location: "Diani, Kwale County",
      sizeLabel: "3,200 m² frontage plot",
      bedrooms: 0,
      priceInPi: 12.0,
      photos: seedPhotos(["beachfront empty land ocean view", "coastal development site"], 72),
      status: "available",
    },
  ];

  return base.map((b, i) => ({
    ...b,
    id: `seed-${i}`,
    code: `VST-SEED-${String(1000 + i)}`,
    ownerId: `seller-${b.ownerName}`,
    ownerVerified: true,
    seed: true,
    createdAt: now - (i + 1) * 3_600_000,
    updatedAt: now - (i + 1) * 3_600_000,
  }));
}

export function buildSeedPractitioners(now: number): Practitioner[] {
  const base: Array<Omit<Practitioner, "id" | "createdAt" | "seed">> = [
    {
      piUsername: "adaeze_law",
      lawFirm: "Adaeze & Partners LP",
      location: "Lagos, Nigeria",
      email: "counsel@adaezepartners.example",
      specialties: ["Due Diligence", "Deeds & Contracts"],
      approval: "approved",
    },
    {
      piUsername: "kimani_advocates",
      lawFirm: "Kimani Advocates",
      location: "Nairobi, Kenya",
      email: "info@kimaniadvocates.example",
      specialties: ["Government Endorsements", "Mediation"],
      approval: "approved",
    },
    {
      piUsername: "van_der_merwe_inc",
      lawFirm: "Van der Merwe Inc.",
      location: "Cape Town, South Africa",
      email: "conveyancing@vdminc.example",
      specialties: ["Transaction Coordination", "Deeds & Contracts"],
      approval: "approved",
    },
    {
      piUsername: "mensah_chambers",
      lawFirm: "Mensah Legal Chambers",
      location: "Accra, Ghana",
      email: "hello@mensahchambers.example",
      specialties: ["Due Diligence", "Mediation"],
      approval: "approved",
    },
    {
      piUsername: "al_rashid_legal",
      lawFirm: "Al Rashid Legal Consultants",
      location: "Dubai, UAE",
      email: "desk@alrashidlegal.example",
      specialties: ["Government Endorsements", "Transaction Coordination"],
      approval: "pending",
    },
  ];
  return base.map((b, i) => ({
    ...b,
    id: `prac-seed-${i}`,
    seed: true,
    createdAt: now - (i + 1) * 86_400_000,
  }));
}

// ---------- Sanitizers ----------

function cleanStr(v: unknown, cap: number): string {
  if (typeof v !== "string") return "";
  // strip control chars but keep newlines/tabs
  const cleaned = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
  return cleaned.slice(0, cap);
}
function toNum(v: unknown): number {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : 0;
}
function nonNegPrice(v: unknown): number {
  const n = toNum(v);
  if (n < 0) return 0;
  return Math.min(n, MAX_PRICE);
}
function boolOf(v: unknown): boolean {
  return v === true;
}
function pickType(v: unknown): PropertyType {
  return v === "commercial" || v === "apartment" || v === "land" || v === "residential" ? v : "residential";
}
function pickListingStatus(v: unknown): ListingStatus {
  return v === "under_offer" || v === "sold" || v === "available" ? v : "available";
}
function pickInspectionStatus(v: unknown): InspectionStatus {
  return v === "scheduled" || v === "completed" || v === "pending" ? v : "pending";
}
function pickServiceStatus(v: unknown): ServiceStatus {
  return v === "in_review" || v === "completed" || v === "requested" ? v : "requested";
}
function pickApproval(v: unknown): ApprovalStatus {
  return v === "approved" ? "approved" : "pending";
}
function pickTab(v: unknown): TabId {
  return v === "search" || v === "sell" || v === "chat" || v === "account" || v === "browse" || v === "escrow" || v === "nigeria" || v === "agent" ? v : "browse";
}

export function extractObject(rec: unknown): Record<string, unknown> | null {
  if (!rec || typeof rec !== "object") return null;
  const r = rec as Record<string, unknown>;
  const inner = r.blob;
  if (inner && typeof inner === "object") return inner as Record<string, unknown>;
  return r;
}
function extractItems(rec: unknown): unknown[] {
  const obj = extractObject(rec);
  if (!obj) return [];
  const items = obj.items;
  return Array.isArray(items) ? items : [];
}

function sanitizePhoto(v: unknown, i: number): PhotoRef | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const query = cleanStr(r.query, FIELD_CAP);
  return {
    id: cleanStr(r.id, 40) || `p${i}`,
    hue: Math.round(toNum(r.hue)) % 360,
    query: query || "property photo",
  };
}

export function sanitizeListing(v: unknown): Listing | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const title = cleanStr(r.title, TITLE_CAP);
  if (!title) return null;
  const photosRaw = Array.isArray(r.photos) ? r.photos : [];
  const photos = photosRaw
    .map((p, i) => sanitizePhoto(p, i))
    .filter((p): p is PhotoRef => !!p)
    .slice(0, MAX_PHOTOS);
  const propertyType = pickType(r.propertyType);
  return {
    id: cleanStr(r.id, 40) || makeId(),
    code: cleanStr(r.code, 24) || makeCode(),
    ownerId: cleanStr(r.ownerId, 40) || ME_ID,
    ownerName: cleanStr(r.ownerName, FIELD_CAP) || "Pi Pioneer",
    ownerVerified: r.ownerVerified === undefined ? true : boolOf(r.ownerVerified),
    title,
    propertyType,
    description: cleanStr(r.description, DESC_CAP),
    location: cleanStr(r.location, FIELD_CAP),
    sizeLabel: cleanStr(r.sizeLabel, FIELD_CAP),
    bedrooms: Math.max(0, Math.min(50, Math.round(toNum(r.bedrooms)))),
    priceInPi: nonNegPrice(r.priceInPi),
    photos,
    status: pickListingStatus(r.status),
    createdAt: toNum(r.createdAt) || Date.now(),
    updatedAt: toNum(r.updatedAt) || Date.now(),
    region: r.region === "lagos" || r.region === "abuja" || r.region === "eastern" || r.region === "other" ? r.region : undefined,
    state: cleanStr(r.state, FIELD_CAP) || undefined,
    titleType: cleanStr(r.titleType, FIELD_CAP) || undefined,
    isVerifiedNg: r.isVerifiedNg === true,
    agentId: cleanStr(r.agentId, 40) || undefined,
    isVerifiedAgent: r.isVerifiedAgent === true,
  };
}

export function sanitizeListings(rec: unknown): Listing[] {
  const items = extractItems(rec)
    .map(sanitizeListing)
    .filter((l): l is Listing => !!l);
  const seen = new Set<string>();
  const out: Listing[] = [];
  for (const l of items) {
    if (seen.has(l.id)) continue;
    seen.add(l.id);
    out.push(l);
  }
  out.sort((a, b) => b.createdAt - a.createdAt);
  return out.slice(0, MAX_LISTINGS);
}

export function sanitizeInspection(v: unknown): InspectionRequest | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const listingId = cleanStr(r.listingId, 40);
  if (!listingId) return null;
  return {
    id: cleanStr(r.id, 40) || makeId(),
    listingId,
    listingCode: cleanStr(r.listingCode, 24),
    listingTitle: cleanStr(r.listingTitle, TITLE_CAP),
    ownerId: cleanStr(r.ownerId, 40),
    ownerName: cleanStr(r.ownerName, FIELD_CAP),
    requesterName: cleanStr(r.requesterName, FIELD_CAP) || "Pi Pioneer",
    direction: r.direction === "received" ? "received" : "sent",
    note: cleanStr(r.note, MSG_CAP),
    status: pickInspectionStatus(r.status),
    createdAt: toNum(r.createdAt) || Date.now(),
  };
}
export function sanitizeInspections(rec: unknown): InspectionRequest[] {
  const items = extractItems(rec)
    .map(sanitizeInspection)
    .filter((x): x is InspectionRequest => !!x);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items.slice(0, MAX_INSPECTIONS);
}

export function sanitizeServiceReq(v: unknown): ServiceRequest | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const serviceId = cleanStr(r.serviceId, 40);
  if (!serviceId) return null;
  return {
    id: cleanStr(r.id, 40) || makeId(),
    listingId: cleanStr(r.listingId, 40),
    listingCode: cleanStr(r.listingCode, 24),
    listingTitle: cleanStr(r.listingTitle, TITLE_CAP),
    serviceId,
    serviceName: cleanStr(r.serviceName, FIELD_CAP) || SERVICE_MAP[serviceId]?.name || "Service",
    practitionerId: r.practitionerId ? cleanStr(r.practitionerId, 40) : null,
    practitionerName: cleanStr(r.practitionerName, FIELD_CAP),
    note: cleanStr(r.note, MSG_CAP),
    status: pickServiceStatus(r.status),
    createdAt: toNum(r.createdAt) || Date.now(),
  };
}
export function sanitizeServiceReqs(rec: unknown): ServiceRequest[] {
  const items = extractItems(rec)
    .map(sanitizeServiceReq)
    .filter((x): x is ServiceRequest => !!x);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items.slice(0, MAX_SERVICES);
}

function sanitizeMessage(v: unknown): ChatMessage | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const text = cleanStr(r.text, MSG_CAP);
  if (!text) return null;
  return {
    id: cleanStr(r.id, 40) || makeId(),
    from: r.from === "peer" ? "peer" : "me",
    text,
    at: toNum(r.at) || Date.now(),
  };
}
export function sanitizeChat(v: unknown): ChatThread | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const listingId = cleanStr(r.listingId, 40);
  if (!listingId) return null;
  const msgs = (Array.isArray(r.messages) ? r.messages : [])
    .map(sanitizeMessage)
    .filter((m): m is ChatMessage => !!m)
    .slice(-MAX_MESSAGES);
  return {
    id: cleanStr(r.id, 40) || makeId(),
    listingId,
    listingCode: cleanStr(r.listingCode, 24),
    listingTitle: cleanStr(r.listingTitle, TITLE_CAP),
    peerName: cleanStr(r.peerName, FIELD_CAP) || "Seller",
    peerVerified: r.peerVerified === undefined ? true : boolOf(r.peerVerified),
    messages: msgs,
    updatedAt: toNum(r.updatedAt) || Date.now(),
  };
}
export function sanitizeChats(rec: unknown): ChatThread[] {
  const items = extractItems(rec)
    .map(sanitizeChat)
    .filter((x): x is ChatThread => !!x);
  items.sort((a, b) => b.updatedAt - a.updatedAt);
  return items.slice(0, MAX_CHATS);
}

export function sanitizePractitioner(v: unknown): Practitioner | null {
  if (!v || typeof v !== "object") return null;
  const r = v as Record<string, unknown>;
  const piUsername = cleanStr(r.piUsername, FIELD_CAP);
  if (!piUsername) return null;
  const specialties = (Array.isArray(r.specialties) ? r.specialties : [])
    .map((s) => cleanStr(s, FIELD_CAP))
    .filter(Boolean)
    .slice(0, 6);
  return {
    id: cleanStr(r.id, 40) || makeId(),
    piUsername,
    lawFirm: cleanStr(r.lawFirm, FIELD_CAP),
    location: cleanStr(r.location, FIELD_CAP),
    email: cleanStr(r.email, FIELD_CAP),
    specialties,
    approval: pickApproval(r.approval),
    createdAt: toNum(r.createdAt) || Date.now(),
  };
}
export function sanitizePractitioners(rec: unknown): Practitioner[] {
  const items = extractItems(rec)
    .map(sanitizePractitioner)
    .filter((x): x is Practitioner => !!x);
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items.slice(0, MAX_PRACTITIONERS);
}

export function sanitizePrefs(rec: unknown): PrefsState {
  const obj = extractObject(rec) ?? {};
  return {
    tab: pickTab(obj.tab),
    name: cleanStr(obj.name, FIELD_CAP),
    email: cleanStr(obj.email, FIELD_CAP),
  };
}

// ---------- toBlob ----------
export function listingsToBlob(items: Listing[]): Record<string, unknown> {
  return { items: items.filter((l) => l.ownerId === ME_ID) };
}
export function inspectionsToBlob(items: InspectionRequest[]): Record<string, unknown> {
  return { items };
}
export function servicesToBlob(items: ServiceRequest[]): Record<string, unknown> {
  return { items };
}
export function chatsToBlob(items: ChatThread[]): Record<string, unknown> {
  return { items };
}
export function practitionersToBlob(items: Practitioner[]): Record<string, unknown> {
  return { items: items.filter((p) => !p.seed) };
}
export function prefsToBlob(p: PrefsState): Record<string, unknown> {
  return { tab: p.tab, name: p.name, email: p.email };
}

export function escrowToBlob(items: EscrowPayment[]) { return { items }; }
export function agentsToBlob(items: Agent[]) { return { items }; }
export function savedSearchesToBlob(items: SavedSearch[]) { return { items }; }
export function sanitizeSavedSearch(v: unknown): SavedSearch | null { if (!v || typeof v !== "object") return null; const r = v as Record<string, unknown>; const name = cleanStr(r.name, 80); if (!name) return null; const region = r.region === "abuja" || r.region === "eastern" || r.region === "other" ? r.region : "lagos"; return { id: cleanStr(r.id, 40) || makeId(), name, region, state: cleanStr(r.state, 60), minPrice: nonNegPrice(r.minPrice), maxPrice: nonNegPrice(r.maxPrice), bedrooms: Math.max(0, Math.min(20, Math.round(toNum(r.bedrooms)))), titleType: cleanStr(r.titleType, 60) || "Any title", createdAt: toNum(r.createdAt) || Date.now() }; }
export function sanitizeSavedSearches(rec: unknown): SavedSearch[] { return extractItems(rec).map(sanitizeSavedSearch).filter((x): x is SavedSearch => !!x).slice(0, 30); }
function pickEscrowStatus(v: unknown): EscrowStatus { return v === "proof_submitted" || v === "approved" || v === "released" ? v : "awaiting_payment"; }
export function sanitizeEscrow(v: unknown): EscrowPayment | null {
  if (!v || typeof v !== "object") return null; const r = v as Record<string, unknown>;
  const propertyId = cleanStr(r.propertyId, 40); if (!propertyId) return null;
  return { id: cleanStr(r.id, 40) || makeId(), propertyId, propertyCode: cleanStr(r.propertyCode, 24), buyerPi: cleanStr(r.buyerPi, FIELD_CAP), sellerPi: cleanStr(r.sellerPi, FIELD_CAP), amountPi: nonNegPrice(r.amountPi), status: pickEscrowStatus(r.status), txId: cleanStr(r.txId, 180), proofNote: cleanStr(r.proofNote, MSG_CAP), createdAt: toNum(r.createdAt) || Date.now(), updatedAt: toNum(r.updatedAt) || Date.now() };
}
export function sanitizeEscrows(rec: unknown): EscrowPayment[] { return extractItems(rec).map(sanitizeEscrow).filter((x): x is EscrowPayment => !!x).slice(0, 100); }
export function sanitizeAgent(v: unknown): Agent | null { if (!v || typeof v !== "object") return null; const r = v as Record<string, unknown>; const username = cleanStr(r.username, FIELD_CAP); if (!username) return null; return { id: cleanStr(r.id, 40) || makeId(), username, isVerified: r.isVerified === true, propertiesListed: Math.max(0, Math.round(toNum(r.propertiesListed))), createdAt: toNum(r.createdAt) || Date.now() }; }
export function sanitizeAgents(rec: unknown): Agent[] { return extractItems(rec).map(sanitizeAgent).filter((x): x is Agent => !!x).slice(0, 100); }
