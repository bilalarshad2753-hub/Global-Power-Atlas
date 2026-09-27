import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

/* ─── 1. Holographic Targeting Rings ─── */
function HolographicRings() {
  const rings = [
    { size: 140, duration: 20, opacity: 0.18 },
    { size: 110, duration: 15, opacity: 0.14, reverse: true },
    { size: 80, duration: 12, opacity: 0.2 },
  ];

  // Dots that orbit the rings
  const orbitDots = [
    { ring: 140, duration: 8, delay: 0, size: 3 },
    { ring: 140, duration: 8, delay: 4, size: 2 },
    { ring: 110, duration: 6, delay: 1, size: 2.5 },
    { ring: 80, duration: 5, delay: 2, size: 2 },
  ];

  return (
    <div className="relative" style={{ width: 160, height: 160 }}>
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-primary"
          style={{
            width: r.size,
            height: r.size,
            top: "50%",
            left: "50%",
            marginTop: -r.size / 2,
            marginLeft: -r.size / 2,
            opacity: r.opacity,
          }}
          animate={{ rotate: r.reverse ? -360 : 360 }}
          transition={{ duration: r.duration, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Orbiting dots */}
      {orbitDots.map((d, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute"
          style={{
            width: d.ring,
            height: d.ring,
            top: "50%",
            left: "50%",
            marginTop: -d.ring / 2,
            marginLeft: -d.ring / 2,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: d.duration, repeat: Infinity, ease: "linear", delay: d.delay }}
        >
          <div
            className="absolute rounded-full bg-primary"
            style={{
              width: d.size,
              height: d.size,
              top: 0,
              left: "50%",
              marginLeft: -d.size / 2,
              boxShadow: `0 0 ${d.size * 3}px hsl(var(--primary) / 0.6)`,
            }}
          />
        </motion.div>
      ))}
      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40"
        style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.4)" }}
      />
    </div>
  );
}

/* ─── 2. Network Nodes ─── */
const NODES = [
  { x: 10, y: 20 },
  { x: 55, y: 8 },
  { x: 90, y: 30 },
  { x: 30, y: 55 },
  { x: 70, y: 50 },
  { x: 15, y: 85 },
  { x: 50, y: 75 },
  { x: 85, y: 80 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 4], [2, 4],
  [3, 5], [3, 6], [4, 6], [4, 7], [5, 6], [6, 7],
];

