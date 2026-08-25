"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";

export default function PageDetails() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        onClick={() => router.push("/pages")}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Pages
      </button>

      <div className="flex flex-col gap-4 border-b border-atlas-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-atlas-gold">
            Page Preview
          </p>

          <h1 className="mt-2 font-serif text-3xl capitalize">
            {id.replaceAll("-", " ")}
          </h1>

          <p className="mt-1 text-sm text-atlas-textMuted">
            Website page content preview.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/pages/${id}/edit`)}
            className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-4 py-2.5 text-xs font-bold text-atlas-bg"
          >
            <Pencil className="size-4" />
            Edit
          </button>

          <button className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border px-4 py-2.5 text-xs font-semibold">
            <ExternalLink className="size-4" />
            Preview
          </button>
        </div>
      </div>

      <article className="rounded-xl border border-atlas-border bg-atlas-surface p-6 sm:p-10">
        <div className="h-8 w-2/3 rounded bg-atlas-surface3" />
        <div className="mt-4 h-4 w-1/3 rounded bg-atlas-surface3" />

        <div className="mt-10 space-y-4">
          <div className="h-3 rounded bg-atlas-surface3" />
          <div className="h-3 rounded bg-atlas-surface3" />
          <div className="h-3 w-5/6 rounded bg-atlas-surface3" />
        </div>
      </article>
    </div>
  );
}
