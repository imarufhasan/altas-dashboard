"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import { fetchSiteSettings, updateSiteSettings } from "@/src/lib/fake-api";
import { SettingsSkeleton } from "@/src/components/settings/SettingsSkeleton";
import { Spinner } from "@/src/components/ui/Spinner";
import { SiteSettings } from "@/src/types";
// import { fetchSiteSettings, updateSiteSettings } from "@/lib/fake-api";
// import { SettingsSkeleton } from "@/components/settings/SettingsSkeleton";
// import { useToast } from "@/components/ToastProvider";
// import { Spinner } from "@/components/ui/Spinner";

export default function SettingsPage() {
  const { success, error: showError } = useToast();

  const [original, setOriginal] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    let active = true;

    fetchSiteSettings().then((res) => {
      if (active) {
        setOriginal(res);
        setForm(res);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const isDirty = Boolean(
    form && original && JSON.stringify(form) !== JSON.stringify(original),
  );

  const updateField = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleDiscard = () => {
    setForm(original);
    setEmailError("");
  };

  const handleSave = async () => {
    if (!form) return;

    setIsSaving(true);
    setEmailError("");

    try {
      const res = await updateSiteSettings(form);

      if (!res.success) {
        setEmailError(res.message);
        showError("Update Failed", res.message);
        return;
      }

      setOriginal(form);
      success("Settings Saved", res.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          Website <span className="text-atlas-gold">/ Settings</span>
        </p>
        <h1 className="mt-2 font-serif text-3xl text-atlas-text">Settings</h1>
        <p className="mt-1.5 text-sm text-atlas-textMuted">
          Manage basic website and CMS settings.
        </p>
      </div>

      {isDirty && !isLoading && (
        <div className="flex items-center justify-between rounded-lg border border-atlas-border bg-atlas-surface px-5 py-3.5">
          <div className="flex items-center gap-2.5 text-sm text-atlas-text">
            <AlertTriangle className="size-4 text-atlas-gold" />
            You have unsaved changes.
          </div>

          <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving}
              className="text-atlas-textMuted transition-colors hover:text-atlas-text disabled:opacity-50"
            >
              Discard
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="text-atlas-gold transition-colors hover:text-atlas-goldLight disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Now"}
            </button>
          </div>
        </div>
      )}

      {isLoading || !form ? (
        <SettingsSkeleton />
      ) : (
        <div className="space-y-10 pb-24">
          <section className="space-y-5">
            <h3 className="border-b border-atlas-border pb-2 text-[12px] font-bold uppercase tracking-wider text-atlas-gold">
              General Configuration
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <UnderlineField
                label="Website Name"
                value={form.websiteName}
                onChange={(v) => updateField("websiteName", v)}
              />
              <SelectField
                label="Website Status"
                value={form.websiteStatus}
                onChange={(v) => updateField("websiteStatus", v as SiteSettings["websiteStatus"])}
                options={["Active", "Maintenance", "Offline"]}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="border-b border-atlas-border pb-2 text-[12px] font-bold uppercase tracking-wider text-atlas-gold">
              Content Visibility
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <SelectField
                label="Default Content Visibility"
                value={form.defaultContentVisibility}
                onChange={(v) =>
                  updateField("defaultContentVisibility", v as SiteSettings["defaultContentVisibility"])
                }
                options={["Public", "Private"]}
              />
              <SelectField
                label="Unreleased Content"
                value={form.unreleasedContent}
                onChange={(v) =>
                  updateField("unreleasedContent", v as SiteSettings["unreleasedContent"])
                }
                options={["Hidden from Public", "Visible to Public"]}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="border-b border-atlas-border pb-2 text-[12px] font-bold uppercase tracking-wider text-atlas-gold">
              Public Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <UnderlineField
                  label="Public Contact Email"
                  value={form.publicContactEmail}
                  onChange={(v) => updateField("publicContactEmail", v)}
                  hasError={Boolean(emailError)}
                />
                {emailError && (
                  <p className="mt-1.5 text-[12px] font-medium text-atlas-danger">{emailError}</p>
                )}
              </div>

              <UnderlineField
                label="Public Phone"
                value={form.publicPhone}
                onChange={(v) => updateField("publicPhone", v)}
              />
            </div>
          </section>

          <section className="space-y-5">
            <h3 className="border-b border-atlas-border pb-2 text-[12px] font-bold uppercase tracking-wider text-atlas-gold">
              Security
            </h3>

            <BoxField label="Current Password" type="password" placeholder="••••••••" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <BoxField label="New Password" type="password" />
              <BoxField label="Confirm New Password" type="password" />
            </div>

            <button
              type="button"
              className="rounded-md border border-atlas-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-gold transition-colors hover:bg-atlas-gold hover:text-atlas-bg"
            >
              Update Credentials
            </button>
          </section>
        </div>
      )}

      {!isLoading && form && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-atlas-border bg-atlas-surface2 py-4 pl-60">
          <div className="flex justify-end gap-3 px-8">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={isSaving || !isDirty}
              className="rounded-md border border-atlas-border px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-text transition-colors hover:bg-atlas-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isDirty}
              className="flex items-center gap-2 rounded-md bg-atlas-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-bg transition-colors hover:bg-atlas-goldLight disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving && <Spinner className="size-3.5" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UnderlineField({
  label,
  value,
  onChange,
  hasError,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-b bg-transparent pb-2 text-sm text-atlas-text outline-none transition-colors focus:border-atlas-gold ${
          hasError ? "border-atlas-danger" : "border-atlas-border"
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-atlas-border bg-atlas-text px-3 py-2.5 text-sm font-medium text-atlas-bg outline-none focus:border-atlas-gold"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function BoxField({
  label,
  type = "text",
  placeholder,
}: {
  label: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-atlas-border bg-atlas-text px-3 py-2.5 text-sm text-atlas-bg outline-none placeholder:text-atlas-bg/40 focus:border-atlas-gold"
      />
    </div>
  );
}