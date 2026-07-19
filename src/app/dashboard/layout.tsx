"use client";

import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import Sidebar from "@/component/common/Sidebar";
import ProtectedRoute from "@/component/ProtectedRoute";
import useStorageRefreshInitializer from "@/hooks/useStorageRefreshInitializer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useStorageRefreshInitializer();

  return (
    <ProtectedRoute requireAuth={true} requireAdmin={true}>
      <div className="dashboard-layout flex h-screen overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="dashboard-main flex-grow lg:ml-0 w-full min-w-0 flex flex-col overflow-hidden">
          <div className="lg:hidden border-b px-4 py-2.5 animate-slide-in-left flex-shrink-0" style={{ backgroundColor: "var(--background-alt)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between max-w-full">
              <button onClick={() => setSidebarOpen(true)} className="smooth-transition p-1 -ml-1 hover:scale-110 active:scale-95 rounded-lg" style={{ color: "var(--foreground)" }} aria-label="Open menu">
                <FiMenu size={20} />
              </button>
              <h1 className="font-semibold text-sm truncate px-2 animate-fade-in" style={{ color: "var(--foreground)" }}>Dashboard</h1>
              <div className="w-5"></div>
            </div>
          </div>

          <div className="dashboard-content flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
