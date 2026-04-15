"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CookieConsentContext = createContext(undefined);

export const CookieConsentProvider = ({ children }) => {
  const [consent, setConsent] = useState(null); // null = undecided | "accepted" | "refused"

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (stored === "accepted" || stored === "refused") setConsent(stored);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setConsent("accepted");
  };

  const refuse = () => {
    localStorage.setItem("cookie_consent", "refused");
    setConsent("refused");
  };

  const reset = () => {
    localStorage.removeItem("cookie_consent");
    setConsent(null);
  };

  return (
    <CookieConsentContext.Provider value={{ consent, accept, refuse, reset }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return context;
};
