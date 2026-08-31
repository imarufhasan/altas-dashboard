"use client";

import { useEffect, useState } from "react";
import { DashboardData } from "@/src/types";
import { fetchDashboardData } from "@/src/lib/fake-api";
import { StatsGrid } from "@/src/components/dashboard/StatsGrid";
import { StatsGridSkeleton } from "@/src/components/dashboard/StatsGridSkeleton";
import { RecentChangesTable } from "@/src/components/dashboard/RecentChangesTable";
import { RecentChangesTableSkeleton } from "@/src/components/dashboard/RecentChangesTableSkeleton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchDashboardData().then((res) => {
      if (active) {
        setData(res);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl text-atlas-text">Dashboard</h1>
          <p className="mt-1.5 text-sm text-atlas-textMuted">
            System Overview & Content Operations
          </p>
        </div>

        {/* <div className="flex gap-3">
          <button className="rounded-md bg-atlas-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-bg transition-colors hover:bg-atlas-goldLight">
            Manage Pages
          </button>
          <button className="rounded-md border border-atlas-border px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-text transition-colors hover:bg-atlas-surface">
            Create Insight
          </button>
        </div> */}
      </div>

      {isLoading || !data ? (
        <StatsGridSkeleton />
      ) : (
        <StatsGrid stats={data.stats} />
      )}

      {isLoading || !data ? (
        <RecentChangesTableSkeleton />
      ) : (
        <RecentChangesTable recentChanges={data.recentChanges} />
      )}
    </div>
  );
}
