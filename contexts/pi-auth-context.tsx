"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type PiAuthContextType = {
  isReady: boolean;
  piReady: boolean;
  isAuthenticated: boolean;
  isAuth: boolean;
  username: string | null;
  user: any;
  authMessage: string;
  hasError: boolean;
  error: string | null;
  isInitializing: boolean;
  isInit: boolean;
  login: () => Promise<void>;
  continueAuthentication: () => Promise<void>;
  retry: () => void;
  retryAuthentication: () => void;
};

const PiAuthContext = createContext<PiAuthContextType>({
  isReady: false,
  piReady: false,
  isAuthenticated: false,
  isAuth: false,
  username: null,
  user: null,
  authMessage: "Initializing Pi Network...",
  hasError: false,
  error: null,
  isInitializing: true,
  isInit: true,
  login: async () => {},
  continueAuthentication: async () => {},
  retry: () => {},
  retryAuthentication: () => {},
});

export const usePiAuth = () => useContext(PiAuthContext);

export function PiAuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const initPi = useCallback(async () => {
    let cancelled = false;
    let tries = 0;
    const init = async () => {
      // Wait a little for SDK from layout.tsx to load
      while (!(window as any).Pi && tries < 20 && !cancelled) {
        await new Promise((r) => setTimeout(r, 200));
        tries++;
      }
      if (cancelled) return;
      const Pi = (window as any).Pi || null;
      if (Pi) {
        try {
          // New SDK style - no sandbox param
          await Pi.init({ version: "2.0" });
          setIsReady(true);
          setIsInitializing(false);
          setAuthMessage("Pi is ready. Tap Continue to sign in.");
          return;
        } catch (err) {
          console.error(err);
        }
      }
      // No Pi = not in Pi Browser, don't hang - let user continue
      setIsReady(true);
      setIsInitializing(false);
      const isPiBrowser =
        typeof navigator !== "undefined" &&
        (navigator.userAgent.includes("PiBrowser") || (window as any).Pi);
      if (!isPiBrowser) {
        setAuthMessage("Open in Pi Browser for full Pi features");
      } else {
        setAuthMessage("Pi SDK not detected - Initializing Pi...");
      }
    };
    init();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { initPi(); }, [initPi]);

  const login = async () => {
  
    setAuthMessage("Continue clicked - checking Pi...");
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
    
        if (typeof window !== "undefined" && !window.open("https://minepi.com/pi-browser/", "_blank")) {}
        setAuthMessage("Please open this app in Pi Browser");
        return;
      }
      setAuthMessage("Authenticating...");
      const auth = await Pi.authenticate(["username"],(payment: any) => {
        console.log("Incomplete payment:", payment);
      });
      setIsAuthenticated(true);
      setUsername(auth.user.username);
      setAuthMessage(`Welcome ${auth.user.username}`);
    } catch (err) {
      console.error(err);
      setError("Auth failed. Try in Pi Browser");
      setAuthMessage("Auth Failed. Please try in Pi Browser");
    }
  };

  const retry = () => {
    setError(null);
    setIsInitializing(true);
    setAuthMessage("Retrying...");
    initPi();
  };

  return (
    <PiAuthContext.Provider
      value={{
        isReady,
        piReady: isReady,
        isAuthenticated,
        isAuth: isAuthenticated,
        username,
        user: username ? { username } : null,
        authMessage,
        hasError: !!error,
        error,
        isInitializing,
        isInit: isInitializing,
        login,
        continueAuthentication: login,
        retry,
        retryAuthentication: retry,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  );
}
