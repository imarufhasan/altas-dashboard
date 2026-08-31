"use client";

import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  AlertTriangle,
  Eye,
  Save,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import { Modal } from "@/src/components/ui/Modal";
import { CATEGORIES, Insight, InsightStatus } from "@/src/lib/insights-data";
import Image from "next/image";

type InsightEditorProps = {
  mode: "create" | "edit";
  initialData?: Insight;
  onSaved?: (insight: Insight, action: "draft" | "publish") => void;
  onCancel?: () => void;
};

export function InsightEditor({
  mode,
  initialData,
  onSaved,
  onCancel,
}: InsightEditorProps) {
  const { success, error } = useToast();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [category, setCategory] = useState(
    initialData?.category ?? CATEGORIES[0],
  );
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState<InsightStatus>(
    initialData?.status ?? "Draft",
  );
  const [publishDate, setPublishDate] = useState(
    initialData?.publishDate ?? "",
  );
  const [featuredAsset, setFeaturedAsset] = useState<string | undefined>(
    initialData?.featuredAsset,
  );

  // Unsaved-changes tracking — always true for a fresh "create" until first save
  const [isSaved, setIsSaved] = useState(mode === "edit");
  const [previewOpen, setPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const markDirty = () => setIsSaved(false);

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFeaturedAsset(reader.result as string);
      markDirty();
    };
    reader.readAsDataURL(file);
  };

  const wrapSelection = (before: string, after = before) => {
    const el = contentRef.current;
    if (!el) return;

    const { selectionStart, selectionEnd, value } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const next =
      value.slice(0, selectionStart) +
      before +
      selected +
      after +
      value.slice(selectionEnd);

    setContent(next);
    markDirty();

    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = selectionStart + before.length;
      el.selectionEnd = selectionStart + before.length + selected.length;
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const el = contentRef.current;
    if (!el) return;
    const { selectionStart, value } = el;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    setContent(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    markDirty();
  };

  const isEmpty = (v: string) => !v.trim();
  const contentMissing = isEmpty(content);

  const state = useMemo(() => {
    if (status === "Published")
      return { label: "Published", tone: "text-green-400" };
    if (publishDate)
      return { label: `Scheduled · ${publishDate}`, tone: "text-atlas-gold" };
    return { label: "Not yet published", tone: "text-atlas-textMuted" };
  }, [status, publishDate]);

  const buildInsight = (nextStatus: InsightStatus): Insight => ({
    id: initialData?.id ?? `insight-${Date.now()}`,
    title: title.trim() || "Untitled Insight",
    category,
    status: nextStatus,
    author: initialData?.author ?? "Current User",
    updatedAt: "Just now",
    publishDate: publishDate || undefined,
    excerpt,
    content,
    featuredAsset,
  });

  const handleSaveDraft = () => {
    if (isEmpty(title)) {
      error("Insight title is required.");
      return;
    }
    const insight = buildInsight("Draft");
    setStatus("Draft");
    setIsSaved(true);
    success("Draft saved successfully.");
    onSaved?.(insight, "draft");
  };

  const handleCommitPublish = () => {
    if (isEmpty(title)) {
      error("Insight title is required.");
      return;
    }
    if (contentMissing) {
      error("Critical content payload is required for publication.");
      return;
    }
    const insight = buildInsight("Published");
    setStatus("Published");
    setIsSaved(true);
    success("Insight published successfully.");
    onSaved?.(insight, "publish");
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-2">
        {!isSaved && (
          <div className="flex items-center gap-3 rounded-lg border-l-2 border-amber-400 bg-atlas-surface px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="text-sm text-atlas-textMuted">
              You have modifications that have not been saved to the database.
            </p>
          </div>
        )}

        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
          placeholder="Enter Analytical Title..."
          className="w-full border-b border-atlas-border bg-transparent pb-3 font-serif text-3xl text-atlas-text placeholder:text-atlas-textPlaceholder focus:border-atlas-gold focus:outline-none sm:text-4xl"
        />

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Primary Taxonomy
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              markDirty();
            }}
            className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Featured Asset
          </label>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-atlas-border bg-atlas-bg">
            {featuredAsset ? (
              <Image
                src={featuredAsset}
                alt="Featured asset"
                fill
                unoptimized
                className="object-cover opacity-70"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-atlas-surface to-atlas-bg" />
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-lg bg-atlas-bg/80 px-6 py-4 text-xs font-bold uppercase tracking-wider text-atlas-text backdrop-blur"
            >
              <Upload className="size-5 text-atlas-gold" />
              Replace Asset
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAssetChange}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Executive Summary
          </label>
          <textarea
            rows={3}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              markDirty();
            }}
            placeholder="Provide a brief, high-impact synopsis..."
            className="w-full resize-y rounded-lg border border-atlas-border bg-atlas-bg px-4 py-3 text-sm text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
          />
        </div>

        <div>
          <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-atlas-border bg-atlas-surface px-3 py-2">
            <ToolbarButton
              icon={Bold}
              onClick={() => wrapSelection("**")}
              label="Bold"
            />
            <ToolbarButton
              icon={Italic}
              onClick={() => wrapSelection("*")}
              label="Italic"
            />
            <span className="mx-1 h-4 w-px bg-atlas-border" />
            <ToolbarButton
              icon={List}
              onClick={() => insertLinePrefix("- ")}
              label="Bulleted list"
            />
            <ToolbarButton
              icon={ListOrdered}
              onClick={() => insertLinePrefix("1. ")}
              label="Numbered list"
            />
            <span className="mx-1 h-4 w-px bg-atlas-border" />
            <ToolbarButton
              icon={Quote}
              onClick={() => insertLinePrefix("> ")}
              label="Quote"
            />
            <ToolbarButton
              icon={Link2}
              onClick={() => wrapSelection("[", "](https://)")}
              label="Link"
            />
          </div>

          <textarea
            ref={contentRef}
            rows={14}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              markDirty();
            }}
            placeholder="Write your insight..."
            className="w-full resize-y rounded-b-lg border border-atlas-border bg-atlas-bg px-4 py-3 text-sm leading-7 text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
          />
        </div>

        {contentMissing && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="size-3.5" />
            Critical content payload is required for publication
          </p>
        )}

        {onCancel && (
          <div className="flex justify-end border-t border-atlas-border pt-5">
            <button
              onClick={onCancel}
              className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold text-atlas-text"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-5 rounded-xl border border-atlas-border bg-atlas-surface p-6">
          <h2 className="font-serif text-xl text-atlas-text">Publishing Ops</h2>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Document Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as InsightStatus);
                markDirty();
              }}
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Target Publication
            </label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => {
                setPublishDate(e.target.value);
                markDirty();
              }}
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            />
          </div>

          <div className="space-y-2 border-t border-atlas-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-atlas-textMuted">State:</span>
              <span className={`font-semibold ${state.tone}`}>
                {state.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-atlas-textMuted">Author:</span>
              <span className="font-semibold text-atlas-text">
                {initialData?.author ?? "Current User"}
              </span>
            </div>
          </div>

          <button
            onClick={handleCommitPublish}
            className="w-full rounded-lg bg-atlas-gold py-3 text-xs font-bold uppercase tracking-wider text-atlas-bg"
          >
            Commit Publish
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text"
            >
              <Eye className="size-3.5" />
              Preview
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex items-center justify-center gap-2 rounded-lg border border-atlas-border py-2.5 text-xs font-bold uppercase tracking-wider text-atlas-text"
            >
              <Save className="size-3.5" />
              Save Draft
            </button>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={title || "Untitled Insight"}
        size="lg"
      >
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-atlas-gold/10 px-3 py-1 text-xs text-atlas-gold">
              {category}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              {status}
            </span>
          </div>

          {excerpt && (
            <p className="mt-6 text-sm leading-7 text-atlas-textMuted">
              {excerpt}
            </p>
          )}

          {featuredAsset && (
            <div className="relative mt-6 h-48 w-full overflow-hidden rounded-xl border border-atlas-border">
              <Image
                src={featuredAsset}
                alt="Featured asset"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-atlas-text">
            {content || "No content yet."}
          </p>
        </div>
      </Modal>
    </div>
  );
}

function ToolbarButton({
  icon: Icon,
  onClick,
  label,
}: {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className="rounded-md p-1.5 text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-gold"
    >
      <Icon className="size-4" />
    </button>
  );
}
