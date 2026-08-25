"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { saveSession } from "@/src/lib/auth";
import { Spinner } from "@/src/components/ui/Spinner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("test@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // Dummy API-like delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dummyToken = "atlas-demo-token";

    const dummyUser = {
      id: "admin-001",
      name: "Atlas Admin",
      email,
      role: "admin",
    };

    saveSession(dummyToken, dummyUser);

    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-atlas-bgLogin px-4">
      <div className="w-full max-w-109.75 rounded-xl border border-atlas-borderMuted bg-atlas-loginCard p-10">
        {/* Header */}
        <div className="text-center">
          <p className="font-serif text-xl tracking-wide text-atlas-gold">
            ATLAS
          </p>

          <h1 className="mt-2 font-serif text-3xl text-atlas-text">
            Admin Sign In
          </h1>

          <p className="mt-2 text-sm text-atlas-textMuted">
            Sign in to manage LMCS website content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-atlas-text">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              placeholder="Enter your admin email"
              className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-atlas-text">
                Password
              </label>

              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                className="text-[12px] font-semibold text-atlas-gold hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-atlas-borderMuted bg-transparent px-4 py-2.5 pr-10 text-sm text-atlas-text outline-none transition-colors placeholder:text-atlas-textPlaceholder focus:border-atlas-gold disabled:opacity-60"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-textPlaceholder transition-colors hover:text-atlas-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-atlas-gold py-3 text-[13px] font-bold uppercase tracking-wider text-atlas-bg transition-all duration-200 hover:bg-atlas-goldLight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
