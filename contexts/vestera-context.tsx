"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { KeyWriter, storeOf } from "@/lib/vestera/store";
import {
  ADMIN_SERVICES,
  escrowToBlob,
  agentsToBlob,
  sanitizeEscrows,
  sanitizeAgents,
  sanitizeSavedSearches,
  savedSearchesToBlob,
  buildSeedListings,
  buildSeedPractitioners,
  chatsToBlob,
  inspectionsToBlob,
  listingsToBlob,
  makeCode,
  makeId,
  ME_ID,
  practitionersToBlob,
  prefsToBlob,
  PROPERTY_TYPE_MAP,
  sanitizeChats,
  sanitizeInspections,
  sanitizeListings,
  sanitizePractitioners,
  sanitizePrefs,
  sanitizeServiceReqs,
  servicesToBlob,
  SERVICE_MAP,
  type Agent,
  type ChatThread,
  type EscrowPayment,
  type InspectionRequest,
  type Listing,
  type ListingStatus,
  type Practitioner,
  type PropertyType,
  type ServiceRequest,
  type ServiceStatus,
  type SavedSearch,
  type TabId,
} from "@/lib/vestera/data";

const K_PREFS = "vestera.prefs";
const K_LISTINGS = "vestera.listings";
const K_INSPECTIONS = "vestera.inspections";
const K_SERVICES = "vestera.services";
const K_CHATS = "vestera.chats";
const K_PRACTITIONERS = "vestera.practitioners";
const K_ESCROW = "vestera.escrow";
const K_AGENTS = "vestera.agents";
const K_SAVED_SEARCHES = "vestera.saved-searches";

export interface Toast {
  id: string;
  text: string;
  tone: "ok" | "info" | "warn";
}

export interface ListingInput {
  title: string;
  propertyType: PropertyType;
  description: string;
  location: string;
  sizeLabel: string;
  bedrooms: number;
  priceInPi: number;
  photoQueries: string[];
  region?: import("@/lib/vestera/data").NigeriaRegion;
  state?: string;
  titleType?: string;
  isVerifiedNg?: boolean;
  agentId?: string;
}

export interface PractitionerInput {
  piUsername: string;
  lawFirm: string;
  location: string;
  email: string;
  specialties: string[];
}

interface VesteraCtx {
  ready: boolean;
  storageTrouble: boolean;
  now: number;

  tab: TabId;
  setTab: (t: TabId) => void;

  name: string;
  email: string;
  setProfile: (name: string, email: string) => void;

  allListings: Listing[];
  myListings: Listing[];
  getListing: (id: string) => Listing | undefined;
  isOwn: (l: Listing) => boolean;
  addListing: (input: ListingInput) => string;
  updateListing: (id: string, input: ListingInput) => void;
  setListingStatus: (id: string, status: ListingStatus) => void;
  deleteListing: (id: string) => void;

  inspections: InspectionRequest[];
  sentInspections: InspectionRequest[];
  receivedInspections: InspectionRequest[];
  requestInspection: (listing: Listing, note: string) => void;

  serviceRequests: ServiceRequest[];
  requestService: (listing: Listing | null, serviceId: string, practitioner: Practitioner | null, note: string) => void;

  chats: ChatThread[];
  getChat: (id: string) => ChatThread | undefined;
  openChatForListing: (listing: Listing) => string;
  sendMessage: (threadId: string, text: string) => void;
  activeChatId: string | null;
  setActiveChat: (id: string | null) => void;

  practitioners: Practitioner[];
  registerPractitioner: (input: PractitionerInput) => void;

  escrows: EscrowPayment[];
  createEscrow: (listing: Listing) => void;
  submitEscrowProof: (id: string, proofNote: string, txId: string) => void;
  approveEscrowRelease: (id: string) => void;
  agents: Agent[];
  registerAgent: (username: string) => void;
  savedSearches: SavedSearch[];
  saveSearch: (search: Omit<SavedSearch, "id" | "createdAt">) => void;
  deleteSavedSearch: (id: string) => void;

  toasts: Toast[];
  toast: (text: string, tone?: Toast["tone"]) => void;
}

const Ctx = createContext<VesteraCtx | undefined>(undefined);

