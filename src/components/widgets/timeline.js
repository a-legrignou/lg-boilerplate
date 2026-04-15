"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CARD_GAP = 32; // px — gap between staggered cards
const CARD_MIN_H = 220; // px — initial height estimate
const DOT_TOP = 24; // px — mt-6, aligns dot with card top

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, visible];
}

// ---------------------------------------------------------------------------
// ReadButton — mobile only
// ---------------------------------------------------------------------------

function ReadButton({ onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={[
        // layout
        "lg:hidden absolute right-4 bottom-4 z-20",
        "flex items-center gap-1.5 px-3 py-1.5",
        // shape & type
        "rounded-full font-mono text-[11px] uppercase tracking-widest",
        // colors — Tailwind 4 supports arbitrary opacity in class names
        "border border-white/30 text-white/85",
        // glass
        "backdrop-blur-xs",
        // transition
        "transition-all duration-300",
        // state
        active ? "bg-white/18" : "bg-white/12",
      ].join(" ")}>
      {active ? (
        <>
          <span>Fermer</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </>
      ) : (
        <>
          <span>Lire</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5h6M6 3l2 2-2 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

function Card({ block, index, isActive }) {
  const [open, setOpen] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  const assetBase = process.env.NEXT_PUBLIC_DIRECTUS_ASSETS ?? "";
  const imgSrc = block.image ? `${assetBase}${block.image}` : null;

  return (
    <div
      className={[
        // base
        "relative group overflow-hidden cursor-default select-none",
        // Tailwind 4: aspect-[4/3] shorthand
        "aspect-4/3 border",
        // transition
        "transition-all duration-300",
        // active state
        isActive ? "border-t1 shadow-lg shadow-navy/10" : "border-border shadow-none",
      ].join(" ")}>
      {/* ── Background ── */}
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={block.title}
          fill
          className={[
            "object-cover transition-transform duration-700",
            "group-hover:scale-105",
            open ? "scale-105" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      ) : (
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <span
            className={[
              // Tailwind 4: text-[8rem] + font-bold + leading-none
              "font-serif text-[8rem] font-bold leading-none",
              // Tailwind 4: arbitrary opacity on text color
              "text-white/6",
              "transition-opacity duration-300",
              "group-hover:opacity-0",
              open ? "opacity-0" : "",
            ]
              .filter(Boolean)
              .join(" ")}>
            {num}
          </span>
        </div>
      )}

      {/* ── Gradient overlay ── */}
      {/* Tailwind 4: bg-linear-to-b replaces bg-gradient-to-b */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/60 to-transparent" />

      {/* ── Resting state: number + title ── */}
      <div
        className={[
          "absolute inset-x-0 top-0 px-5 pt-5",
          "transition-all duration-300",
          "group-hover:opacity-0 group-hover:translate-y-1",
          open ? "opacity-0 translate-y-1" : "",
        ]
          .filter(Boolean)
          .join(" ")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono  text-white/50">{num}</span>
          <span className="w-3 h-px bg-white/30" />
          <span className="uppercase tracking-wide  text-white/60">{block.subtitle}</span>
        </div>
        <h3 className="font-serif text-3xl text-white leading-snug">{block.title}</h3>
      </div>

      {/* ── Hover / open overlay: description ── */}
      <div
        className={[
          "absolute inset-0",
          "flex flex-col items-center justify-center gap-3",
          "px-10 text-center",
          // Tailwind 4: bg-black/60 + backdrop-blur-xs
          "bg-black/70 backdrop-blur-xs",
          "transition-opacity duration-500",
          "opacity-0 group-hover:opacity-100",
          open ? "opacity-100" : "",
        ]
          .filter(Boolean)
          .join(" ")}>
        <p className="text-justify text-white/75 leading-relaxed ">{block.description}</p>
      </div>

      {/* ── Mobile button ── */}
      <ReadButton onClick={() => setOpen((v) => !v)} active={open} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpineDot
// ---------------------------------------------------------------------------

function SpineDot({ isActive, className = "" }) {
  return (
    <div
      className={[
        // Tailwind 4: size-* utility
        "size-5 rounded-full z-10 shrink-0 border-2",
        "transition-all duration-500",
        isActive ? "bg-navy border-navy shadow-timeline-active" : "bg-cl border-border-md shadow-none",
        className,
      ].join(" ")}
    />
  );
}

// ---------------------------------------------------------------------------
// Mobile timeline
// ---------------------------------------------------------------------------

function MobileItem({ block, index, isLast, isActive }) {
  const [ref, visible] = useInView();

  return (
    <div
      ref={ref}
      className="flex gap-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(18px)",
        // Tailwind 4 doesn't support dynamic transitionDelay in class names — keep inline
        transition: `opacity .5s ease ${index * 90}ms, transform .5s ease ${index * 90}ms`,
      }}>
      {/* Spine */}
      {/* Tailwind 4: w-6.5 = 1.625rem */}
      <div className="flex flex-col items-center shrink-0 w-6.5">
        <SpineDot isActive={isActive} className="mt-6" />
        {!isLast && (
          // Tailwind 4: w-0.5 = 2px
          <div
            className={[
              "flex-1 w-0.5 mt-1.5 transition-colors duration-500",
              isActive ? "bg-t1" : "bg-border",
            ].join(" ")}
          />
        )}
      </div>

      <div className="flex-1 pb-7">
        <Card block={block} index={index} isActive={isActive} />
      </div>
    </div>
  );
}

function MobileTimeline({ blocks, progress }) {
  return (
    <div className="lg:hidden space-y-0">
      {blocks.map((block, i) => (
        <MobileItem
          key={i}
          block={block}
          index={i}
          isLast={i === blocks.length - 1}
          isActive={progress >= (i + 0.5) / blocks.length}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Desktop timeline — staggered absolute layout
// ---------------------------------------------------------------------------

function DesktopItem({ block, index, isActive, side, topOffset, onHeight }) {
  const [ref, visible] = useInView(0.1);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onHeight(index, el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [index, onHeight]);

  const isLeft = side === "left";

  return (
    <>
      {/* Card */}
      <div
        ref={ref}
        className="absolute"
        style={{
          top: topOffset,
          left: isLeft ? 0 : "calc(50% + 40px)",
          right: isLeft ? "calc(50% + 40px)" : 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : `translateY(16px) translateX(${isLeft ? "-8px" : "8px"})`,
          transition: `opacity .55s ease ${index * 80}ms, transform .55s ease ${index * 80}ms`,
        }}>
        <div ref={cardRef}>
          <Card block={block} index={index} isActive={isActive} />
        </div>
      </div>

      {/* Dot — single, centered on spine */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: topOffset + DOT_TOP }}>
        <SpineDot isActive={isActive} />
      </div>
    </>
  );
}

function DesktopTimeline({ blocks, progress }) {
  const [heights, setHeights] = useState(() => blocks.map(() => CARD_MIN_H));

  const handleHeight = useCallback((i, h) => {
    setHeights((prev) => {
      if (prev[i] === h) return prev;
      const next = [...prev];
      next[i] = h;
      return next;
    });
  }, []);

  // Staggered vertical offsets: left col = even indices, right col = odd indices
  const topOffsets = blocks.map((_, i) => {
    if (i % 2 === 0) {
      let top = 0;
      for (let j = 0; j < i; j += 2) top += heights[j] + CARD_GAP * 2;
      return top;
    }
    // Right column starts half a card lower
    let top = heights[0] / 2 + CARD_GAP;
    for (let j = 1; j < i; j += 2) top += heights[j] + CARD_GAP * 2;
    return top;
  });

  const lastLeftIdx = Math.floor((blocks.length - 1) / 2) * 2;
  const lastRightIdx = Math.floor(blocks.length / 2) * 2 - 1;

  const containerH =
    Math.max(
      (topOffsets[lastLeftIdx] ?? 0) + (heights[lastLeftIdx] ?? CARD_MIN_H),
      lastRightIdx >= 0 ? (topOffsets[lastRightIdx] ?? 0) + (heights[lastRightIdx] ?? CARD_MIN_H) : 0,
    ) + CARD_GAP;

  const firstDotY = (topOffsets[0] ?? 0) + DOT_TOP;
  const lastDotY = Math.max(...topOffsets) + DOT_TOP;
  const lineH = lastDotY - firstDotY;

  return (
    <div className="hidden lg:block relative " style={{ height: containerH }}>
      {/* Rail — background track */}
      {/* Tailwind 4: w-0.5 = 2px */}
      <div
        className="absolute z-0 w-0.5 bg-border left-1/2 -translate-x-px"
        style={{ top: firstDotY, height: lineH }}
      />

      {/* Rail — scroll-driven fill */}
      <div
        className="absolute z-0 w-0.5 left-1/2 -translate-x-px overflow-hidden"
        style={{ top: firstDotY, height: lineH }}>
        {/* Tailwind 4: bg-linear-to-b + from-* + to-* */}
        <div
          className="w-full bg-linear-to-b from-navy from-60% to-t1 transition-[height] duration-150 ease-linear"
          style={{ height: `${Math.min(progress * 100, 100)}%` }}
        />
      </div>

      {blocks.map((block, i) => (
        <DesktopItem
          key={i}
          block={block}
          index={i}
          side={i % 2 === 0 ? "left" : "right"}
          topOffset={topOffsets[i]}
          isActive={progress >= (i + 0.5) / blocks.length}
          onHeight={handleHeight}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Export — accepts blocks directly; section wrapper lives in the RSC parent
// ---------------------------------------------------------------------------

export default function Timeline({ blocks }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      setProgress(Math.min(Math.max((window.innerHeight * 0.62 - top) / (height * 0.88), 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!blocks.length) return null;

  return (
    <div ref={containerRef} suppressHydrationWarning>
      <MobileTimeline blocks={blocks} progress={progress} />
      <DesktopTimeline blocks={blocks} progress={progress} />
    </div>
  );
}
