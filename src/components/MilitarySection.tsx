import { useState, useEffect, useMemo, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CountryData, getMaxValues } from "@/data/countries";
import CountryFlag from "./CountryFlag";

interface MilitarySectionProps {
  selectedCountries: CountryData[];
}

const militaryCategories = [
  { key: "nuclearWarheads", label: "Nuclear", icon: "☢️", anim: { scale: [1, 1.3, 1], rotate: [0, 360] }, dur: 3 },
  { key: "missiles", label: "Missiles", icon: "🚀", anim: { y: [0, -8, 0], rotate: [-5, 5, -5] }, dur: 2 },
  { key: "airDefenseSystems", label: "Air Def", icon: "📡", anim: { rotateY: [0, 360] }, dur: 4 },
  { key: "budget", label: "Budget", icon: "💰", anim: { scale: [1, 1.15, 1] }, dur: 2.5 },
  { key: "fighterJets", label: "Jets", icon: "✈️", anim: { x: [-5, 5, -5], y: [-2, 2, -2] }, dur: 3 },
  { key: "helicopters", label: "Helis", icon: "🚁", anim: { y: [-4, 2, -4] }, dur: 2 },
  { key: "drones", label: "Drones", icon: "🛸", anim: { x: [-3, 3, -3], y: [-2, 2, -2] }, dur: 3.5 },
  { key: "aircraftCarriers", label: "Carriers", icon: "🚢", anim: { x: [-2, 2, -2], rotate: [-2, 2, -2] }, dur: 4 },
  { key: "warships", label: "Ships", icon: "⚓", anim: { rotate: [0, 6, -6, 0] }, dur: 3 },
  { key: "submarines", label: "Subs", icon: "🔱", anim: { y: [0, 4, 0], opacity: [1, 0.6, 1] }, dur: 4 },
  { key: "personnel", label: "Troops", icon: "🎖️", anim: { y: [0, -2, 0] }, dur: 1.5 },
  { key: "tanks", label: "Tanks", icon: "🛡️", anim: { x: [0, 3, 0] }, dur: 2.5 },
  { key: "armoredVehicles", label: "Armor", icon: "🚛", anim: { x: [-2, 2, -2] }, dur: 3 },
  { key: "artillery", label: "Artillery", icon: "💥", anim: { scale: [1, 1.2, 0.95, 1] }, dur: 1.8 },
  { key: "rifles", label: "Arms", icon: "🔫", anim: { rotate: [-5, 5, -5] }, dur: 2.5 },
];

const countryColors = [
  { stroke: "hsl(190, 100%, 50%)", fill: "hsla(190, 100%, 50%, 0.12)", text: "text-primary", hsl: "190 100% 50%" },
  { stroke: "hsl(38, 100%, 55%)", fill: "hsla(38, 100%, 55%, 0.12)", text: "text-accent", hsl: "38 100% 55%" },
  { stroke: "hsl(150, 80%, 45%)", fill: "hsla(150, 80%, 45%, 0.12)", text: "text-glow-green", hsl: "150 80% 45%" },
  { stroke: "hsl(0, 80%, 55%)", fill: "hsla(0, 80%, 55%, 0.12)", text: "text-destructive", hsl: "0 80% 55%" },
];

const formatValue = (key: string, v: number): string => {
  if (key === "budget") return `$${v}B`;
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString();
};

const Counter = ({ value, formatKey }: { value: number; formatKey: string }) => {
  const [d, setD] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const inc = value / 60;
    let f: number;
    const tick = () => {
      s += inc;
      if (s >= value) { setD(value); return; }
      setD(Math.floor(s));
      f = requestAnimationFrame(tick);
    };
    f = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(f);
  }, [value, inView]);
  return <span ref={ref}>{formatValue(formatKey, d)}</span>;
};

