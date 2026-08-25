"use client";

import { useState } from "react";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { Topbar } from "@/src/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-atlas-bg">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-60">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}