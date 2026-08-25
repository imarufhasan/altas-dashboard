"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  danger?: boolean;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  danger = true,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div
          className={`mx-auto flex size-12 items-center justify-center rounded-full ${
            danger ? "bg-red-500/10" : "bg-atlas-gold/10"
          }`}
        >
          <AlertTriangle
            className={`size-6 ${danger ? "text-red-400" : "text-atlas-gold"}`}
          />
        </div>

        <p className="mt-5 text-sm leading-6 text-atlas-textMuted">
          {description}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onClose}
            className="rounded-lg border border-atlas-border px-5 py-2.5 text-sm font-semibold text-atlas-text hover:bg-atlas-bg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${
              danger
                ? "bg-red-500 text-white hover:bg-red-400"
                : "bg-atlas-gold text-atlas-bg"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
