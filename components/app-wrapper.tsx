"use client";

import type { ReactNode } from "react";
import { PiAuthProvider } from "@/contexts/pi-auth-context";

export default function AppWrapper({ children }: { children: ReactNode }) {
  return <PiAuthProvider>{children}</PiAuthProvider>;
}
