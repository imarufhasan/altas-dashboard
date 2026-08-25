"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  FileText,
} from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

type PageItem = {
  id: string;
  title: string;
  slug: string;
  status: "Published" | "Draft";
  updatedAt: string;
  author: string;
};

const initialPages: PageItem[] = [
  {
    id: "home",
    title: "Homepage",
    slug: "/",
    status: "Published",
    updatedAt: "Today, 10:30 AM",
    author: "Atlas Admin",
  },
  {
    id: "about",
    title: "About LMCS",
    slug: "/about",
    status: "Published",
    updatedAt: "Yesterday",
    author: "Atlas Admin",
  },
  {
    id: "how-it-works",
    title: "How LMCS Works",
    slug: "/how-lmcs-works",
    status: "Published",
    updatedAt: "Aug 23, 2026",
    author: "Atlas Admin",
  },
  {
    id: "contact",
    title: "Contact",
    slug: "/contact",
    status: "Draft",
    updatedAt: "Aug 21, 2026",
    author: "Atlas Admin",
  },
];

export default function PagesPage() {
  const router = useRouter();

  const [pages, setPages] = useState(initialPages);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [viewPage, setViewPage] = useState<PageItem | null>(null);
  const [deletePage, setDeletePage] = useState<PageItem | null>(null);

  const filteredPages = useMemo(() => {
    return pages.filter((page) => {
      const matchesSearch =
        page.title.toLowerCase().includes(search.toLowerCase()) ||
        page.slug.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || page.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [pages, search, status]);

  const handleDelete = () => {
    if (!deletePage) return;

    setPages((current) =>
      current.filter((page) => page.id !== deletePage.id)
    );

    setDeletePage(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages"
        description="Manage website pages and publishing status."
        button="Create Page"
        onClick={() => router.push("/pages/create")}
      />

      <section className="rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="flex flex-col gap-3 border-b border-atlas-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
          >
            <option>All</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-atlas-border text-left">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                  Page
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                  Updated
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredPages.map((page) => (
                <tr
                  key={page.id}
                  className="border-b border-atlas-border last:border-0 hover:bg-atlas-bg"
                >
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setViewPage(page)}
                      className="text-left"
                    >
                      <p className="text-sm font-semibold text-atlas-text hover:text-atlas-gold">
                        {page.title}
                      </p>
                      {/* <p className="mt-1 text-xs text-atlas-textMuted">
                        {page.slug}
                      </p> */}
                    </button>
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={page.status} />
                  </td>

                  <td className="px-6 py-4 text-xs text-atlas-textMuted">
                    {page.updatedAt}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View"
                        onClick={() => setViewPage(page)}
                      >
                        <Eye className="size-4" />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() =>
                          router.push(`/pages/${page.id}/edit`)
                        }
                      >
                        <Pencil className="size-4" />
                      </ActionButton>

                      <ActionButton
                        title="Delete"
                        danger
                        onClick={() => setDeletePage(page)}
                      >
                        <Trash2 className="size-4" />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-atlas-border md:hidden">
          {filteredPages.map((page) => (
            <div key={page.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => setViewPage(page)}
                  className="flex min-w-0 items-start gap-3 text-left"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                    <FileText className="size-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {page.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-atlas-textMuted">
                      {page.slug}
                    </p>
                  </div>
                </button>

                <StatusBadge status={page.status} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-atlas-textMuted">
                  {page.updatedAt}
                </span>

                <div className="flex gap-1">
                  <ActionButton
                    title="View"
                    onClick={() => setViewPage(page)}
                  >
                    <Eye className="size-4" />
                  </ActionButton>

                  <ActionButton
                    title="Edit"
                    onClick={() =>
                      router.push(`/pages/${page.id}/edit`)
                    }
                  >
                    <Pencil className="size-4" />
                  </ActionButton>

                  <ActionButton
                    title="Delete"
                    danger
                    onClick={() => setDeletePage(page)}
                  >
                    <Trash2 className="size-4" />
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <EmptyState
            title="No pages found"
            description="Try changing your search or filter."
          />
        )}
      </section>

      <Modal
        open={!!viewPage}
        onClose={() => setViewPage(null)}
        title={viewPage?.title ?? "Page Details"}
      >
        {viewPage && (
          <div className="space-y-5">
            <InfoRow label="Title" value={viewPage.title} />
            <InfoRow label="Slug" value={viewPage.slug} />
            <InfoRow label="Status" value={viewPage.status} />
            <InfoRow label="Author" value={viewPage.author} />
            <InfoRow label="Last Updated" value={viewPage.updatedAt} />

            <div className="rounded-lg border border-atlas-border bg-atlas-bg p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Preview
              </p>

              <div className="mt-4 h-32 rounded-lg border border-dashed border-atlas-border bg-atlas-surface" />
            </div>

            <button
              onClick={() => {
                setViewPage(null);
                router.push(`/pages/${viewPage.id}/edit`);
              }}
              className="w-full rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg hover:bg-atlas-goldLight"
            >
              Edit Page
            </button>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!deletePage}
        onClose={() => setDeletePage(null)}
        onConfirm={handleDelete}
        title="Delete Page?"
        description={`"${deletePage?.title}" will be permanently removed from this dashboard.`}
        confirmText="Delete Page"
      />
    </div>
  );
}

function PageHeader({
  title,
  description,
  button,
  onClick,
}: {
  title: string;
  description: string;
  button: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Content Management
        </p>
        <h1 className="font-serif text-3xl text-atlas-text sm:text-4xl">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          {description}
        </p>
      </div>

      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-bg hover:bg-atlas-goldLight"
      >
        <Plus className="size-4" />
        {button}
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const published = status === "Published";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${
        published
          ? "bg-green-500/10 text-green-400"
          : "bg-amber-500/10 text-amber-400"
      }`}
    >
      {status}
    </span>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${
        danger
          ? "text-atlas-textMuted hover:bg-red-500/10 hover:text-red-400"
          : "text-atlas-textMuted hover:bg-atlas-gold/10 hover:text-atlas-gold"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </p>
      <p className="mt-1 text-sm text-atlas-text">{value}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <MoreHorizontal className="mx-auto size-7 text-atlas-textPlaceholder" />
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mt-1 text-xs text-atlas-textMuted">
        {description}
      </p>
    </div>
  );
}