import { motion } from "framer-motion";
import { CountryData } from "@/data/countries";
import CountryFlag from "./CountryFlag";

interface CountryCardProps {
  country: CountryData;
  onRemove: (id: string) => void;
  index: number;
}

const CountryCard = ({ country, onRemove, index }: CountryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.05 }}
      className="holo-panel rounded-lg p-3 sm:p-4 relative group"
    >
      <button
        onClick={() => onRemove(country.id)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors text-xs font-mono opacity-100 sm:opacity-0 group-hover:opacity-100"
      >
        ✕
      </button>
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
        <CountryFlag code={country.code} name={country.name} size="lg" />
        <div className="min-w-0">
          <h3 className="font-display text-xs sm:text-sm font-bold text-foreground tracking-wide truncate">
            {country.name}
          </h3>
          <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
            {country.governmentIcon} {country.government}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
        <div className="bg-secondary/30 rounded px-1.5 sm:px-2 py-1 sm:py-1.5">
          <span className="text-muted-foreground block text-[9px] sm:text-[11px]">GDP</span>
          <span className="font-mono text-primary font-semibold">
            ${country.economy.gdp}T
          </span>
        </div>
        <div className="bg-secondary/30 rounded px-1.5 sm:px-2 py-1 sm:py-1.5">
          <span className="text-muted-foreground block text-[9px] sm:text-[11px]">Population</span>
          <span className="font-mono text-accent font-semibold">
            {country.economy.population}M
          </span>
        </div>
        <div className="bg-secondary/30 rounded px-1.5 sm:px-2 py-1 sm:py-1.5">
          <span className="text-muted-foreground block text-[9px] sm:text-[11px]">GDP/Capita</span>
          <span className="font-mono text-glow-green font-semibold">
            ${country.economy.gdpPerCapita.toLocaleString()}
          </span>
        </div>
        <div className="bg-secondary/30 rounded px-1.5 sm:px-2 py-1 sm:py-1.5">
          <span className="text-muted-foreground block text-[9px] sm:text-[11px]">Loan Taken</span>
          <span className="font-mono text-glow-red font-semibold">
            ${country.economy.debt}T
          </span>
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex flex-wrap gap-1">
        {country.economicBackbone.map((b) => (
          <span
            key={b}
            className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded-full border border-border text-muted-foreground"
          >
            {b}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default CountryCard;
