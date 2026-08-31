export function InquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 gap-4">
        <div className="hidden size-10 shrink-0 animate-pulse rounded-full bg-atlas-border sm:block" />
        <div className="min-w-0 space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-atlas-border" />
          <div className="h-3 w-48 animate-pulse rounded bg-atlas-border" />
          <div className="h-3 w-64 animate-pulse rounded bg-atlas-border" />
        </div>
      </div>
      <div className="h-3 w-20 animate-pulse rounded bg-atlas-border" />
    </div>
  );
}
