import { motion } from "framer-motion";

function VerticalScanLine({ left, delay }: { left: string; delay: number }) {
  return (
    <div className="absolute top-0 bottom-0" style={{ left }}>
      <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
      <motion.div
        className="absolute left-[-3px] w-2 h-2 rounded-full bg-primary/80"
        style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.6), 0 0 24px hsl(var(--primary) / 0.25)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
      />
    </div>
  );
}

function CornerBracket({ position, size = 70 }: { position: "top" | "bottom"; size?: number }) {
  const isTop = position === "top";
  return (
    <div className={`absolute right-0 ${isTop ? "top-0" : "bottom-0"}`}>
      <div
        className="bg-gradient-to-l from-primary/50 to-transparent"
        style={{ width: size, height: 2, marginLeft: "auto" }}
      />
      <div
        className={`absolute right-0 ${isTop ? "top-0" : "bottom-0"} bg-gradient-to-${isTop ? "b" : "t"} from-primary/50 to-transparent`}
        style={{ width: 2, height: size }}
      />
      <motion.div
        className={`absolute right-[-3px] ${isTop ? "top-[-3px]" : "bottom-[-3px]"} w-[7px] h-[7px] rounded-full bg-primary/70`}
        style={{ boxShadow: "0 0 10px hsl(var(--primary) / 0.6)" }}
        animate={{ opacity: [0.3, 0.9, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

function HoloDashes() {
  return (
    <div className="flex flex-col gap-4 items-end">
      {[0, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1].map((delay, i) => (
        <motion.div
          key={i}
          className="h-[2px] rounded-full"
          style={{
            width: `${40 + (i % 3) * 18}px`,
            background: `linear-gradient(270deg, hsl(var(--primary) / 0.5), hsl(var(--primary) / 0.05))`,
            boxShadow: "0 0 8px hsl(var(--primary) / 0.25)",
          }}
          animate={{ opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: 2.5, repeat: Infinity, delay }}
        />
      ))}
    </div>
  );
}

function RotatingArc() {
  return (
    <div className="relative w-24 h-24 ml-auto mr-0">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 96 96" className="w-full h-full">
          <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.7" />
          <path d="M 48 6 A 42 42 0 0 1 90 48" fill="none" stroke="hsl(var(--primary) / 0.45)" strokeWidth="2" strokeLinecap="round" />
          <path d="M 90 48 A 42 42 0 0 1 72 82" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* Middle ring */}
      <motion.div
        className="absolute inset-3"
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 72 72" className="w-full h-full">
          <circle cx="36" cy="36" r="30" fill="none" stroke="hsl(var(--primary) / 0.07)" strokeWidth="0.5" />
          <path d="M 36 66 A 30 30 0 0 1 6 36" fill="none" stroke="hsl(var(--primary) / 0.35)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* Inner ring */}
      <motion.div
        className="absolute inset-6"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <circle cx="24" cy="24" r="18" fill="none" stroke="hsl(var(--primary) / 0.06)" strokeWidth="0.5" />
          <path d="M 24 6 A 18 18 0 0 1 42 24" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </motion.div>
      {/* Center dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/50"
        style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.4)" }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  );
}

function PulsingDots() {
  const dots = [
    { top: 0, left: 20, delay: 0 },
    { top: 28, left: 0, delay: 0.6 },
    { top: 28, left: 40, delay: 1.2 },
    { top: 14, left: 40, delay: 0.3 },
    { top: 14, left: 10, delay: 0.9 },
  ];
  return (
    <div className="relative w-12 h-8 ml-auto mr-4">
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/50"
          style={{
            top: d.top,
            left: d.left,
            boxShadow: "0 0 8px hsl(var(--primary) / 0.4)",
          }}
          animate={{ opacity: [0.1, 0.8, 0.1], scale: [0.6, 1.4, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: d.delay }}
        />
      ))}
    </div>
  );
}

function HoloLine() {
  return (
    <motion.div
      className="rounded-full ml-auto"
      style={{
        width: 80,
        height: 2,
        background: "linear-gradient(270deg, hsl(var(--primary) / 0.4), transparent)",
        boxShadow: "0 0 10px hsl(var(--primary) / 0.2)",
      }}
      animate={{ opacity: [0.15, 0.5, 0.15] }}
      transition={{ duration: 4, repeat: Infinity }}
    />
  );
}

export default function GlobeHUD() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="absolute left-[5%] md:left-[8%] top-[5%] bottom-[5%] z-10 pointer-events-none hidden md:flex flex-col items-end justify-between w-[160px]"
    >
      <VerticalScanLine left="calc(100% - 1px)" delay={0} />
      <VerticalScanLine left="calc(100% - 50px)" delay={2.5} />

      <HoloDashes />

      <HoloLine />

      <RotatingArc />

      <HoloLine />

      {/* Text */}
      <div className="flex flex-col gap-2 items-end pr-2">
        <motion.div
          className="h-[1px] w-12 rounded-full ml-auto"
          style={{
            background: "linear-gradient(270deg, hsl(var(--primary) / 0.5), transparent)",
            boxShadow: "0 0 6px hsl(var(--primary) / 0.15)",
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.p
          className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-primary/70 leading-relaxed text-right"
          style={{ textShadow: "0 0 12px hsl(var(--primary) / 0.4)" }}
          animate={{ opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          Curiosity is
          <br />
          a curse &amp;
          <br />
          there is no
          <br />
          going back
        </motion.p>
        <motion.div
          className="h-[1px] w-8 rounded-full ml-auto"
          style={{
            background: "linear-gradient(270deg, hsl(var(--primary) / 0.4), transparent)",
            boxShadow: "0 0 6px hsl(var(--primary) / 0.12)",
          }}
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.3 }}
        />
      </div>

      <PulsingDots />
    </motion.div>
  );
}
