"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";

export default function CreateInsightPage() {
  const router = useRouter();
//   const { showToast } = useToast();
const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Strategy");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");

  const save = () => {
    if (!title.trim()) {
      error("Insight title is required.", "error");
      return;
    }

    success("Insight created successfully.", "success");
    router.push("/insights");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Insights
      </button>

      <div>
        <h1 className="font-serif text-3xl">Create Insight</h1>
        <p className="mt-1 text-sm text-atlas-textMuted">
          Publish a new insight to the LMCS website.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-atlas-border bg-atlas-surface p-5 sm:p-7">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Insight title"
            className="form-input"
          />
        </Field>

        <Field label="Category">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          >
            <option>Strategy</option>
            <option>Operations</option>
            <option>Leadership</option>
            <option>Technology</option>
          </select>
        </Field>

        <Field label="Excerpt">
          <textarea
            rows={3}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short description..."
            className="form-input resize-y"
          />
        </Field>

        <Field label="Content">
          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your insight..."
            className="form-input resize-y"
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 border-t border-atlas-border pt-5 sm:flex-row sm:justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>

          <button
            onClick={save}
            className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-sm font-bold text-atlas-bg"
          >
            <Save className="size-4" />
            Save Insight
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </label>
      {children}
    </div>
  );
}
