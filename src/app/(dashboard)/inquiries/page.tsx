"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Inbox,
} from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { InquiryRowSkeleton } from "@/src/components/inquiries/InquiryRowSkeleton";
import {
  fetchInquiries,
  updateInquiryStatus,
  Inquiry,
  InquiryStatus,
} from "@/src/lib/inquiries-data";
import { useToast } from "@/src/components/ToastProvider";

const PAGE_SIZE = 6;

export default function InquiriesPage() {
  const { success, error: showError } = useToast();

  const [items, setItems] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchInquiries().then((res) => {
      setItems(res);
      setIsLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query);
      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  // useEffect(() => {
  //   setPage(1);
  // }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(
    () => ({
      New: items.filter((i) => i.status === "New").length,
      Read: items.filter((i) => i.status === "Read").length,
      Closed: items.filter((i) => i.status === "Closed").length,
    }),
    [items],
  );

  const applyStatus = async (status: InquiryStatus) => {
    if (!selected) return;

    setActionLoading(true);
    try {
      const res = await updateInquiryStatus(selected.id, status);
      if (!res.success) {
        showError("Update Failed", res.message);
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === selected.id ? { ...item, status } : item,
        ),
      );
      setSelected((prev) => (prev ? { ...prev, status } : prev));
      success("Status Updated", res.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-atlas-border pb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Communications
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Inquiries</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Review and manage incoming website inquiries.
        </p>
      </div>

      {!isLoading && (
        <div className="grid grid-cols-3 gap-4">
          <SummaryCard label="New" value={counts.New} tone="text-atlas-gold" />
          <SummaryCard label="Read" value={counts.Read} tone="text-blue-400" />
          <SummaryCard
            label="Closed"
            value={counts.Closed}
            tone="text-green-400"
          />
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="flex flex-col gap-3 border-b border-atlas-border p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
          >
            <option>All</option>
            <option>New</option>
            <option>Read</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="divide-y divide-atlas-border">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <InquiryRowSkeleton key={i} />
            ))}

          {!isLoading &&
            paginated.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="flex w-full flex-col gap-3 p-5 text-left hover:bg-atlas-bg sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 gap-4">
                  <div className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-atlas-surface3 sm:flex">
                    <span className="text-xs font-bold">
                      {item.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <Status status={item.status} />
                    </div>
                    <p className="mt-1 text-sm text-atlas-textMuted">
                      {item.subject}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-atlas-textPlaceholder">
                      {item.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-xs text-atlas-textMuted">
                    {item.date}
                  </span>
                  <Eye className="size-4 text-atlas-textPlaceholder" />
                </div>
              </button>
            ))}
        </div>

        {!isLoading && !filtered.length && (
          <div className="px-6 py-16 text-center">
            <Inbox className="mx-auto size-7 text-atlas-textPlaceholder" />
            <p className="mt-3 text-sm font-semibold">No inquiries found</p>
            <p className="mt-1 text-xs text-atlas-textMuted">
              Try changing your search or filter.
            </p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Inquiry Details"
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{selected.name}</h3>
                <p className="mt-1 text-xs text-atlas-textMuted">
                  {selected.date}
                </p>
              </div>
              <Status status={selected.status} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${selected.email}`}
                className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3 hover:border-atlas-gold"
              >
                <Mail className="size-4 text-atlas-gold" />
                <span className="truncate text-xs">{selected.email}</span>
              </a>

              <a
                href={`tel:${selected.phone}`}
                className="flex items-center gap-3 rounded-lg border border-atlas-border bg-atlas-bg p-3 hover:border-atlas-gold"
              >
                <Phone className="size-4 text-atlas-gold" />
                <span className="text-xs">{selected.phone}</span>
              </a>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Subject
              </p>
              <p className="mt-2 text-sm font-semibold">{selected.subject}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
                Message
              </p>
              <div className="mt-2 rounded-lg border border-atlas-border bg-atlas-bg p-4">
                <p className="text-sm leading-7 text-atlas-textMuted">
                  {selected.message}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-atlas-border pt-5 sm:flex-row">
              {selected.status === "New" && (
                <button
                  onClick={() => applyStatus("Read")}
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg disabled:opacity-50"
                >
                  <CheckCircle2 className="size-4" />
                  Mark as Read
                </button>
              )}

              {selected.status !== "Closed" && (
                <button
                  onClick={() => applyStatus("Closed")}
                  disabled={actionLoading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-atlas-border py-3 text-sm font-semibold text-atlas-text disabled:opacity-50"
                >
                  <XCircle className="size-4" />
                  Close Inquiry
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                className="flex-1 rounded-lg border border-atlas-border py-3 text-sm font-semibold"
              >
                {selected.status === "Closed" ? "Close" : "Dismiss"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-atlas-border bg-atlas-surface p-4">
      <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </p>
      <p className={`mt-1 font-serif text-2xl ${tone}`}>{value}</p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const classes = {
    New: "bg-atlas-gold/10 text-atlas-gold",
    Read: "bg-blue-500/10 text-blue-400",
    Closed: "bg-green-500/10 text-green-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${classes[status as keyof typeof classes]}`}
    >
      {status}
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between border-t border-atlas-border px-4 py-4 sm:px-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-lg border border-atlas-border px-3 py-1.5 text-xs font-semibold text-atlas-text disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`size-8 rounded-lg text-xs font-bold ${
              p === page
                ? "bg-atlas-gold text-atlas-bg"
                : "text-atlas-textMuted hover:bg-atlas-bg"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-lg border border-atlas-border px-3 py-1.5 text-xs font-semibold text-atlas-text disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
