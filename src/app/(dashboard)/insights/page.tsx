"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Eye, Pencil, Trash2, BarChart3 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

type Insight = {
  id: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  author: string;
  updatedAt: string;
  excerpt: string;
};

const initialInsights: Insight[] = [
  {
    id: "insight-1",
    title: "Understanding Organizational Drift",
    category: "Strategy",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Today",
    excerpt: "A practical look at identifying early organizational drift.",
  },
  {
    id: "insight-2",
    title: "The Cost of Schedule Pressure",
    category: "Operations",
    status: "Published",
    author: "Atlas Admin",
    updatedAt: "Aug 23, 2026",
    excerpt: "How schedule pressure can create hidden operational risks.",
  },
  {
    id: "insight-3",
    title: "Building Better Decision Systems",
    category: "Leadership",
    status: "Draft",
    author: "Atlas Admin",
    updatedAt: "Aug 20, 2026",
    excerpt: "A framework for improving executive decision-making.",
  },
];

export default function InsightsPage() {
  const router = useRouter();

  const [items, setItems] = useState(initialInsights);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [viewItem, setViewItem] = useState<Insight | null>(null);
  const [deleteItem, setDeleteItem] = useState<Insight | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || item.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [items, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
            Content Management
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl">Insights</h1>

          <p className="mt-1.5 text-sm text-atlas-textMuted">
            Create and manage LMCS insights and publications.
          </p>
        </div>

        <button
          onClick={() => router.push("/insights/create")}
          className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg"
        >
          <Plus className="size-4" />
          Create Insight
        </button>
      </div>

      <div className="rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="flex flex-col gap-3 border-b border-atlas-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search insights..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm outline-none focus:border-atlas-gold"
          >
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="divide-y divide-atlas-border">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-5 transition-colors hover:bg-atlas-bg sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <button
                onClick={() => setViewItem(item)}
                className="flex min-w-0 items-start gap-4 text-left"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                  <BarChart3 className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold hover:text-atlas-gold">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs text-atlas-textMuted">
                    {item.category} · {item.updatedAt}
                  </p>

                  <p className="mt-2 line-clamp-1 text-xs text-atlas-textMuted">
                    {item.excerpt}
                  </p>
                </div>
              </button>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    item.status === "Published"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {item.status}
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setViewItem(item)}
                    className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-gold/10 hover:text-atlas-gold"
                  >
                    <Eye className="size-4" />
                  </button>

                  <button
                    onClick={() => router.push(`/insights/${item.id}`)}
                    className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-gold/10 hover:text-atlas-gold"
                  >
                    <Pencil className="size-4" />
                  </button>

                  <button
                    onClick={() => setDeleteItem(item)}
                    className="rounded-lg p-2 text-atlas-textMuted hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!filtered.length && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold">No insights found</p>
            <p className="mt-1 text-xs text-atlas-textMuted">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      <Modal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title ?? "Insight"}
        size="lg"
      >
        {viewItem && (
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-atlas-gold/10 px-3 py-1 text-xs text-atlas-gold">
                {viewItem.category}
              </span>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                {viewItem.status}
              </span>
            </div>

            <p className="mt-6 text-sm leading-7 text-atlas-textMuted">
              {viewItem.excerpt}
            </p>

            <div className="mt-6 h-48 rounded-xl border border-dashed border-atlas-border bg-atlas-bg" />

            <button
              onClick={() => router.push(`/insights/${viewItem.id}`)}
              className="mt-6 w-full rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg"
            >
              Open Insight
            </button>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={() => {
          if (deleteItem) {
            setItems((items) =>
              items.filter((item) => item.id !== deleteItem.id),
            );
          }

          setDeleteItem(null);
        }}
        title="Delete Insight?"
        description={`"${deleteItem?.title}" will be permanently deleted.`}
        confirmText="Delete Insight"
      />
    </div>
  );
}
