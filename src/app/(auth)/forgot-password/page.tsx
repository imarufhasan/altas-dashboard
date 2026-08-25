"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("test@gmail.com");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Temporary frontend-only delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push(`/verify-code?email=${encodeURIComponent(email)}`);

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
            Forgot Password?
          </h1>

          <p className="mt-2 text-sm text-atlas-textMuted">
            Enter your email address and we&apos;ll send you a verification
            code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-text"
            >
              Email Address
            </label>

            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter your admin email"
              className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-[13px] font-bold uppercase tracking-wider text-atlas-bg transition-all duration-200 hover:bg-atlas-goldLight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Send Code"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            disabled={isSubmitting}
            className="w-full text-center text-[12px] font-semibold text-atlas-textMuted transition-colors hover:text-atlas-gold"
          >
            Back to Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
