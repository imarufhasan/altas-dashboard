import { PageStatus } from "@/src/types";

const config: Record<PageStatus, string> = {
  published: "border-atlas-gold text-atlas-gold",
  draft: "border-atlas-textMuted/40 text-atlas-textMuted",
  hidden: "border-atlas-danger/60 text-atlas-danger",
};

export function StatusBadge({ status }: { status: PageStatus }) {
  return (
    <span
      className={`inline-block rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${config[status]}`}
    >
      {status}
    </span>
  );
}