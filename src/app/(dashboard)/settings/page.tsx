"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/src/components/ToastProvider";
import {
  fetchSiteSettings,
  updateSiteSettings,
  updatePassword,
} from "@/src/lib/fake-api";
import { SettingsSkeleton } from "@/src/components/settings/SettingsSkeleton";
import { Spinner } from "@/src/components/ui/Spinner";
import {
  PasswordField,
  passwordStrength,
} from "@/src/components/settings/PasswordField";
import { SiteSettings } from "@/src/types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SettingsPage() {
  const { success, error: showError } = useToast();

  const [original, setOriginal] = useState<SiteSettings | null>(null);
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Password section state (independent from main form)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

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

  const updateField = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (key === "publicContactEmail") setEmailError("");
  };

  const handleDiscard = () => {
    setForm(original);
    setEmailError("");
  };

  const handleSave = async () => {
    if (!form) return;

    if (!EMAIL_REGEX.test(form.publicContactEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

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

  const strength = passwordStrength(newPassword);
  const passwordsFilled = currentPassword && newPassword && confirmPassword;

  const handleUpdatePassword = async () => {
    setPasswordError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await updatePassword({ currentPassword, newPassword });
      if (!res.success) {
        setPasswordError(res.message);
        showError("Update Failed", res.message);
        return;
      }

      success("Password Updated", res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const statusMeta: Record<
    SiteSettings["websiteStatus"],
    { dot: string; tone: string }
  > = {
    Active: { dot: "bg-green-400", tone: "text-green-400" },
    Maintenance: { dot: "bg-amber-400", tone: "text-amber-400" },
    Offline: { dot: "bg-atlas-danger", tone: "text-atlas-danger" },
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
            Website <span className="text-atlas-gold">/ Settings</span>
          </p>
          <h1 className="mt-2 font-serif text-3xl text-atlas-text">Settings</h1>
          <p className="mt-1.5 text-sm text-atlas-textMuted">
            Manage basic website and CMS settings.
          </p>
        </div>

        {!isLoading && form && (
          <div className="flex items-center gap-2 rounded-full border border-atlas-border bg-atlas-surface px-3.5 py-1.5">
            <span
              className={`size-2 rounded-full ${statusMeta[form.websiteStatus].dot}`}
            />
            <span
              className={`text-xs font-bold ${statusMeta[form.websiteStatus].tone}`}
            >
              {form.websiteStatus}
            </span>
          </div>
        )}
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
                onChange={(v) =>
                  updateField(
                    "websiteStatus",
                    v as SiteSettings["websiteStatus"],
                  )
                }
                options={["Active", "Maintenance", "Offline"]}
              />
            </div>

            <UnderlineField
              label="Tagline"
              value={form.tagline ?? ""}
              onChange={(v) => updateField("tagline", v)}
              maxLength={80}
            />

            {form.websiteStatus !== "Active" && (
              <div className="flex items-start gap-2.5 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <p className="text-xs leading-5 text-atlas-textMuted">
                  {form.websiteStatus === "Maintenance"
                    ? "The public site will display a maintenance notice to visitors while this status is active."
                    : "The public site will be completely inaccessible to visitors while this status is active."}
                </p>
              </div>
            )}
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
                  updateField(
                    "defaultContentVisibility",
                    v as SiteSettings["defaultContentVisibility"],
                  )
                }
                options={["Public", "Private"]}
              />
              <SelectField
                label="Unreleased Content"
                value={form.unreleasedContent}
                onChange={(v) =>
                  updateField(
                    "unreleasedContent",
                    v as SiteSettings["unreleasedContent"],
                  )
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
                  <p className="mt-1.5 text-[12px] font-medium text-atlas-danger">
                    {emailError}
                  </p>
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
            <div className="flex items-center justify-between border-b border-atlas-border pb-2">
              <h3 className="text-[12px] font-bold uppercase tracking-wider text-atlas-gold">
                Security
              </h3>
              <span className="text-[11px] text-atlas-textMuted">
                Changes here save independently of the form above
              </span>
            </div>

            <PasswordField
              label="Current Password"
              value={currentPassword}
              onChange={setCurrentPassword}
              placeholder="••••••••"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="At least 8 characters"
                />
                {newPassword && (
                  <div className="mt-2">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-atlas-border">
                      <div
                        className={`h-full transition-all ${strength.tone}`}
                        style={{ width: `${strength.pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-atlas-textMuted">
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Re-enter new password"
                  hasError={
                    Boolean(confirmPassword) && confirmPassword !== newPassword
                  }
                />
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                    {confirmPassword === newPassword ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-green-400" />
                        <span className="text-green-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <Circle className="size-3.5 text-atlas-danger" />
                        <span className="text-atlas-danger">
                          Passwords do not match
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {passwordError && (
              <p className="text-[12px] font-medium text-atlas-danger">
                {passwordError}
              </p>
            )}

            <button
              type="button"
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword || !passwordsFilled}
              className="flex items-center gap-2 rounded-md border border-atlas-gold px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider text-atlas-gold transition-colors hover:bg-atlas-gold hover:text-atlas-bg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-atlas-gold"
            >
              {isUpdatingPassword && <Spinner className="size-3.5" />}
              {isUpdatingPassword ? "Updating..." : "Update Credentials"}
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
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-atlas-textMuted">
          {label}
        </label>
        {maxLength && (
          <span className="text-[11px] text-atlas-textPlaceholder">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      <input
        type="text"
        value={value}
        maxLength={maxLength}
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
        className="w-full rounded-md border border-atlas-border bg-atlas-bg px-3 py-2.5 text-sm font-medium text-atlas-text outline-none focus:border-atlas-gold"
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