/* ── Radial Weapon Spoke ── */
const WeaponSpoke = ({
  category,
  angle,
  selectedCountries,
  maxValue,
  index,
  totalCategories,
  expanded,
  onToggle,
}: {
  category: typeof militaryCategories[0];
  angle: number;
  selectedCountries: CountryData[];
  maxValue: number;
  index: number;
  totalCategories: number;
  expanded: string | null;
  onToggle: (key: string) => void;
}) => {
  const isExpanded = expanded === category.key;
  const rad = (angle * Math.PI) / 180;
  const radius = 42; // % from center
  const iconX = 50 + radius * Math.cos(rad);
  const iconY = 50 + radius * Math.sin(rad);

  const sorted = useMemo(
    () =>
      selectedCountries
        .map((c, ci) => ({ country: c, value: (c.military as any)[category.key] as number, ci }))
        .sort((a, b) => b.value - a.value),
    [selectedCountries, category.key]
  );

  const topValue = sorted[0]?.value ?? 0;
  const topPct = maxValue > 0 ? topValue / maxValue : 0;

  // Spoke line length based on top country value
  const spokeEnd = 12 + topPct * 30;
  const endX = 50 + spokeEnd * Math.cos(rad);
  const endY = 50 + spokeEnd * Math.sin(rad);

  return (
    <g className="cursor-pointer" onClick={() => onToggle(category.key)}>
      {/* Spoke line */}
      <motion.line
        x1="50" y1="50" x2={endX} y2={endY}
        stroke={`hsla(${countryColors[0].hsl} / 0.15)`}
        strokeWidth="0.3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: index * 0.06, duration: 0.8 }}
      />

      {/* Country value dots along spoke */}
      {sorted.map(({ value, ci }, si) => {
        const pct = maxValue > 0 ? value / maxValue : 0;
        const dotDist = 12 + pct * 30;
        const dx = 50 + dotDist * Math.cos(rad);
        const dy = 50 + dotDist * Math.sin(rad);
        const color = countryColors[ci % countryColors.length];
        return (
          <motion.circle
            key={ci}
            cx={dx} cy={dy}
            r={isExpanded ? 1.8 - si * 0.2 : 1.2 - si * 0.15}
            fill={color.stroke}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{ delay: index * 0.06 + si * 0.1 + 0.3, duration: 0.5 }}
            style={{ filter: `drop-shadow(0 0 3px ${color.stroke})` }}
          />
        );
      })}

      {/* Connecting lines between country dots */}
      {sorted.length > 1 && sorted.map(({ value, ci }, si) => {
        if (si === 0) return null;
        const prevPct = maxValue > 0 ? sorted[si - 1].value / maxValue : 0;
        const curPct = maxValue > 0 ? value / maxValue : 0;
        const p1 = 12 + prevPct * 30;
        const p2 = 12 + curPct * 30;
        return (
          <line
            key={`line-${ci}`}
            x1={50 + p1 * Math.cos(rad)} y1={50 + p1 * Math.sin(rad)}
            x2={50 + p2 * Math.cos(rad)} y2={50 + p2 * Math.sin(rad)}
            stroke={`hsla(${countryColors[sorted[si - 1].ci % countryColors.length].hsl} / 0.2)`}
            strokeWidth="0.2"
          />
        );
      })}
    </g>
  );
};

