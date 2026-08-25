import { Suspense } from "react";
import VerifyCodeContent from "./VerifyCodeContent";


export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-atlas-bgLogin px-4">
          <div className="w-full max-w-109.75 rounded-xl border border-atlas-borderMuted bg-atlas-loginCard p-10 text-center">
            <p className="font-serif text-xl tracking-wide text-atlas-gold">
              ATLAS
            </p>

            <p className="mt-3 text-sm text-atlas-textMuted">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <VerifyCodeContent />
    </Suspense>
  );
}