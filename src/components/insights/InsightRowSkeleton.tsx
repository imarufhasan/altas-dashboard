export function InsightRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-4">
        <div className="size-10 shrink-0 animate-pulse rounded-lg bg-atlas-border" />
        <div className="min-w-0 space-y-2">
          <div className="h-4 w-48 animate-pulse rounded bg-atlas-border" />
          <div className="h-3 w-32 animate-pulse rounded bg-atlas-border" />
          <div className="h-3 w-64 animate-pulse rounded bg-atlas-border" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-atlas-border" />
        <div className="h-8 w-24 animate-pulse rounded bg-atlas-border" />
      </div>
    </div>
  );
}
