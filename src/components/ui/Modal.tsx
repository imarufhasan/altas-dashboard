"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export function Modal({
  open,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-full ${sizes[size]} max-h-[90vh] overflow-hidden rounded-t-2xl border border-atlas-border bg-atlas-surface shadow-2xl sm:rounded-2xl`}
      >
        <div className="flex items-center justify-between border-b border-atlas-border px-5 py-4 sm:px-6">
          <h2 className="font-serif text-xl text-atlas-text">{title}</h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="max-h-[calc(90vh-72px)] overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
