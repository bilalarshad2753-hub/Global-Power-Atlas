import { motion } from "framer-motion";
import CountryFlag from "./CountryFlag";

interface ComparisonBarProps {
  label: string;
  values: { name: string; flag: string; code: string; value: number; color: string }[];
  max: number;
  unit?: string;
  formatValue?: (v: number) => string;
}

const defaultFormat = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}K`;
  return v.toLocaleString();
};

const barColors = [
  "data-bar",
  "data-bar-amber",
  "data-bar-green",
  "data-bar-red",
];

const ComparisonBar = ({
  label,
  values,
  max,
  unit = "",
  formatValue = defaultFormat,
}: ComparisonBarProps) => {
  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex justify-between items-center mb-1 sm:mb-1.5">
        <span className="text-[10px] sm:text-xs font-display uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {unit && (
          <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">{unit}</span>
        )}
      </div>
      <div className="space-y-1 sm:space-y-1.5">
        {values.map((v, i) => {
          const pct = max > 0 ? Math.min((v.value / max) * 100, 100) : 0;
          return (
            <div key={v.name} className="flex items-center gap-1 sm:gap-2">
              <span className="text-[9px] sm:text-xs shrink-0 flex items-center gap-0.5 sm:gap-1 w-14 sm:w-20 md:w-24 truncate">
                <CountryFlag code={v.code} name={v.name} size="sm" />
                <span className="font-body text-muted-foreground truncate hidden sm:inline">{v.name}</span>
                <span className="font-body text-muted-foreground truncate sm:hidden">{v.code}</span>
              </span>
              <div className="flex-1 h-4 sm:h-5 rounded-sm bg-secondary/50 overflow-hidden relative">
                <motion.div
                  className={`h-full rounded-sm ${barColors[i % barColors.length]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                />
              </div>
              <span className="text-[9px] sm:text-xs font-mono text-foreground w-10 sm:w-14 md:w-16 text-right">
                {formatValue(v.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComparisonBar;
