"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Listing } from "@/lib/vestera/data";

interface NavCtx {
  openListing: (id: string) => void;
  newListing: () => void;
  editListing: (id: string) => void;
  openServices: (listing: Listing | null) => void;
  openLegal: () => void;
  openPrivacy: () => void;
  openChatFor: (listing: Listing) => void;
  goBrowseWith: (preset: { query?: string }) => void;
}

const Ctx = createContext<NavCtx | undefined>(undefined);

export function NavProvider({ value, children }: { value: NavCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNav() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
