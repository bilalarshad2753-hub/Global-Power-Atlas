import { countries } from "@/data/countries";
import { motion } from "framer-motion";
import CountryFlag from "./CountryFlag";

interface CountrySelectorProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const CountrySelector = ({ selectedIds, onToggle }: CountrySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2 justify-center">
      {countries.map((c) => {
        const selected = selectedIds.includes(c.id);
        return (
          <motion.button
            key={c.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(c.id)}
            className={`px-1.5 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-md text-[11px] sm:text-xs md:text-sm font-body font-medium transition-all border ${
              selected
                ? "glow-border bg-primary/10 text-primary"
                : "border-border bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            <CountryFlag code={c.code} name={c.name} size="sm" /> {c.name}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CountrySelector;
