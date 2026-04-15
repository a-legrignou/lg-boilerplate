export const Beamlines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Horizontal beam lines */}
      <div className="beam-line animate-beam w-80 top-[20%] left-0" style={{ animationDelay: "0s" }} />
      <div className="beam-line animate-beam-reverse w-40 top-[35%] right-0" style={{ animationDelay: "2s" }} />
      <div className="beam-line animate-beam w-60 top-[60%] left-0" style={{ animationDelay: "4s" }} />
      <div className="beam-line animate-beam-reverse w-20 top-[80%] right-0" style={{ animationDelay: "1s" }} />

      {/* Moving glow on beams */}
      <div className="beam-glow animate-beam top-[20%]" style={{ animationDelay: "0.5s" }} />
      <div className="beam-glow animate-beam-reverse top-[60%]" style={{ animationDelay: "3s" }} />

      {/* Vertical beam lines */}
      <div className="beam-line-vertical animate-beam-vertical h-37.5 left-[15%]" style={{ animationDelay: "0s" }} />
      <div className="beam-line-vertical animate-beam-vertical h-20 left-[35%]" style={{ animationDelay: "1s" }} />
      <div className="beam-line-vertical animate-beam-vertical h-40 left-[65%]" style={{ animationDelay: "3s" }} />
      <div className="beam-line-vertical animate-beam-vertical h-60 left-[85%]" style={{ animationDelay: "3s" }} />

      {/* Static decorative lines */}
      <div className="absolute top-0 left-[10%] w-px h-full bg-linear-to-b from-transparent via-border/30 to-transparent" />
      <div className="absolute top-0 left-[90%] w-px h-full bg-linear-to-b from-transparent via-border/30 to-transparent" />
      <div className="absolute top-[30%] left-0 w-full h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />
      <div className="absolute top-[70%] left-0 w-full h-px bg-linear-to-r from-transparent via-border/20 to-transparent" />
    </div>
  );
};
