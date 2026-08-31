"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  hasError,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  helperText?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md border bg-atlas-bg px-3 py-2.5 pr-10 text-sm text-atlas-text outline-none placeholder:text-atlas-textPlaceholder focus:border-atlas-gold ${
            hasError ? "border-atlas-danger" : "border-atlas-border"
          }`}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textMuted hover:text-atlas-text"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      {helperText && (
        <p className="mt-1.5 text-[11px] text-atlas-textMuted">{helperText}</p>
      )}
    </div>
  );
}

export function passwordStrength(pw: string) {
  if (!pw) return { label: "", pct: 0, tone: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const levels = [
    { label: "Weak", pct: 25, tone: "bg-atlas-danger" },
    { label: "Fair", pct: 50, tone: "bg-amber-400" },
    { label: "Good", pct: 75, tone: "bg-atlas-gold" },
    { label: "Strong", pct: 100, tone: "bg-green-400" },
  ];

  return levels[Math.max(0, score - 1)] ?? levels[0];
}
