"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 flex items-center justify-center border border-border bg-background text-t2 hover:border-navy hover:text-navy transition-colors shadow-sm">
      <ArrowUp className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}
