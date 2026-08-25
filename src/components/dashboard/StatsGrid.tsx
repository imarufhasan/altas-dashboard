import { ArrowDown, ArrowUp, Minus } from "lucide-react";

import { DashboardStat } from "@/src/types";

type StatsGridProps = {
  stats: DashboardStat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const TrendIcon =
          stat.trend === "up"
            ? ArrowUp
            : stat.trend === "down"
              ? ArrowDown
              : Minus;

        return (
          <div
            key={stat.id}
            className="rounded-xl border border-atlas-border bg-atlas-surface p-5 transition-colors hover:border-atlas-gold/40"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
                {stat.label}
              </p>

              {/* <TrendIcon size={15} className="shrink-0 text-atlas-gold" /> */}
            </div>

            <p className="mt-3 font-serif text-5xl text-atlas-text">
              {stat.value}
            </p>

            {/* <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-atlas-gold">
                {stat.delta}
              </span>

              <span className="text-[11px] text-atlas-textMuted">
                {stat.detail}
              </span>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}
