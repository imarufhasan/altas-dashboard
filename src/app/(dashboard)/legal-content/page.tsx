"use client";

import { useState } from "react";
import { Eye, Pencil, FileText } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";

const legalItems = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How LMCS collects and manages user information.",
    updated: "Aug 20, 2026",
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    description: "Terms governing the use of the LMCS website.",
    updated: "Aug 18, 2026",
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    description: "Information about cookies and tracking technologies.",
    updated: "Aug 15, 2026",
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    description: "Important legal and informational disclaimers.",
    updated: "Aug 12, 2026",
  },
];

export default function LegalContentPage() {
  const [selected, setSelected] = useState<(typeof legalItems)[number] | null>(
    null,
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-atlas-border pb-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Compliance
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl">Legal Content</h1>

        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Manage the legal and policy content published on the website.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {legalItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-atlas-border bg-atlas-surface p-5 transition-colors hover:border-atlas-gold/30 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-atlas-gold/10 text-atlas-gold">
                <FileText className="size-5" />
              </div>

              <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold text-green-400">
                Published
              </span>
            </div>

            <h2 className="mt-5 font-serif text-xl">{item.title}</h2>

            <p className="mt-2 text-sm leading-6 text-atlas-textMuted">
              {item.description}
            </p>

            <p className="mt-4 text-xs text-atlas-textPlaceholder">
              Last updated: {item.updated}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelected(item)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-semibold hover:bg-atlas-bg"
              >
                <Eye className="size-4" />
                View
              </button>

              <button
                onClick={() => setSelected(item)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-atlas-gold py-2.5 text-xs font-bold text-atlas-bg hover:bg-atlas-goldLight"
              >
                <Pencil className="size-4" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title ?? "Legal Content"}
        size="lg"
      >
        {selected && (
          <div>
            <div className="rounded-xl border border-atlas-border bg-atlas-bg p-5">
              <h3 className="font-serif text-2xl">{selected.title}</h3>

              <p className="mt-4 text-sm leading-7 text-atlas-textMuted">
                This is a preview of the legal content. The actual CMS content
                can be connected here later through the backend API.
              </p>

              <div className="mt-6 space-y-3">
                <div className="h-3 rounded bg-atlas-surface3" />
                <div className="h-3 rounded bg-atlas-surface3" />
                <div className="h-3 w-4/5 rounded bg-atlas-surface3" />
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full rounded-lg bg-atlas-gold py-3 text-sm font-bold text-atlas-bg"
            >
              Save Changes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
