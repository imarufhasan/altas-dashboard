"use client";

import { useMemo, useState } from "react";
import { Search, Eye, Mail, Phone, CheckCircle2 } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Closed";
  date: string;
};

const initialData: Inquiry[] = [
  {
    id: "inq-1",
    name: "James Wilson",
    email: "james@example.com",
    phone: "+1 202 555 0145",
    subject: "Consultation Request",
    message:
      "I would like to learn more about the LMCS framework and arrange a consultation.",
    status: "New",
    date: "Today, 09:42 AM",
  },
  {
    id: "inq-2",
    name: "Sarah Miller",
    email: "sarah@example.com",
    phone: "+1 202 555 0188",
    subject: "Website Inquiry",
    message:
      "Could you provide more information about your executive advisory services?",
    status: "Read",
    date: "Yesterday",
  },
  {
    id: "inq-3",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 202 555 0132",
    subject: "General Question",
    message: "I have a question regarding your services.",
    status: "Closed",
    date: "Aug 22, 2026",
  },
];

export default function InquiriesPage() {
  const [items, setItems] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const query = search.toLowerCase();

      return (
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query)
      );
    });
  }, [items, search]);

  const markRead = () => {
    if (!selected) return;

    setItems((current) =>
      current.map((item) =>
        item.id === selected.id ? { ...item, status: "Read" } : item,
      ),
    );

    setSelected({
      ...selected,
      status: "Read",
    });
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

      <section className="overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface">
        <div className="border-b border-atlas-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-atlas-textPlaceholder" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg py-2.5 pl-9 pr-4 text-sm outline-none focus:border-atlas-gold"
            />
          </div>
        </div>

        <div className="divide-y divide-atlas-border">
          {filtered.map((item) => (
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

        {!filtered.length && (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold">No inquiries found</p>
          </div>
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
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>

                  <p className="mt-1 text-xs text-atlas-textMuted">
                    {selected.date}
                  </p>
                </div>

                <Status status={selected.status} />
              </div>
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

            <div className="flex flex-col gap-3 sm:flex-row">
              {selected.status === "New" && (
                <button
                  onClick={markRead}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg"
                >
                  <CheckCircle2 className="size-4" />
                  Mark as Read
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                className="flex-1 rounded-lg border border-atlas-border py-3 text-sm font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
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
      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
        classes[status as keyof typeof classes]
      }`}
    >
      {status}
    </span>
  );
}
