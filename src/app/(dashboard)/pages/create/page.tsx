"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";

export default function CreatePage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("Draft");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      error("Please enter a page title.", "error");
      return;
    }

    success("Page created successfully.", "success");
    router.push("/pages");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-atlas-textMuted hover:text-atlas-text"
      >
        <ArrowLeft className="size-4" />
        Back to Pages
      </button>

      <div>
        <h1 className="font-serif text-3xl text-atlas-text">Create Page</h1>
        <p className="mt-1 text-sm text-atlas-textMuted">
          Add a new page to the LMCS website.
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-atlas-border bg-atlas-surface p-5 sm:p-7">
        <FormField label="Page Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. About LMCS"
            className="form-input"
          />
        </FormField>

        <FormField label="Slug">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="/about"
            className="form-input"
          />
        </FormField>

        <FormField label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input"
          >
            <option>Draft</option>
            <option>Published</option>
          </select>
        </FormField>

        <FormField label="Content">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            placeholder="Write page content..."
            className="form-input resize-y"
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-atlas-border pt-5 sm:flex-row sm:justify-end">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold hover:bg-atlas-bg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-sm font-bold text-atlas-bg hover:bg-atlas-goldLight"
          >
            <Save className="size-4" />
            Save Page
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
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
