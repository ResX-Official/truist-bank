"use client";
import { useState } from "react";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";

const AdminMenuContext = createContext<() => void>(() => {});
export function useAdminMenu() { return useContext(AdminMenuContext); }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname?.endsWith("/admin/login");

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen bg-[#0a0a0e] overflow-hidden">
      <div className="hidden lg:flex flex-col flex-shrink-0">
        <AdminSidebar />
      </div>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10"><AdminSidebar onClose={() => setSidebarOpen(false)} /></div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <AdminMenuContext.Provider value={() => setSidebarOpen(true)}>
          {children}
        </AdminMenuContext.Provider>
      </div>
    </div>
  );
}
