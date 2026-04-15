"use client";

import { useState } from "react";
import { Facebook, Instagram, Linkedin, Plus } from "lucide-react";

export default function FabMenu() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  const socialLinks = [
    { Icon: Instagram, url: "https://www.instagram.com/hyperion.connect/",                        label: "Instagram" },
    { Icon: Linkedin,  url: "https://www.linkedin.com/company/hyperion-connect-officiel",          label: "LinkedIn" },
    { Icon: Facebook,  url: "https://www.facebook.com/profile.php?id=61579575857676",              label: "Facebook" },
  ];

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 z-50">
      {/* Social buttons */}
      {open &&
        socialLinks.map(({ Icon, url, label }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Nous suivre sur ${label} (nouvel onglet)`}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
            <Icon size={20} aria-hidden="true" />
          </a>
        ))}

      {/* Main FAB button */}
      <button
        onClick={toggleMenu}
        aria-expanded={open}
        aria-label={open ? "Fermer le menu réseaux sociaux" : "Ouvrir le menu réseaux sociaux"}
        className={`w-12 h-12 bg-orange-500 text-white rounded-full shadow-xl flex items-center justify-center transform transition-transform focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 ${
          open ? "rotate-45" : "rotate-0"
        }`}>
        <Plus size={20} aria-hidden="true" />
      </button>
    </div>
  );
}