const PEER_REPLIES = [
  "Thank you for your interest. The property is available for viewing this week.",
  "Happy to arrange an inspection at a time that suits you.",
  "Yes, the price is set at Global Consensus Value. Documents are in order.",
  "I can share the survey plan and title reference on request.",
  "Feel free to request VESTERA Admin Services for the due diligence.",
];

export function VesteraProvider({ children }: { children: ReactNode }) {
  const { sdk, isAuthenticated } = usePiAuth();

  const [ready, setReady] = useState(false);
  const [storageTrouble, setStorageTrouble] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const [tab, setTabState] = useState<TabId>("browse");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [ownListings, setOwnListings] = useState<Listing[]>([]);
  const [inspections, setInspections] = useState<InspectionRequest[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [ownPractitioners, setOwnPractitioners] = useState<Practitioner[]>([]);
  const [escrows, setEscrows] = useState<EscrowPayment[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [activeChatId, setActiveChat] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const seedListings = useMemo(() => buildSeedListings(Date.now()), []);
  const seedPractitioners = useMemo(() => buildSeedPractitioners(Date.now()), []);

  const writerRef = useRef<KeyWriter | null>(null);
  const tabRef = useRef(tab);
  const nameRef = useRef(name);
  const emailRef = useRef(email);
  const ownListingsRef = useRef(ownListings);
  const inspectionsRef = useRef(inspections);
  const servicesRef = useRef(serviceRequests);
  const chatsRef = useRef(chats);
  const practitionersRef = useRef(ownPractitioners);
  const escrowsRef = useRef(escrows);
  const agentsRef = useRef(agents);
  const savedSearchesRef = useRef(savedSearches);

  tabRef.current = tab;
  nameRef.current = name;
  emailRef.current = email;
  ownListingsRef.current = ownListings;
  inspectionsRef.current = inspections;
  servicesRef.current = serviceRequests;
  chatsRef.current = chats;
  practitionersRef.current = ownPractitioners;
  escrowsRef.current = escrows;
  agentsRef.current = agents;
  savedSearchesRef.current = savedSearches;

  const displayName = name.trim() || "Pi Pioneer";

  const toast = (text: string, tone: Toast["tone"] = "info") => {
    const id = makeId();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  // load
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const store = storeOf(sdk);
    const writer = new KeyWriter(store, (v) => setStorageTrouble(v));
    writerRef.current = writer;

    (async () => {
      try {
        const [prefsRec, listRec, inspRec, svcRec, chatRec, pracRec, escrowRec, agentsRec, savedSearchesRec] = await Promise.all([
          store.get(K_PREFS), store.get(K_LISTINGS), store.get(K_INSPECTIONS), store.get(K_SERVICES), store.get(K_CHATS), store.get(K_PRACTITIONERS), store.get(K_ESCROW), store.get(K_AGENTS), store.get(K_SAVED_SEARCHES),
        ]);
        if (cancelled) return;
        const prefs = sanitizePrefs(prefsRec);
        setTabState(prefs.tab);
        setName(prefs.name);
        setEmail(prefs.email);
        setOwnListings(sanitizeListings(listRec));
        setInspections(sanitizeInspections(inspRec));
        setServiceRequests(sanitizeServiceReqs(svcRec));
        setChats(sanitizeChats(chatRec));
        setOwnPractitioners(sanitizePractitioners(pracRec));
        setEscrows(sanitizeEscrows(escrowRec));
        setAgents(sanitizeAgents(agentsRec));
        setSavedSearches(sanitizeSavedSearches(savedSearchesRec));
      } catch {
        /* fresh start */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    const onHide = () => writerRef.current?.flushNow();
    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [isAuthenticated, sdk]);

  // clock ticker for relative times + simulated status progression
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(t);
  }, []);

  const commitPrefs = () => {
    writerRef.current?.now(K_PREFS, () =>
      prefsToBlob({ tab: tabRef.current, name: nameRef.current, email: emailRef.current }),
    );
  };
  const commitListings = () => {
    writerRef.current?.now(K_LISTINGS, () => listingsToBlob(ownListingsRef.current));
  };
  const commitInspections = () => {
    writerRef.current?.now(K_INSPECTIONS, () => inspectionsToBlob(inspectionsRef.current));
  };
  const commitServices = () => {
    writerRef.current?.now(K_SERVICES, () => servicesToBlob(servicesRef.current));
  };
  const commitChats = () => {
    writerRef.current?.now(K_CHATS, () => chatsToBlob(chatsRef.current));
  };
  const commitPractitioners = () => {
    writerRef.current?.now(K_PRACTITIONERS, () => practitionersToBlob(practitionersRef.current));
  };
  const commitEscrows = () => writerRef.current?.now(K_ESCROW, () => escrowToBlob(escrowsRef.current));
  const commitAgents = () => writerRef.current?.now(K_AGENTS, () => agentsToBlob(agentsRef.current));
  const commitSavedSearches = () => writerRef.current?.now(K_SAVED_SEARCHES, () => savedSearchesToBlob(savedSearchesRef.current));

  const setTab = (t: TabId) => {
    setTabState(t);
    tabRef.current = t;
    commitPrefs();
  };
  const setProfile = (n: string, e: string) => {
    setName(n);
    setEmail(e);
    nameRef.current = n;
    emailRef.current = e;
    commitPrefs();
    // reflect new display name on own listings
    setOwnListings((prev) => {
      const next = prev.map((l) => ({ ...l, ownerName: n.trim() || "Pi Pioneer" }));
      ownListingsRef.current = next;
      return next;
    });
    commitListings();
    toast("Profile updated", "ok");
  };

  const allListings = useMemo(() => {
    return [...ownListings, ...seedListings];
  }, [ownListings, seedListings]);

  const getListing = (id: string) => allListings.find((l) => l.id === id);
  const isOwn = (l: Listing) => l.ownerId === ME_ID;

  const myListings = ownListings;

  const addListing = (input: ListingInput): string => {
    const id = makeId();
    const ts = Date.now();
    const meta = PROPERTY_TYPE_MAP[input.propertyType];
    const listing: Listing = {
      id,
      code: makeCode(),
      ownerId: ME_ID,
      ownerName: displayName,
      ownerVerified: true,
      title: input.title.trim(),
      propertyType: input.propertyType,
      description: input.description.trim(),
      location: input.location.trim(),
      sizeLabel: input.sizeLabel.trim(),
      bedrooms: meta.showBedrooms ? Math.max(0, Math.round(input.bedrooms)) : 0,
      priceInPi: Math.max(0, input.priceInPi),
      photos: input.photoQueries
        .map((q, i) => ({ id: `p${i}`, hue: meta.hue, query: q.trim() || `${meta.label} exterior` }))
        .slice(0, 6),
      status: "available",
      createdAt: ts,
      updatedAt: ts,
      region: input.region,
      state: input.state?.trim(),
      titleType: input.titleType?.trim(),
      isVerifiedNg: input.isVerifiedNg,
      agentId: input.agentId,
      isVerifiedAgent: false,
    };
    setOwnListings((prev) => {
      const next = [listing, ...prev];
      ownListingsRef.current = next;
      return next;
    });
    commitListings();
    toast(`Listing published · ${listing.code}`, "ok");
    return id;
  };

  const updateListing = (id: string, input: ListingInput) => {
    setOwnListings((prev) => {
      const next = prev.map((l) => {
        if (l.id !== id) return l;
        const meta = PROPERTY_TYPE_MAP[input.propertyType];
        return {
          ...l,
          title: input.title.trim(),
          propertyType: input.propertyType,
          description: input.description.trim(),
          location: input.location.trim(),
          sizeLabel: input.sizeLabel.trim(),
          bedrooms: meta.showBedrooms ? Math.max(0, Math.round(input.bedrooms)) : 0,
          priceInPi: Math.max(0, input.priceInPi),
          photos: input.photoQueries
            .map((q, i) => ({ id: `p${i}`, hue: meta.hue, query: q.trim() || `${meta.label} exterior` }))
            .slice(0, 6),
          updatedAt: Date.now(),
          region: input.region,
          state: input.state?.trim(),
          titleType: input.titleType?.trim(),
          isVerifiedNg: input.isVerifiedNg,
        };
      });
      ownListingsRef.current = next;
      return next;
    });
    commitListings();
    toast("Listing updated", "ok");
  };

  const setListingStatus = (id: string, status: ListingStatus) => {
    setOwnListings((prev) => {
      const next = prev.map((l) => (l.id === id ? { ...l, status, updatedAt: Date.now() } : l));
      ownListingsRef.current = next;
      return next;
    });
    commitListings();
    toast(`Marked ${status === "under_offer" ? "under offer" : status}`, "ok");
  };

  const deleteListing = (id: string) => {
    setOwnListings((prev) => {
      const next = prev.filter((l) => l.id !== id);
      ownListingsRef.current = next;
      return next;
    });
    commitListings();
    toast("Listing removed", "info");
  };

  const requestInspection = (listing: Listing, note: string) => {
    const ts = Date.now();
    const own = listing.ownerId === ME_ID;
    const req: InspectionRequest = {
      id: makeId(),
      listingId: listing.id,
      listingCode: listing.code,
      listingTitle: listing.title,
      ownerId: listing.ownerId,
      ownerName: listing.ownerName,
      requesterName: displayName,
      direction: own ? "received" : "sent",
      note: note.trim(),
      status: "pending",
      createdAt: ts,
    };
    setInspections((prev) => {
      const next = [req, ...prev];
      inspectionsRef.current = next;
      return next;
    });
    commitInspections();
    toast("Inspection requested", "ok");
  };

  const requestService = (
    listing: Listing | null,
    serviceId: string,
    practitioner: Practitioner | null,
    note: string,
  ) => {
    const svc = SERVICE_MAP[serviceId] ?? ADMIN_SERVICES[0];
    const req: ServiceRequest = {
      id: makeId(),
      listingId: listing?.id ?? "",
      listingCode: listing?.code ?? "",
      listingTitle: listing?.title ?? "",
      serviceId: svc.id,
      serviceName: svc.name,
      practitionerId: practitioner?.id ?? null,
      practitionerName: practitioner?.piUsername ?? "",
      note: note.trim(),
      status: "requested",
      createdAt: Date.now(),
    };
    setServiceRequests((prev) => {
      const next = [req, ...prev];
      servicesRef.current = next;
      return next;
    });
    commitServices();
    toast(`${svc.name} requested`, "ok");
  };

  const getChat = (id: string) => chats.find((c) => c.id === id);

  const openChatForListing = (listing: Listing): string => {
    const existing = chatsRef.current.find((c) => c.listingId === listing.id);
    if (existing) {
      setActiveChat(existing.id);
      return existing.id;
    }
    const id = makeId();
    const thread: ChatThread = {
      id,
      listingId: listing.id,
      listingCode: listing.code,
      listingTitle: listing.title,
      peerName: listing.ownerName,
      peerVerified: listing.ownerVerified,
      messages: [],
      updatedAt: Date.now(),
    };
    setChats((prev) => {
      const next = [thread, ...prev];
      chatsRef.current = next;
      return next;
    });
    commitChats();
    setActiveChat(id);
    return id;
  };

  const sendMessage = (threadId: string, text: string) => {
    const clean = text.trim();
    if (!clean) return;
    const ts = Date.now();
    setChats((prev) => {
      const next = prev.map((c) =>
        c.id === threadId
          ? {
              ...c,
              messages: [...c.messages, { id: makeId(), from: "me" as const, text: clean, at: ts }].slice(-60),
              updatedAt: ts,
            }
          : c,
      );
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      chatsRef.current = next;
      return next;
    });
    commitChats();

    // simulated peer reply
    setTimeout(() => {
      const reply = PEER_REPLIES[Math.floor(Math.random() * PEER_REPLIES.length)];
      const rts = Date.now();
      setChats((prev) => {
        const next = prev.map((c) =>
          c.id === threadId
            ? {
                ...c,
                messages: [...c.messages, { id: makeId(), from: "peer" as const, text: reply, at: rts }].slice(-60),
                updatedAt: rts,
              }
            : c,
        );
        next.sort((a, b) => b.updatedAt - a.updatedAt);
        chatsRef.current = next;
        return next;
      });
      commitChats();
    }, 1600);
  };

  const registerPractitioner = (input: PractitionerInput) => {
    const p: Practitioner = {
      id: makeId(),
      piUsername: input.piUsername.trim(),
      lawFirm: input.lawFirm.trim(),
      location: input.location.trim(),
      email: input.email.trim(),
      specialties: input.specialties.filter(Boolean).slice(0, 6),
      approval: "pending",
      createdAt: Date.now(),
    };
    setOwnPractitioners((prev) => {
      const next = [p, ...prev];
      practitionersRef.current = next;
      return next;
    });
    commitPractitioners();
    toast("Registration submitted for approval", "ok");
  };

  const practitioners = useMemo(() => [...ownPractitioners, ...seedPractitioners], [ownPractitioners, seedPractitioners]);

  const createEscrow = (listing: Listing) => {
    const item: EscrowPayment = { id: makeId(), propertyId: listing.id, propertyCode: listing.code, buyerPi: displayName, sellerPi: listing.ownerName, amountPi: listing.priceInPi, status: "awaiting_payment", txId: "", proofNote: "", createdAt: Date.now(), updatedAt: Date.now() };
    setEscrows((prev) => { const next = [item, ...prev]; escrowsRef.current = next; return next; }); commitEscrows(); toast("Escrow record created. Complete payment in Pi Wallet.", "info");
  };
  const submitEscrowProof = (id: string, proofNote: string, txId: string) => { setEscrows((prev) => { const next = prev.map((e) => e.id === id ? { ...e, proofNote: proofNote.trim(), txId: txId.trim(), status: "proof_submitted" as const, updatedAt: Date.now() } : e); escrowsRef.current = next; return next; }); commitEscrows(); toast("Payment proof submitted", "ok"); };
  const approveEscrowRelease = (id: string) => { setEscrows((prev) => { const next = prev.map((e) => e.id === id ? { ...e, status: "released" as const, updatedAt: Date.now() } : e); escrowsRef.current = next; return next; }); commitEscrows(); toast("Escrow approved and released", "ok"); };
  const registerAgent = (username: string) => { const agent: Agent = { id: makeId(), username: username.trim(), isVerified: false, propertiesListed: 0, createdAt: Date.now() }; setAgents((prev) => { const next = [agent, ...prev]; agentsRef.current = next; return next; }); commitAgents(); toast("Agent application submitted", "ok"); };
  const saveSearch = (search: Omit<SavedSearch, "id" | "createdAt">) => { const item: SavedSearch = { ...search, id: makeId(), createdAt: Date.now() }; setSavedSearches((prev) => { const next = [item, ...prev].slice(0, 30); savedSearchesRef.current = next; return next; }); commitSavedSearches(); toast(`Search saved as ${item.name}`, "ok"); };
  const deleteSavedSearch = (id: string) => { setSavedSearches((prev) => { const next = prev.filter((s) => s.id !== id); savedSearchesRef.current = next; return next; }); commitSavedSearches(); };

  const sentInspections = useMemo(() => inspections.filter((i) => i.direction === "sent"), [inspections]);
  const receivedInspections = useMemo(() => inspections.filter((i) => i.direction === "received"), [inspections]);

  const value: VesteraCtx = {
    ready,
    storageTrouble,
    now,
    tab,
    setTab,
    name,
    email,
    setProfile,
    allListings,
    myListings,
    getListing,
    isOwn,
    addListing,
    updateListing,
    setListingStatus,
    deleteListing,
    inspections,
    sentInspections,
    receivedInspections,
    requestInspection,
    serviceRequests,
    requestService,
    chats,
    getChat,
    openChatForListing,
    sendMessage,
    activeChatId,
    setActiveChat,
    practitioners,
    registerPractitioner,
    escrows,
    createEscrow,
    submitEscrowProof,
    approveEscrowRelease,
    agents,
    registerAgent,
    savedSearches,
    saveSearch,
    deleteSavedSearch,
    toasts,
    toast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useVestera() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVestera must be used within VesteraProvider");
  return ctx;
}

export function displayNameFor(name: string): string {
  return name.trim() || "Pi Pioneer";
}
