"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Modal } from "@/src/components/ui/Modal";
import { ToggleSwitch } from "@/src/components/ui/ToggleSwitch";
import { Spinner } from "@/src/components/ui/Spinner";
import { PageItem } from "@/src/lib/pages-data";

export function EditPageModal({
  page,
  onClose,
  onSave,
}: {
  page: PageItem | null;
  onClose: () => void;
  onSave: (
    id: string,
    updates: { title: string; status: PageItem["status"] },
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState("");

//   useEffect(() => {
//     if (page) {
//       setTitle(page.title);
//       setPublished(page.status === "Published");
//       setTitleError("");
//     }
//   }, [page]);

  if (!page) return null;

  const isDirty =
    title.trim() !== page.title || published !== (page.status === "Published");

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError("Page name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await onSave(page.id, {
        title: title.trim(),
        status: published ? "Published" : "Hidden",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal open={!!page} onClose={onClose} title="Edit Page">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Page Name
          </label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            placeholder="Enter page name"
            className={`w-full rounded-lg border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold ${
              titleError ? "border-atlas-danger" : "border-atlas-border"
            }`}
          />
          {titleError && (
            <p className="mt-1.5 text-[12px] font-medium text-atlas-danger">
              {titleError}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Route
          </label>
          <p className="rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 font-mono text-sm text-atlas-textMuted">
            {page.slug}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-atlas-border bg-atlas-bg px-4 py-3.5">
          <div>
            <p className="text-sm font-semibold text-atlas-text">
              {published ? "Published" : "Hidden"}
            </p>
            <p className="mt-0.5 text-xs text-atlas-textMuted">
              {published
                ? "This page is live and visible to visitors."
                : "This page is hidden from the public site."}
            </p>
          </div>
          <ToggleSwitch
            checked={published}
            onChange={setPublished}
            label="Publish page"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-atlas-border pt-5">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold text-atlas-text disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className="flex items-center gap-2 rounded-lg bg-atlas-gold px-5 py-2.5 text-sm font-bold text-atlas-bg disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? (
              <Spinner className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
