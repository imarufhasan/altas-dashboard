"use client";

import { useRef, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

const CODE_LENGTH = 6;

export default function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(
    Array(CODE_LENGTH).fill(""),
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const next = [...digits];
    next[index] = digit;

    setDigits(next);
    setError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const otp = digits.join("");

    if (otp.length < CODE_LENGTH) {
      setError("Please enter the full code");
      return;
    }

    setIsSubmitting(true);

    // Temporary frontend-only delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push("/reset-password");

    setIsSubmitting(false);
  };

  const handleResend = async () => {
    setIsResending(true);

    // Temporary frontend-only delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsResending(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-atlas-bgLogin px-4">
      <div className="w-full max-w-109.75 rounded-xl border border-atlas-borderMuted bg-atlas-loginCard p-6 sm:p-10">
        <div className="text-center">
          <p className="font-serif text-xl tracking-wide text-atlas-gold">
            ATLAS
          </p>

          <h1 className="mt-2 font-serif text-3xl text-atlas-text">
            Verification Code
          </h1>

          <p className="mt-2 text-sm leading-6 text-atlas-textMuted">
            We sent a verification code to
            <br />
            <span className="font-medium text-atlas-text">
              {email || "your email"}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="flex justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isSubmitting}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="size-10 rounded-lg border border-atlas-borderMuted bg-transparent text-center text-base font-semibold text-atlas-text outline-none transition-colors focus:border-atlas-gold disabled:opacity-60 sm:size-12"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm font-medium text-atlas-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-[13px] font-bold uppercase tracking-wider text-atlas-bg transition-all duration-200 hover:bg-atlas-goldLight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </button>

          <p className="text-center text-[12px] text-atlas-textMuted">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-atlas-gold transition-colors hover:text-atlas-goldLight disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? "Resending..." : "Resend"}
            </button>
          </p>

          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            disabled={isSubmitting}
            className="w-full text-center text-[12px] font-semibold text-atlas-textMuted transition-colors hover:text-atlas-gold"
          >
            Change Email
          </button>
        </form>
      </div>
    </div>
  );
}