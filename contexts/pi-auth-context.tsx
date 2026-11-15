"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type PiAuthContextType = {
  isReady: boolean;
  isAuthenticated: boolean;
  username: string | null;
  login: () => Promise<void>;
  authMessage: string;
};

const PiAuthContext = createContext<PiAuthContextType>({
  isReady: false,
  isAuthenticated: false,
  username: null,
  login: async () => {},
  authMessage: "Initializing...",
});

export const usePiAuth = () => useContext(PiAuthContext);

export function PiAuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    const initPi = async () => {
      // Wait a little for SDK from layout.tsx to load
      while (!(window as any).Pi && tries < 20 && !cancelled) {
        await new Promise((r) => setTimeout(r, 200));
        tries++;
      }

      if (cancelled) return;

      const Pi = (window as any).Pi;

      if (Pi) {
        try {
          // New SDK style - no sandbox param
          await Pi.init({ version: "2.0" });
          setIsReady(true);
          setAuthMessage("Pi is ready. Tap Continue to sign in.");
          return;
        } catch (err) {
          console.error(err);
        }
      }

      // No Pi = not in Pi Browser, don't hang - let user continue
      setIsReady(true);
      const isPiBrowser =
        typeof navigator !== "undefined" &&
        (navigator.userAgent.includes("PiBrowser") ||
          (window as any).ReactNativeWebView);
      if (isPiBrowser) {
        setAuthMessage("Pi Browser detected - Initializing Pi...");
      } else {
        setAuthMessage("Open in Pi Browser for full Pi features");
      }
    };

    initPi();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        alert("Please open this app in Pi Browser");
        window.open("https://minepi.com/pi-browser/", "_blank");
        return;
      }
      setAuthMessage("Authenticating...");
      const auth = await Pi.authenticate(["username", "payments"], (payment: any) => {
        console.log("Incomplete payment:", payment);
      });
      setIsAuthenticated(true);
      setUsername(auth.user.username);
      setAuthMessage(`Welcome ${auth.user.username}`);
    } catch (err) {
      console.error(err);
      setAuthMessage("Auth failed. Try in Pi Browser.");
      alert("Auth failed - Please open in Pi Browser app");
    }
  };

  return (
    <PiAuthContext.Provider value={{ isReady, isAuthenticated, username, login, authMessage }}>
      {children}
    </PiAuthContext.Provider>
  );
}
