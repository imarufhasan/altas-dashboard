"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/src/lib/auth";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";

export function LogoutModal({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    router.replace("/login");
  };

  return (
    <ConfirmModal
      open
      onClose={onCancel}
      onConfirm={handleLogout}
      title="Log Out"
      description="Are you sure you want to log out of the Atlas Admin Panel?"
      confirmText="Log Out"
    />
  );
}