/* ── Main Component ── */
const MilitarySection = ({ selectedCountries }: MilitarySectionProps) => {
  const maxValues = useMemo(() => getMaxValues(), []);
  const [expanded, setExpanded] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-50px" });

  const toggleExpand = (key: string) => {
    setExpanded(prev => prev === key ? null : key);
  };

  const expandedCat = expanded ? militaryCategories.find(c => c.key === expanded) : null;
  const expandedData = useMemo(() => {
    if (!expandedCat) return [];
    return selectedCountries
      .map((c, ci) => ({ country: c, value: (c.military as any)[expandedCat.key] as number, ci }))
      .sort((a, b) => b.value - a.value);
  }, [expandedCat, selectedCountries]);

  return (
    <div ref={containerRef} className="relative">
      {/* Country legend */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        {selectedCountries.map((c, ci) => {
          const color = countryColors[ci % countryColors.length];
          return (
            <div key={c.id} className="flex items-center gap-1 sm:gap-2">
              <div
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                style={{ background: color.stroke, boxShadow: `0 0 8px ${color.stroke}` }}
              />
              <CountryFlag code={c.code} name={c.name} size="sm" />
                <span className="font-display text-[8px] sm:text-[10px] font-bold tracking-wider text-foreground">
                  {c.name}
                </span>
            </div>
          );
        })}
      </div>

      {/* Radar + Detail Layout */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 sm:gap-8 lg:gap-16 xl:gap-24 mb-4 sm:mb-8 lg:mb-12">
        {/* Radar Circle */}
        <div className="relative flex-1 min-w-0 w-full max-w-[260px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-none mx-auto lg:mx-0" style={{ aspectRatio: "1/1" }}>
          {/* Rotating scan line */}
          {inView && (
            <motion.div
              className="absolute inset-0 z-0"
              style={{ transformOrigin: "center center" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-[2px]"
                style={{
                  transformOrigin: "left center",
                  background: "linear-gradient(90deg, hsl(var(--primary) / 0.4), transparent)",
                }}
              />
            </motion.div>
          )}

          <svg viewBox="0 0 100 100" className="w-full h-full relative z-10">
            {/* Concentric rings */}
            {[20, 30, 40].map((r) => (
              <circle
                key={r}
                cx="50" cy="50" r={r}
                fill="none"
                stroke="hsl(var(--border) / 0.2)"
                strokeWidth="0.2"
                strokeDasharray="1 1.5"
              />
            ))}

            {/* Cross hairs */}
            <line x1="50" y1="8" x2="50" y2="92" stroke="hsl(var(--border) / 0.1)" strokeWidth="0.15" />
            <line x1="8" y1="50" x2="92" y2="50" stroke="hsl(var(--border) / 0.1)" strokeWidth="0.15" />

            {/* Radar polygon per country */}
            {selectedCountries.map((country, ci) => {
              const color = countryColors[ci % countryColors.length];
              const points = militaryCategories.map((cat, i) => {
                const angle = (i / militaryCategories.length) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const val = (country.military as any)[cat.key] as number;
                const max = (maxValues as any)[cat.key];
                const pct = max > 0 ? val / max : 0;
                const dist = 8 + pct * 34;
                return `${50 + dist * Math.cos(rad)},${50 + dist * Math.sin(rad)}`;
              });
              return (
                <motion.polygon
                  key={country.id}
                  points={points.join(" ")}
                  fill={color.fill}
                  stroke={color.stroke}
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: ci * 0.2, duration: 1, ease: "easeOut" }}
                  style={{ transformOrigin: "50px 50px" }}
                />
              );
            })}

            {/* Weapon spokes + dots */}
            {militaryCategories.map((cat, i) => {
              const angle = (i / militaryCategories.length) * 360 - 90;
              return (
                <WeaponSpoke
                  key={cat.key}
                  category={cat}
                  angle={angle}
                  selectedCountries={selectedCountries}
                  maxValue={(maxValues as any)[cat.key]}
                  index={i}
                  totalCategories={militaryCategories.length}
                  expanded={expanded}
                  onToggle={toggleExpand}
                />
              );
            })}

            {/* Center dot */}
            <circle cx="50" cy="50" r="2" fill="hsl(var(--primary) / 0.3)" />
            <circle cx="50" cy="50" r="0.8" fill="hsl(var(--primary))" style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary)))" }} />
          </svg>

          {/* Weapon icons around radar (HTML overlay) */}
          {militaryCategories.map((cat, i) => {
            const angle = (i / militaryCategories.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const iconRadius = 44;
            const x = 50 + iconRadius * Math.cos(rad);
            const y = 50 + iconRadius * Math.sin(rad);
            const isActive = expanded === cat.key;

            return (
              <motion.div
                key={cat.key}
                className="absolute z-20 flex flex-col items-center cursor-pointer"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.3, duration: 0.4 }}
                onClick={() => toggleExpand(cat.key)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className={`text-sm sm:text-lg md:text-xl ${isActive ? "drop-shadow-lg" : ""}`}
                  animate={cat.anim}
                  transition={{ duration: cat.dur, repeat: Infinity, ease: "easeInOut" }}
                >
                  {cat.icon}
                </motion.span>
                <span
                  className={`font-display text-[5px] sm:text-[6px] md:text-[7px] font-bold tracking-wider uppercase leading-none mt-0.5 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {cat.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="flex-1 min-w-0 w-full pt-3">
          <AnimatePresence mode="wait">
            {expandedCat ? (
              <motion.div
                key={expandedCat.key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <motion.span
                    className="text-2xl sm:text-3xl"
                    animate={expandedCat.anim}
                    transition={{ duration: expandedCat.dur, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {expandedCat.icon}
                  </motion.span>
                  <div>
                    <h3 className="font-display text-xs sm:text-sm font-bold tracking-wider uppercase text-primary glow-text">
                      {expandedCat.label}
                    </h3>
                    <div className="h-px w-12 sm:w-16 mt-1" style={{ background: "linear-gradient(90deg, hsl(var(--primary)), transparent)" }} />
                  </div>
                </div>

                {expandedData.map(({ country, value, ci }, rank) => {
                  const color = countryColors[ci % countryColors.length];
                  const topVal = expandedData[0]?.value || 1;
                  const pct = (value / topVal) * 100;
                  return (
                    <motion.div
                      key={country.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.08 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] sm:text-[10px] font-bold text-muted-foreground w-4">
                            #{rank + 1}
                          </span>
                          <CountryFlag code={country.code} name={country.name} size="sm" />
                          <span className="font-display text-[10px] sm:text-[11px] font-bold tracking-wider text-foreground">
                            {country.name}
                          </span>
                        </div>
                        <span className={`font-mono text-[10px] sm:text-xs font-bold ${color.text}`}>
                          <Counter value={value} formatKey={expandedCat.key} />
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted) / 0.3)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${color.stroke}, ${color.stroke}88)`,
                            boxShadow: `0 0 8px ${color.stroke}66`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1.2, delay: rank * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full py-6 sm:py-12 lg:py-0"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl sm:text-4xl mb-2 sm:mb-3"
                >
                  🎯
                </motion.div>
                <p className="font-display text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground text-center">
                  Select a weapon category
                </p>
                <p className="font-body text-[10px] text-muted-foreground/60 mt-1 text-center">
                  Tap any icon on the radar
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MilitarySection;
