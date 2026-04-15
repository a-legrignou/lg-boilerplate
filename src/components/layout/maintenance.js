"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Gear path generator ─────────────────────────────────────────────────────
function gearPath(cx, cy, outerR, innerR, teeth) {
  const step = (Math.PI * 2) / teeth;
  const pts = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step - Math.PI / 2;
    const q = step / 4;
    const half = step / 2;
    pts.push(`${(cx + Math.cos(a - q) * outerR).toFixed(2)},${(cy + Math.sin(a - q) * outerR).toFixed(2)}`);
    pts.push(`${(cx + Math.cos(a) * outerR).toFixed(2)},${(cy + Math.sin(a) * outerR).toFixed(2)}`);
    pts.push(`${(cx + Math.cos(a + q) * outerR).toFixed(2)},${(cy + Math.sin(a + q) * outerR).toFixed(2)}`);
    pts.push(`${(cx + Math.cos(a + half) * innerR).toFixed(2)},${(cy + Math.sin(a + half) * innerR).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

// Pre-computed gear paths (module-level constants)
const LARGE_GEAR = gearPath(95, 108, 62, 50, 12);
const MEDIUM_GEAR = gearPath(182, 62, 40, 32, 9);
const SMALL_GEAR = gearPath(44, 50, 24, 19, 7);
const SPOKE_ANGLES = [0, 60, 120, 180, 240, 300].map((deg) => ({
  x2: (95 + Math.cos((deg * Math.PI) / 180) * 42).toFixed(2),
  y2: (108 + Math.sin((deg * Math.PI) / 180) * 42).toFixed(2),
}));

// ─── Countdown hook ──────────────────────────────────────────────────────────
function useCountdown(target) {
  const calc = useCallback(() => {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [target]);

  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [calc]);
  return t;
}

// ─── Countdown unit with flip animation ─────────────────────────────────────
function CountdownUnit({ value, label }) {
  const [animKey, setAnimKey] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const t = setTimeout(() => setAnimKey((k) => k + 1), 0);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center liquid-glass border border-border/40 rounded-xl overflow-hidden">
        <span
          key={animKey}
          suppressHydrationWarning
          className="mnt-flip font-mono text-2xl sm:text-3xl font-bold text-foreground select-none">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Animated gears illustration ────────────────────────────────────────────
function GearsIllustration() {
  return (
    <svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full">
      <defs>
        <radialGradient id="mnt-glow" cx="50%" cy="54%" r="50%">
          <stop offset="0%" stopOpacity="0.07" stopColor="currentColor" />
          <stop offset="100%" stopOpacity="0" stopColor="currentColor" />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <rect width="240" height="200" fill="url(#mnt-glow)" className="text-primary" />

      {/* Small gear — top-left, fastest */}
      <g style={{ transformOrigin: "44px 50px", animation: "mnt-spin 8s linear infinite" }}>
        <path d={SMALL_GEAR} fill="currentColor" fillOpacity="0.12" className="text-muted-foreground" />
        <circle cx="44" cy="50" r="8.5" fill="currentColor" className="text-background" />
        <circle cx="44" cy="50" r="3" fill="currentColor" fillOpacity="0.25" className="text-muted-foreground" />
      </g>

      {/* Medium gear — top-right, reverse */}
      <g style={{ transformOrigin: "182px 62px", animation: "mnt-spin 15s linear infinite reverse" }}>
        <path d={MEDIUM_GEAR} fill="currentColor" fillOpacity="0.18" className="text-secondary" />
        <circle cx="182" cy="62" r="14" fill="currentColor" className="text-background" />
        <circle cx="182" cy="62" r="5" fill="currentColor" fillOpacity="0.35" className="text-secondary" />
      </g>

      {/* Large gear — center, slow */}
      <g style={{ transformOrigin: "95px 108px", animation: "mnt-spin 24s linear infinite" }}>
        <path d={LARGE_GEAR} fill="currentColor" fillOpacity="0.16" className="text-primary" />
        {/* Spokes */}
        {SPOKE_ANGLES.map(({ x2, y2 }, i) => (
          <line
            key={i}
            x1="95" y1="108"
            x2={x2} y2={y2}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeOpacity="0.12"
            className="text-primary"
          />
        ))}
        <circle cx="95" cy="108" r="18" fill="currentColor" className="text-background" />
        <circle cx="95" cy="108" r="7" fill="currentColor" fillOpacity="0.3" className="text-primary" />
      </g>

      {/* Floating decorative dots */}
      <circle cx="190" cy="155" r="3" fill="currentColor" fillOpacity="0.14" className="text-primary" />
      <circle cx="203" cy="169" r="2" fill="currentColor" fillOpacity="0.18" className="text-secondary" />
      <circle cx="178" cy="163" r="2" fill="currentColor" fillOpacity="0.10" className="text-primary" />
      <circle cx="24" cy="136" r="3" fill="currentColor" fillOpacity="0.14" className="text-secondary" />
      <circle cx="14" cy="123" r="2" fill="currentColor" fillOpacity="0.10" className="text-primary" />
      <circle cx="226" cy="88" r="4" fill="currentColor" fillOpacity="0.08" className="text-muted-foreground" />
      <circle cx="216" cy="143" r="2.5" fill="currentColor" fillOpacity="0.08" className="text-muted-foreground" />
    </svg>
  );
}

// ─── Main maintenance layout ─────────────────────────────────────────────────
export default function MaintenanceLayout({ title, message, returnDate, image, contactEmail }) {
  const finalTitle = title || "Nous revenons très vite";
  const finalMessage =
    message ||
    "Notre équipe met les dernières touches à de belles améliorations. Le service sera rétabli sous peu — merci pour votre patience.";
  const finalReturnDate = returnDate || "2026-06-01T08:00:00Z";
  const finalContactEmail = contactEmail || "support@example.com";

  const { days, hours, minutes, seconds } = useCountdown(finalReturnDate);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Keyframes */}
      <style>{`
        @keyframes mnt-spin { to { transform: rotate(360deg); } }
        @keyframes mnt-flip {
          0%   { transform: translateY(0);     opacity: 1; }
          40%  { transform: translateY(-10px); opacity: 0; }
          60%  { transform: translateY(10px);  opacity: 0; }
          100% { transform: translateY(0);     opacity: 1; }
        }
        .mnt-flip { animation: mnt-flip 0.42s ease-in-out; }
      `}</style>

      {/* Background image — very subtle */}
      {image && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Image
            src={process.env.NEXT_PUBLIC_DIRECTUS_ASSETS + image}
            alt=""
            fill
            className="object-cover opacity-10 dark:opacity-5"
            priority
          />
        </div>
      )}

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" aria-hidden="true" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, color-mix(in oklch, var(--color-primary) 7%, transparent), transparent)",
        }}
      />

      {/* Main content */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 lg:py-20"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* ── Left column: text + countdown ── */}
          <div className="flex flex-col items-center lg:items-start gap-8 text-center lg:text-left order-2 lg:order-1">

            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-14 border border-gold-14 text-gold text-xs font-semibold uppercase tracking-wider">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
              </span>
              Maintenance en cours
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                {finalTitle}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                {finalMessage}
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-start gap-2 sm:gap-3 flex-wrap justify-center lg:justify-start">
              <CountdownUnit value={days} label="Jours" />
              <span className="mt-5 sm:mt-6 text-xl font-light text-muted-foreground/30 select-none">:</span>
              <CountdownUnit value={hours} label="Heures" />
              <span className="mt-5 sm:mt-6 text-xl font-light text-muted-foreground/30 select-none">:</span>
              <CountdownUnit value={minutes} label="Minutes" />
              <span className="mt-5 sm:mt-6 text-xl font-light text-muted-foreground/30 select-none">:</span>
              <CountdownUnit value={seconds} label="Secondes" />
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center lg:items-start gap-3 pt-1">
              <p className="text-sm text-muted-foreground">Une question ?</p>
              <Link
                href={`mailto:${finalContactEmail}`}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-background/70 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-muted/60 transition-colors duration-200">
                <svg
                  className="w-4 h-4 shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {finalContactEmail}
              </Link>
            </div>
          </div>

          {/* ── Right column: SVG illustration ── */}
          <div className="flex items-center justify-center order-1 lg:order-2">
            <div className="w-52 h-52 sm:w-72 sm:h-72 lg:w-96 lg:h-96 opacity-80 dark:opacity-55">
              <GearsIllustration />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
