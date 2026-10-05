"use client";

import { useEffect, useState } from "react";
import { VesteraProvider, useVestera } from "@/contexts/vestera-context";
import type { Listing } from "@/lib/vestera/data";
import { NavProvider } from "@/components/vestera/nav";
import { BottomNav } from "@/components/vestera/bottom-nav";
import { BrowseScreen } from "@/components/vestera/browse-screen";
import { SearchScreen } from "@/components/vestera/search-screen";
import { SellScreen } from "@/components/vestera/sell-screen";
import { ChatScreen } from "@/components/vestera/chat-screen";
import { AccountScreen } from "@/components/vestera/account-screen";
import { ListingDetail } from "@/components/vestera/listing-detail";
import { ListingEditor } from "@/components/vestera/listing-editor";
import { AdminServices } from "@/components/vestera/admin-services";
import { LegalDirectory } from "@/components/vestera/legal-directory";
import { PrivacyPolicy } from "@/components/vestera/privacy-policy";
import { EscrowScreen } from "@/components/vestera/escrow-screen";
import { NigeriaMatScreen } from "@/components/vestera/nigeria-mat-screen";
import { AgentDashboard } from "@/components/vestera/agent-dashboard";
import { LoadingScreen, StorageNotice, ToastHost } from "@/components/vestera/pieces";

type ServiceState = { open: boolean; listing: Listing | null };

function Shell() {
  const { ready, tab, openChatForListing, setTab } = useVestera();

  const [listingId, setListingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | "new" | null>(null);
  const [service, setService] = useState<ServiceState>({ open: false, listing: null });
  const [legalOpen, setLegalOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  useEffect(() => {
    window.history.pushState({ vestera: true }, "", window.location.href);
    const handleBack = () => {
      setListingId(null);
      setEditId(null);
      setService({ open: false, listing: null });
      setLegalOpen(false);
      setPrivacyOpen(false);
      setTab("browse");
      window.history.pushState({ vestera: true }, "", window.location.href);
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [setTab]);

  if (!ready) return <LoadingScreen />;

  const nav = {
    openListing: (id: string) => setListingId(id),
    newListing: () => setEditId("new"),
    editListing: (id: string) => {
      setEditId(id);
      setListingId(null);
    },
    openServices: (listing: Listing | null) => setService({ open: true, listing }),
    openLegal: () => setLegalOpen(true),
    openPrivacy: () => setPrivacyOpen(true),
    openChatFor: (listing: Listing) => {
      openChatForListing(listing);
      setTab("chat");
    },
    goBrowseWith: () => setTab("browse"),
  };

  return (
    <NavProvider value={nav}>
      <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-[var(--vst-bg)]">
        <main key={tab} className="vst-fade-in vst-no-scrollbar flex-1 overflow-y-auto">
          {tab === "browse" ? <BrowseScreen /> : null}
          {tab === "search" ? <SearchScreen /> : null}
          {tab === "sell" ? <SellScreen /> : null}
          {tab === "chat" ? <ChatScreen /> : null}
          {tab === "account" ? <AccountScreen /> : null}
          {tab === "escrow" ? <EscrowScreen /> : null}
          {tab === "nigeria" ? <NigeriaMatScreen /> : null}
          {tab === "agent" ? <AgentDashboard /> : null}
        </main>

        <BottomNav />

        {listingId ? <ListingDetail listingId={listingId} onClose={() => setListingId(null)} /> : null}
        {editId ? <ListingEditor editId={editId} onClose={() => setEditId(null)} /> : null}
        {service.open ? (
          <AdminServices listing={service.listing} onClose={() => setService({ open: false, listing: null })} />
        ) : null}
        {legalOpen ? <LegalDirectory onClose={() => setLegalOpen(false)} /> : null}
        {privacyOpen ? <PrivacyPolicy onClose={() => setPrivacyOpen(false)} /> : null}

        <ToastHost />
        <StorageNotice />
      </div>
    </NavProvider>
  );
}

export function VesteraApp() {
  return (
    <VesteraProvider>
      <Shell />
    </VesteraProvider>
  );
}
