"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type Toast = {
  id: string;
  type: "success" | "error";
  title: string;
  description?: string;
};

type ToastContextValue = {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback(
    (type: Toast["type"], title: string, description?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, type, title, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    [],
  );

  const success = useCallback(
    (title: string, description?: string) => push("success", title, description),
    [push],
  );
  const error = useCallback(
    (title: string, description?: string) => push("error", title, description),
    [push],
  );

  const dismiss = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}

      <div className="fixed bottom-6 right-6 z-100 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-xl border border-atlas-border bg-atlas-surface2 p-4 shadow-2xl"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-atlas-gold" />
            ) : (
              <XCircle className="mt-0.5 size-4 shrink-0 text-atlas-danger" />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-atlas-text">{toast.title}</p>
              {toast.description && (
                <p className="mt-0.5 text-xs text-atlas-textMuted">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-atlas-textMuted transition-colors hover:text-atlas-text"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}