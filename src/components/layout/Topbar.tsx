"use client";

import { useState } from "react";
import {
  Bell,
  HelpCircle,
  Menu,
  User,
  Settings,
  LogOut,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { dummyUser } from "@/src/lib/dummy-data";
import { clearSession } from "@/src/lib/auth";
import { Modal } from "../ui/Modal";
import { ConfirmModal } from "../ui/ConfirmModal";

type TopbarProps = {
  onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const logout = () => {
    clearSession();
    router.replace("/login");
  };

  const initials = dummyUser.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-atlas-border bg-atlas-bg/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowProfile(false);
              }}
              className="relative rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text"
              title="Notifications"
            >
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-atlas-gold" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 z-50 w-[300px] overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface shadow-2xl">
                <div className="flex items-center justify-between border-b border-atlas-border px-4 py-3">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="text-[11px] text-atlas-gold">3 new</span>
                </div>

                {[
                  "New inquiry received",
                  "Homepage was updated",
                  "Insight published",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setShowNotifications(false)}
                    className="flex w-full items-start gap-3 border-b border-atlas-border px-4 py-3 text-left hover:bg-atlas-bg"
                  >
                    <span className="mt-1 size-2 rounded-full bg-atlas-gold" />
                    <span className="text-sm text-atlas-textMuted">{item}</span>
                  </button>
                ))}

                <button className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-atlas-gold hover:bg-atlas-bg">
                  <Check className="size-3" />
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowHelp(true)}
            className="hidden rounded-lg p-2 text-atlas-textMuted hover:bg-atlas-surface hover:text-atlas-text sm:block"
            title="Help"
          >
            <HelpCircle className="size-[18px]" />
          </button>

          <div className="mx-1 hidden h-6 w-px bg-atlas-border sm:block" />

          <div className="relative">
            <button
              onClick={() => {
                setShowProfile((v) => !v);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-atlas-surface"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-atlas-surface3 text-[11px] font-bold text-atlas-textMuted">
                {initials}
              </div>

              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-atlas-text">
                  {dummyUser.name}
                </p>
                <p className="text-[10px] text-atlas-textMuted">
                  Administrator
                </p>
              </div>
            </button>

            {showProfile && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-atlas-border bg-atlas-surface shadow-2xl">
                <button
                  onClick={() => router.push("/settings")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
                >
                  <User className="size-4" />
                  Profile
                </button>

                <button
                  onClick={() => router.push("/settings")}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-atlas-textMuted hover:bg-atlas-bg hover:text-atlas-text"
                >
                  <Settings className="size-4" />
                  Settings
                </button>

                <button
                  onClick={() => {
                    setShowLogoutConfirm(true);
                    setShowProfile(false);
                  }}
                  className="flex w-full items-center gap-3 border-t border-atlas-border px-4 py-3 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <LogOut className="size-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Modal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="Help & Support"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-atlas-textMuted">
            Use the sidebar to manage website pages, insights, inquiries, legal
            content and system settings.
          </p>

          <div className="rounded-lg border border-atlas-border bg-atlas-bg p-4">
            <p className="text-sm font-semibold">Need assistance?</p>
            <p className="mt-1 text-xs text-atlas-textMuted">
              Contact your system administrator for account or publishing
              issues.
            </p>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Log Out?"
        description="Are you sure you want to log out of your administrator account?"
        confirmText="Log Out"
      />
    </>
  );
}
