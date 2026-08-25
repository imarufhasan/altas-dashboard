import { Skeleton } from "@/src/components/ui/Skeleton";

export function SettingsSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 4 }).map((_, section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-3 w-40" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}