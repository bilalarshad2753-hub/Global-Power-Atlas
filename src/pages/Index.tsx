import { useState, useCallback, Suspense } from "react";
import { motion } from "framer-motion";
import Globe from "@/components/Globe";
import GlobeHUD from "@/components/GlobeHUD";
import GlobeHUDRight from "@/components/GlobeHUDRight";
import CountrySelector from "@/components/CountrySelector";
import ComparisonPanel from "@/components/ComparisonPanel";
import { countries } from "@/data/countries";

const Index = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleRemove = useCallback((id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const selectedCountries = countries.filter((c) => selectedIds.includes(c.id));

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden">
      {/* Scan line effect */}
      <div className="scan-line fixed inset-0 pointer-events-none z-50 h-[200%]" />

      {/* Title Section */}
      <header className="relative z-10 w-full bg-background pt-6 sm:pt-6 md:pt-8 pb-2 sm:pb-4 md:pb-6 text-center border-b border-border/30 px-3 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-lg xs:text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-[0.08em] sm:tracking-[0.15em] md:tracking-[0.2em] uppercase glow-text text-primary leading-tight">
            Global Power Atlas
          </h1>
          <p className="text-[10px] sm:text-xs font-mono text-muted-foreground mt-1 sm:mt-2 tracking-widest">
            GEOPOLITICAL INTELLIGENCE SYSTEM
          </p>
        </motion.div>
      </header>

      {/* Globe Section */}
      <section className="relative z-0 w-full h-[40vh] sm:h-[50vh] md:h-[65vh] lg:h-[70vh] py-4 sm:py-4 md:py-8 overflow-visible">
        <GlobeHUD />
        <GlobeHUDRight />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <div className="font-display text-sm sm:text-base text-primary glow-text animate-pulse-glow">
                INITIALIZING GLOBE...
              </div>
            </div>
          }
        >
          <Globe selectedIds={selectedIds} onToggle={handleToggle} />
        </Suspense>
      </section>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 text-center pb-3 sm:pb-6"
      >
        <span className="text-[10px] sm:text-xs font-display text-muted-foreground tracking-[0.2em] sm:tracking-[0.3em] uppercase">
          Scroll to explore
        </span>
        <div className="mt-1 sm:mt-2 w-px h-6 sm:h-8 bg-gradient-to-b from-primary/60 to-transparent mx-auto" />
      </motion.div>

      {/* Country Selection */}
      <section className="relative z-10 px-6 sm:px-4 md:px-8 py-4 sm:py-8 md:py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 justify-center">
            <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-r from-transparent to-primary/40" />
            <h2 className="font-display text-sm sm:text-base md:text-lg font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase glow-text text-primary">
              Select Nations
            </h2>
            <div className="h-px flex-1 max-w-[60px] sm:max-w-[100px] bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          <CountrySelector selectedIds={selectedIds} onToggle={handleToggle} />

          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-3 sm:mt-4"
            >
              <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                {selectedIds.length} nation{selectedIds.length !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="ml-3 sm:ml-4 text-[10px] sm:text-xs font-mono text-destructive hover:text-destructive/80 transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Comparison Section */}
      <section className="relative z-10 px-2 sm:px-4 md:px-8 pb-8 sm:pb-16 md:pb-20 max-w-7xl mx-auto">
        <ComparisonPanel
          selectedCountries={selectedCountries}
          onRemove={handleRemove}
        />
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-4 sm:py-8 text-center px-4">
        <p className="text-[9px] sm:text-xs font-mono text-muted-foreground tracking-wider sm:tracking-widest">
          GLOBAL POWER ATLAS -- a Tool by Bilal Arshad
        </p>
      </footer>
    </div>
  );
};

export default Index;
