import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryData } from "@/data/countries";
import CountryCard from "./CountryCard";
import MilitarySection from "./MilitarySection";
import CorporationsSection from "./CorporationsSection";

interface ComparisonPanelProps {
  selectedCountries: CountryData[];
  onRemove: (id: string) => void;
}

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
    <span className="text-lg sm:text-xl md:text-2xl">{icon}</span>
    <h2 className="font-display text-sm sm:text-base md:text-xl font-bold tracking-wider uppercase glow-text text-primary">
      {title}
    </h2>
    <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent" />
  </div>
);

const ComparisonPanel = ({ selectedCountries, onRemove }: ComparisonPanelProps) => {
  if (selectedCountries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-10 sm:py-20"
      >
        <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-float">🌍</div>
        <p className="font-display text-sm sm:text-lg text-muted-foreground tracking-wider">
          SELECT COUNTRIES TO COMPARE
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1 sm:mt-2 font-body px-4">
          Click on the globe markers or use the selector above
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      {/* Country Cards */}
      <div className="px-4 sm:px-6 md:px-0">
        <SectionHeader title="Overview" icon="🏳️" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <AnimatePresence>
            {selectedCountries.map((c, i) => (
              <CountryCard key={c.id} country={c} onRemove={onRemove} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Military Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 sm:px-8 md:px-0"
      >
        <SectionHeader title="Military Power" icon="⚔️" />
        <MilitarySection selectedCountries={selectedCountries} />
      </motion.div>

      {/* Companies */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="holo-panel rounded-lg p-2.5 sm:p-4 md:p-6 px-8 sm:px-8 md:px-6"
      >
        <SectionHeader title="Major Corporations" icon="🏢" />
        <CorporationsSection selectedCountries={selectedCountries} />
      </motion.div>
    </div>
  );
};

export default ComparisonPanel;
