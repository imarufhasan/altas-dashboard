import { Skeleton } from "@/src/components/ui/Skeleton";

export function RecentChangesTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface">
      <div className="flex items-center justify-between border-b border-atlas-border px-6 py-5">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="divide-y divide-atlas-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 items-center gap-4 px-6 py-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}