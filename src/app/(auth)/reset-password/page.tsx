"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    // Temporary frontend-only delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    router.replace("/login");

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-atlas-bgLogin px-4">
      <div className="w-full max-w-109.75 rounded-xl border border-atlas-borderMuted bg-atlas-loginCard p-10">
        <div className="text-center">
          <p className="font-serif text-xl tracking-wide text-atlas-gold">
            ATLAS
          </p>

          <h1 className="mt-2 font-serif text-3xl text-atlas-text">
            Set a New Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-atlas-textMuted">
            Create a new password for your account.
            <br />
            Make sure it is secure and easy to remember.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="new-password"
              className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-text"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                placeholder="Enter your new password"
                className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 pr-10 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textPlaceholder transition-colors hover:text-atlas-text"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-text"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                disabled={isSubmitting}
                placeholder="Confirm your new password"
                className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 pr-10 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isSubmitting}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textPlaceholder transition-colors hover:text-atlas-text"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-atlas-danger/30 bg-atlas-danger/10 px-3 py-2 text-[13px] font-medium text-atlas-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-[13px] font-bold uppercase tracking-wider text-atlas-bg transition-all duration-200 hover:bg-atlas-goldLight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