function NetworkNodes() {
  return (
    <div className="relative" style={{ width: 120, height: 100 }}>
      <svg width="120" height="100" className="absolute inset-0">
        {EDGES.map(([a, b], i) => (
          <g key={`edge-${i}`}>
            <line
              x1={NODES[a].x * 1.2}
              y1={NODES[a].y * 1.0}
              x2={NODES[b].x * 1.2}
              y2={NODES[b].y * 1.0}
              stroke="hsl(var(--primary))"
              strokeOpacity={0.15}
              strokeWidth={0.5}
            />
            {/* Traveling dot along edge */}
            <circle r="1.2" fill="hsl(var(--primary))" opacity="0.6">
              <animateMotion
                dur={`${3 + i * 0.5}s`}
                repeatCount="indefinite"
                path={`M${NODES[a].x * 1.2},${NODES[a].y} L${NODES[b].x * 1.2},${NODES[b].y}`}
              />
            </circle>
          </g>
        ))}
      </svg>
      {NODES.map((n, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{
            width: 4,
            height: 4,
            left: n.x * 1.2 - 2,
            top: n.y - 2,
            boxShadow: "0 0 6px hsl(var(--primary) / 0.5)",
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ─── 3. Vertical Frame Lines ─── */
function VerticalFrameLines() {
  const ticks = useMemo(() => {
    const t: number[] = [];
    for (let i = 0; i < 20; i++) t.push(i * 14);
    return t;
  }, []);

  return (
    <div className="flex gap-3 h-64">
      {[0, 1].map((lineIdx) => (
        <div key={lineIdx} className="relative w-px h-full">
          {/* Main line */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, transparent, hsl(var(--primary) / 0.3) 20%, hsl(var(--primary) / 0.3) 80%, transparent)`,
            }}
          />
          {/* Ticks */}
          {ticks.map((y, i) => (
            <div
              key={i}
              className="absolute bg-primary/30"
              style={{
                left: lineIdx === 0 ? -3 : 1,
                top: y,
                width: i % 5 === 0 ? 6 : 3,
                height: 0.5,
              }}
            />
          ))}
          {/* Scanning glow */}
          <motion.div
            className="absolute w-px"
            style={{
              left: 0,
              height: 30,
              background: `linear-gradient(180deg, transparent, hsl(var(--primary) / 0.6), transparent)`,
            }}
            animate={{ top: ["0%", "90%", "0%"] }}
            transition={{ duration: 4 + lineIdx * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      ))}
      {/* Small labels between lines */}
      <div className="flex flex-col justify-between py-4 -ml-1">
        {["SEC.A", "SEC.B", "SEC.C", "SEC.D"].map((label, i) => (
          <motion.span
            key={label}
            className="text-[7px] font-mono text-primary/30 tracking-widest"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ─── Existing: Radar Scanner ─── */
function RadarScanner() {
  return (
    <div className="relative w-24 h-24">
      <div className="absolute inset-0 rounded-full border border-primary/30" />
      <div className="absolute inset-3 rounded-full border border-primary/20" />
      <div className="absolute inset-6 rounded-full border border-primary/15" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-primary/15" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-primary/15" />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-px origin-left"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.8), transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 origin-top-left"
          style={{
            width: "50%",
            height: "50%",
            background: "conic-gradient(from 0deg, hsl(var(--primary) / 0.15), transparent 60deg)",
            transformOrigin: "0% 0%",
            borderRadius: "0 100% 0 0",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-primary"
        style={{ top: "30%", left: "60%", boxShadow: "0 0 6px hsl(var(--primary))" }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-accent"
        style={{ top: "55%", left: "35%", boxShadow: "0 0 4px hsl(var(--accent))" }}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
        style={{ boxShadow: "0 0 8px hsl(var(--primary))" }}
      />
    </div>
  );
}

/* ─── Existing: Status Indicators ─── */
const STATUS_ITEMS = [
  { label: "SATELLITE NETWORK", status: "ACTIVE", isGreen: true },
  { label: "DEFENSE GRID", status: "ONLINE", isGreen: true },
  { label: "GLOBAL TRACKING", status: "ENABLED", isGreen: false },
  { label: "SIGNAL UPLINK", status: "STABLE", isGreen: false },
];

function StatusIndicators() {
  return (
    <div className="space-y-1.5">
      {STATUS_ITEMS.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
          className="flex items-center gap-2"
        >
          <motion.div
            className={`w-1 h-1 rounded-full ${item.isGreen ? "bg-glow-green" : "bg-primary"}`}
            style={{
              boxShadow: item.isGreen
                ? "0 0 4px hsl(var(--glow-green))"
                : "0 0 4px hsl(var(--primary))",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
          <span className="text-[9px] font-mono text-muted-foreground tracking-wider">{item.label}</span>
          <span className="text-[8px] font-mono text-primary/40">—</span>
          <span className={`text-[9px] font-mono ${item.isGreen ? "text-glow-green" : "text-primary"} tracking-widest`}>
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Existing: Coordinate Data ─── */
function CoordinateData() {
  const [coords, setCoords] = useState({ lat: 37.7749, lon: -122.4194, alt: 542 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCoords({
        lat: 37.7749 + (Math.random() - 0.5) * 0.002,
        lon: -122.4194 + (Math.random() - 0.5) * 0.002,
        alt: 542 + (Math.random() - 0.5) * 2,
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-0.5 font-mono">
      <div className="text-[9px] text-muted-foreground tracking-wider">
        LAT: <span className="text-primary">{coords.lat.toFixed(4)}°N</span>
      </div>
      <div className="text-[9px] text-muted-foreground tracking-wider">
        LON: <span className="text-primary">{Math.abs(coords.lon).toFixed(4)}°W</span>
      </div>
      <div className="text-[9px] text-muted-foreground tracking-wider">
        ALT: <span className="text-primary">{coords.alt.toFixed(1)}km</span>
      </div>
    </div>
  );
}

/* ─── Main HUD Export ─── */
export default function TacticalHUD() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex gap-3"
    >
      {/* Vertical frame lines on far left edge */}
      <VerticalFrameLines />

      {/* Main content column */}
      <div className="flex flex-col items-start gap-5">
        {/* Holographic targeting rings */}
        <HolographicRings />

        {/* Status indicators */}
        <StatusIndicators />

        {/* Network nodes constellation */}
        <NetworkNodes />

        {/* Radar + coords row */}
        <div className="flex items-center gap-4">
          <RadarScanner />
          <CoordinateData />
        </div>
      </div>
    </motion.div>
  );
}
