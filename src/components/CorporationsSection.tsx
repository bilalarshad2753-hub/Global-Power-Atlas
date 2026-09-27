import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryData, Company } from "@/data/countries";
import CountryFlag from "./CountryFlag";

interface CorporationsSectionProps {
  selectedCountries: CountryData[];
}

const formatValuation = (v: number) => {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}T`;
  if (v >= 1) return `$${v.toFixed(0)}B`;
  return `$${(v * 1000).toFixed(0)}M`;
};

const glowColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--glow-green))",
  "hsl(var(--glow-red))",
];

const HexInlineCard = ({
  company,
  index,
  countryIndex,
}: {
  company: Company;
  index: number;
  countryIndex: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const glowColor = glowColors[countryIndex % glowColors.length];

  return (
    <motion.div
      className="relative cursor-pointer flex-shrink-0"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.4, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex flex-col items-center"
        animate={{
          scale: isHovered ? 1.08 : 1,
          y: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Glow background */}
        <motion.div
          className="absolute -inset-2 rounded-xl"
          animate={{
            opacity: isHovered ? 0.25 : 0,
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{ background: glowColor, filter: "blur(12px)" }}
        />

        <div
          className="relative w-[60px] sm:w-[72px] md:w-[90px] rounded-lg p-1.5 sm:p-2 md:p-2.5 flex flex-col items-center gap-1 sm:gap-1.5 border transition-all duration-300"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, hsl(var(--panel) / 0.98), hsl(var(--panel) / 0.85))`
              : `linear-gradient(135deg, hsl(var(--panel) / 0.9), hsl(var(--panel) / 0.6))`,
            borderColor: isHovered ? `${glowColor}60` : `hsl(var(--border) / 0.3)`,
            boxShadow: isHovered ? `0 4px 20px ${glowColor}25` : 'none',
          }}
        >
          {/* Logo */}
          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--muted)))` }}>
            {!imgError ? (
              <img src={`https://www.google.com/s2/favicons?domain=${company.logo}&sz=64`} alt={company.name} className="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded" onError={() => setImgError(true)} loading="lazy" />
            ) : (
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center font-display font-bold text-[8px] sm:text-[9px]" style={{ background: `${glowColor}20`, color: glowColor }}>{company.name.charAt(0)}</div>
            )}
          </div>

          {/* Name */}
          <span className="font-display text-[6px] sm:text-[7px] font-bold tracking-wider uppercase text-foreground leading-tight text-center w-full truncate">{company.name}</span>

          {/* Valuation */}
          <span className="font-mono text-[8px] sm:text-[9px] font-bold" style={{ color: glowColor }}>{formatValuation(company.valuation)}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CountryHexCluster = ({
  country,
  countryIndex,
}: {
  country: CountryData;
  countryIndex: number;
}) => {
  const companies = [...country.companies].sort((a, b) => b.valuation - a.valuation).slice(0, 9);

  return (
    <div className="flex flex-col items-center min-w-full snap-center px-6 sm:px-4">
      {/* Country header */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 justify-center">
        <CountryFlag code={country.code} name={country.name} size="md" />
        <h3 className="font-display text-xs sm:text-sm font-bold tracking-wider uppercase text-foreground">
          {country.name}
        </h3>
        <span className="text-[9px] sm:text-[10px] font-mono text-muted-foreground">Top 9</span>
      </div>

      {/* Horizontal hex row */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
        {companies.map((company, i) => (
          <HexInlineCard key={company.name} company={company} index={i} countryIndex={countryIndex} />
        ))}
      </div>
    </div>
  );
};

const CorporationsSection = ({ selectedCountries }: CorporationsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrentIndex(idx);
  };

  const goTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: "smooth" });
    setCurrentIndex(idx);
  };

  if (selectedCountries.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Swipeable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {selectedCountries.map((country, ci) => (
          <CountryHexCluster key={country.id} country={country} countryIndex={ci} />
        ))}
      </div>

      {/* Navigation dots + arrows */}
      {selectedCountries.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => goTo(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors px-1 sm:px-2"
          >
            ◀
          </button>
          <div className="flex gap-1.5 sm:gap-2">
            {selectedCountries.map((c, i) => (
              <button
                key={c.id}
                onClick={() => goTo(i)}
                className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full transition-all duration-300"
                style={{
                  background: i === currentIndex
                    ? `${glowColors[i % glowColors.length]}20`
                    : "transparent",
                  border: `1px solid ${i === currentIndex ? glowColors[i % glowColors.length] : "hsl(var(--border) / 0.2)"}`,
                }}
              >
                <CountryFlag code={c.code} name={c.name} size="sm" />
                <span className={`font-display text-[8px] sm:text-[9px] font-bold tracking-wider uppercase ${i === currentIndex ? "text-foreground" : "text-muted-foreground"}`}>
                  {c.code}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={() => goTo(Math.min(selectedCountries.length - 1, currentIndex + 1))}
            disabled={currentIndex === selectedCountries.length - 1}
            className="font-mono text-[10px] sm:text-xs text-muted-foreground hover:text-primary disabled:opacity-20 transition-colors px-1 sm:px-2"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default CorporationsSection;
