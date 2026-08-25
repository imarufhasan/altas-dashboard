import { Skeleton } from "@/src/components/ui/Skeleton";

export function StatsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-atlas-border bg-atlas-surface p-5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="mt-4 h-8 w-12" />
        </div>
      ))}
    </div>
  );
}