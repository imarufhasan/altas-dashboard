export function PageRowSkeletonRow() {
  return (
    <tr className="border-b border-atlas-border last:border-0">
      <td className="px-6 py-4">
        <div className="h-4 w-40 animate-pulse rounded bg-atlas-border" />
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-atlas-border" />
      </td>
      <td className="px-6 py-4">
        <div className="h-3 w-24 animate-pulse rounded bg-atlas-border" />
      </td>
      <td className="px-6 py-4">
        <div className="ml-auto h-8 w-20 animate-pulse rounded bg-atlas-border" />
      </td>
    </tr>
  );
}

export function PageCardSkeleton() {
  return (
    <div className="p-4">
      <div className="flex items-start gap-3">
        <div className="size-9 shrink-0 animate-pulse rounded-lg bg-atlas-border" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-atlas-border" />
          <div className="h-3 w-20 animate-pulse rounded bg-atlas-border" />
        </div>
      </div>
    </div>
  );
}
