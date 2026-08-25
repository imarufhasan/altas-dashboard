import type { ContentStatus } from "@/src/types";

const config: Record<ContentStatus, string> = {
  published: "border-atlas-gold text-atlas-gold",
  draft: "border-atlas-textMuted/40 text-atlas-textMuted",
  hidden: "border-atlas-danger/60 text-atlas-danger",
  archived: "border-atlas-textMuted/40 text-atlas-textMuted",
};

export function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span
      className={`inline-block rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config[status]}`}
    >
      {status}
    </span>
  );
}