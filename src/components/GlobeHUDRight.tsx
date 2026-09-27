import { motion } from "framer-motion";

function HexGrid() {
  const hexes = [0, 0.4, 0.8, 1.2, 1.6];
  return (
    <div className="flex flex-col gap-2 items-start">
      {hexes.map((delay, i) => (
        <motion.div
          key={i}
          className="flex gap-1"
          animate={{ opacity: [0.15, 0.6, 0.15] }}
          transition={{ duration: 3, repeat: Infinity, delay }}
        >
          {[0, 1, 2].map((j) => (
            <div
              key={j}
              className="w-3 h-3 rotate-45 border border-primary/30"
              style={{
                background: j === 1 ? "hsl(var(--primary) / 0.08)" : "transparent",
                boxShadow: j === 1 ? "0 0 8px hsl(var(--primary) / 0.15)" : "none",
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

function DataStream() {
  return (
    <div className="flex flex-col gap-3 items-start">
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((delay, i) => (
        <motion.div
          key={i}
          className="h-[2px] rounded-full"
          style={{
            width: `${30 + (i % 4) * 14}px`,
            background: "linear-gradient(90deg, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.05))",
            boxShadow: "0 0 6px hsl(var(--primary) / 0.2)",
          }}
          animate={{ opacity: [0.1, 0.65, 0.1] }}
          transition={{ duration: 2.8, repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}

function CrosshairReticle() {
  return (
    <div className="relative w-20 h-20">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 80 80" className="w-full h-full">
          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--primary) / 0.08)" strokeWidth="0.5" />
          <path d="M 40 6 A 34 34 0 0 1 74 40" fill="none" stroke="hsl(var(--primary) / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 6 40 A 34 34 0 0 1 40 74" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute inset-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--primary) / 0.06)" strokeWidth="0.5" />
          <path d="M 24 42 A 18 18 0 0 1 6 24" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* Crosshair lines */}
      <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute left-1/2 top-2 bottom-2 w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40"
        style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.3)" }}
        animate={{ opacity: [0.2, 0.7, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function CornerBracketLeft({ position }: { position: "top" | "bottom" }) {
  const isTop = position === "top";
  return (
    <div className={`absolute left-0 ${isTop ? "top-0" : "bottom-0"}`}>
      <div
        className="bg-gradient-to-r from-primary/50 to-transparent"
        style={{ width: 70, height: 2 }}
      />
      <div
        className={`absolute left-0 ${isTop ? "top-0" : "bottom-0"}`}
        style={{
          width: 2,
          height: 70,
          background: `linear-gradient(${isTop ? "to bottom" : "to top"}, hsl(var(--primary) / 0.5), transparent)`,
        }}
      />
      <motion.div
        className={`absolute left-[-3px] ${isTop ? "top-[-3px]" : "bottom-[-3px]"} w-[7px] h-[7px] rounded-full bg-primary/70`}
        style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.6)" }}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

function VerticalScanLine({ left, delay }: { left: string; delay: number }) {
  return (
    <div className="absolute top-0 bottom-0" style={{ left }}>
      <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <motion.div
        className="absolute left-[-3px] w-2 h-2 rounded-full bg-primary/80"
        style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.6)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function GlobeHUDRight() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="absolute right-[5%] md:right-[8%] top-[5%] bottom-[5%] z-10 pointer-events-none hidden md:flex flex-col items-start justify-between w-[160px]"
    >
      <VerticalScanLine left="0px" delay={1.2} />
      <VerticalScanLine left="50px" delay={3.5} />

      <HexGrid />

      {/* Main text */}
      <div className="flex flex-col gap-2 pl-4">
        <motion.div
          className="h-[1px] w-16 rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary) / 0.5), transparent)",
            boxShadow: "0 0 8px hsl(var(--primary) / 0.2)",
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.p
          className="font-display text-[11px] font-bold tracking-[0.25em] uppercase text-primary/70 leading-relaxed"
          style={{ textShadow: "0 0 12px hsl(var(--primary) / 0.4)" }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          Make Earth
          <br />
          a Better
          <br />
          Home
        </motion.p>
        <motion.div
          className="h-[1px] w-12 rounded-full"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary) / 0.4), transparent)",
            boxShadow: "0 0 6px hsl(var(--primary) / 0.15)",
          }}
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      <CrosshairReticle />

      <DataStream />

      
    </motion.div>
  );
}
