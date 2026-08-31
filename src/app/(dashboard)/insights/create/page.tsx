"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { InsightEditor } from "@/src/components/insights/InsightEditor";

export default function CreateInsightPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Insights
      </button>

      <div>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-atlas-gold">
          Insights &gt; Create Insight
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">Create Insight</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Publish a new insight to the LMCS website.
        </p>
      </div>

      <InsightEditor
        mode="create"
        onCancel={() => router.push("/insights")}
        onSaved={() => router.push("/insights")}
      />
    </div>
  );
}
