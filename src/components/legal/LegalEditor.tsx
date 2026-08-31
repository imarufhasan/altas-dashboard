"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  AlertTriangle,
  Eye,
  Save,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import { Modal } from "@/src/components/ui/Modal";
import { LegalDoc, LegalStatus } from "@/src/lib/legal-data";

type LegalEditorProps = {
  doc: LegalDoc;
  onCancel?: () => void;
  onSaved?: (doc: LegalDoc) => void;
};

export function LegalEditor({ doc, onCancel, onSaved }: LegalEditorProps) {
  const { success, error } = useToast();

  const [description, setDescription] = useState(doc.description);
  const [content, setContent] = useState(doc.content);
  const [status, setStatus] = useState<LegalStatus>(doc.status);
  const [effectiveDate, setEffectiveDate] = useState(doc.effectiveDate ?? "");
  const [version, setVersion] = useState(doc.version);

  const [isSaved, setIsSaved] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const markDirty = () => setIsSaved(false);

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

  const contentMissing = !content.trim();

  const bumpVersion = (current: string) => {
    const match = current.match(/v(\d+)\.(\d+)/i);
    if (!match) return "v1.1";
    return `v${match[1]}.${Number(match[2]) + 1}`;
  };

  const buildDoc = (
    nextStatus: LegalStatus,
    nextVersion: string,
  ): LegalDoc => ({
    ...doc,
    description,
    content,
    status: nextStatus,
    effectiveDate: effectiveDate || undefined,
    version: nextVersion,
    updatedAt: "Just now",
  });

  const handleSaveDraft = () => {
    const updated = buildDoc("Draft", version);
    setStatus("Draft");
    setIsSaved(true);
    success("Draft saved successfully.");
    onSaved?.(updated);
  };

  const handleCommitPublish = () => {
    if (contentMissing) {
      error("Document content is required for publication.");
      return;
    }
    const nextVersion = bumpVersion(version);
    const updated = buildDoc("Published", nextVersion);
    setStatus("Published");
    setVersion(nextVersion);
    setIsSaved(true);
    success("Legal document published successfully.");
    onSaved?.(updated);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {!isSaved && (
          <div className="flex items-center gap-3 rounded-lg border-l-2 border-amber-400 bg-atlas-surface px-4 py-3">
            <AlertTriangle className="size-4 shrink-0 text-amber-400" />
            <p className="text-sm text-atlas-textMuted">
              You have modifications that have not been saved to the database.
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Document Summary
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              markDirty();
            }}
            placeholder="Provide a brief summary of this legal document..."
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
            rows={18}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              markDirty();
            }}
            placeholder="Write the legal document content..."
            className="w-full resize-y rounded-b-lg border border-atlas-border bg-atlas-bg px-4 py-3 text-sm leading-7 text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold"
          />
        </div>

        {contentMissing && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
            <AlertTriangle className="size-3.5" />
            Document content is required for publication
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

      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-5 rounded-xl border border-atlas-border bg-atlas-surface p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-atlas-gold" />
            <h2 className="font-serif text-xl text-atlas-text">
              Compliance Ops
            </h2>
          </div>

          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
              Document Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as LegalStatus);
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
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => {
                setEffectiveDate(e.target.value);
                markDirty();
              }}
              className="w-full rounded-lg border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm text-atlas-text outline-none focus:border-atlas-gold"
            />
          </div>

          <div className="space-y-2 border-t border-atlas-border pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-atlas-textMuted">Version:</span>
              <span className="font-semibold text-atlas-text">{version}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-atlas-textMuted">Slug:</span>
              <span className="font-semibold text-atlas-text">/{doc.slug}</span>
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
        title={doc.title}
        size="lg"
      >
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-atlas-gold/10 px-3 py-1 text-xs text-atlas-gold">
              {version}
            </span>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-400">
              {status}
            </span>
          </div>
          {description && (
            <p className="mt-6 text-sm italic leading-7 text-atlas-textMuted">
              {description}
            </p>
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
