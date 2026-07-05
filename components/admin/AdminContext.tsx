"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface AdminContextValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const AdminContext = createContext<AdminContextValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function useAdminContext() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <AdminContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </AdminContext.Provider>
  );
}
