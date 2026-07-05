import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminProvider } from "@/components/admin/AdminContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <AdminSidebar />
        {/* Main content – shifts right of sidebar on desktop */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </AdminProvider>
  );
}
