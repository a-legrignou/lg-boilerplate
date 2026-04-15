// components/Marquee.tsx
"use client";

import React from "react";

const Marquee = ({ text, path, duration = 20 }) => {
  const mobileDuration = duration / 2;
  return (
    <div
      className="absolute left-0 top-16 overflow-hidden whitespace-nowrap bg-card text-xl text-white z-20 py-5 w-full"
      style={{ "--marquee-duration": `${duration}s` }}>
      <div className="inline-block animate-marquee">
        {text}
        {path && (
          <>
            &nbsp;—&nbsp;
            <a
              href={path}
              className="underline text-secondary hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer">
              En savoir plus
            </a>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(100vw);
          }
          to {
            transform: translateX(-80%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee var(--marquee-duration) linear infinite;
        }
        /* Accélérer sur mobile */
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: ${mobileDuration}s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Marquee;
