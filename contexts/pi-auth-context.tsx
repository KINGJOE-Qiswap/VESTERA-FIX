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
    const initPi = async () => {
      try {
        // Check if in Pi Browser
        if (typeof window !== 'undefined' && (window as any).Pi) {
          const Pi = (window as any).Pi;
          await Pi.init({ version: "2.0", sandbox: false });
          setIsReady(true);
          setAuthMessage("Pi is ready. Tap Continue to sign in.");
        } else {
          // Not in Pi Browser - load SDK script
          const script = document.createElement('script');
          script.src = 'https://sdk.minepi.com/pi-sdk.js';
          script.onload = () => {
            const Pi = (window as any).Pi;
            if (Pi) {
              Pi.init({ version: "2.0", sandbox: false }).then(() => {
                setIsReady(true);
                setAuthMessage("Pi is ready. Tap Continue to sign in.");
              });
            } else {
              setIsReady(true);
              // AUTO-DETECT Pi Browser
const isPiBrowser = navigator.userAgent.includes("PiBrowser") || (window as any).Pi || window.location.href.includes("pi://");

if (isPiBrowser) {
  setAuthMessage("Pi Browser detected - Initializing Pi...");
  // Force load Pi SDK immediately
  if ((window as any).Pi) {
    const Pi = (window as any).Pi;
    Pi.init({ version: "2.0", sandbox: false });
  }
} else {
  setAuthMessage("Open in Pi Browser for full Pi features");
}
            }
          };
          script.onerror = () => {
            setIsReady(true);
            setAuthMessage("Please open in Pi Browser to continue.");
          };
          document.body.appendChild(script);
        }
      } catch (err) {
        console.error(err);
        setIsReady(true);
        setAuthMessage("Please open in Pi Browser.");
      }
    };
    initPi();
  }, []);

  const login = async () => {
    try {
      const Pi = (window as any).Pi;
      if (!Pi) {
        alert("Please open this app in Pi Browser:\nhttps://minepi.com/pi-browser/");
        window.open("https://minepi.com/pi-browser/", "_blank");
        return;
      }
      setAuthMessage("Authenticating...");
      const auth = await Pi.authenticate(['username', 'payments'], () => {});
      setUsername(auth.user.username);
      setIsAuthenticated(true);
      setAuthMessage(`Welcome ${auth.user.username}!`);
    } catch (err: any) {
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
