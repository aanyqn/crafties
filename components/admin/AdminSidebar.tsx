"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Users, Hammer, Tag, ReceiptText, BarChart2, Newspaper } from "lucide-react";
import { useAdminContext } from "@/components/admin/AdminContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "users", label: "Users", href: "/admin/users", icon: Users },
  { id: "crafters", label: "Crafters", href: "/admin/crafters", icon: Hammer },
  { id: "categories", label: "Categories", href: "/admin/categories", icon: Tag },
  { id: "transactions", label: "Transactions", href: "/admin/transactions", icon: ReceiptText },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: BarChart2 },
  { id: "articles", label: "Articles", href: "/admin/articles", icon: Newspaper },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarOpen, closeSidebar } = useAdminContext();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo row */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <Link href="/" className="flex items-center" onClick={closeSidebar}>
          <Image src="/assets/img/LOGO-2.png" alt="Crafties" width={90} height={24} className="h-5 w-auto" />
        </Link>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full ms-2 text-[11px] font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800">
          Admin
        </span>
        {/* Close button — only visible on mobile */}
        <button
          id="admin-sidebar-close"
          onClick={closeSidebar}
          aria-label="Close sidebar"
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg
                     text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                     dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        <ul className="space-y-0.5 list-none p-0 m-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  id={`admin-nav-${item.id}`}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? "bg-[#0022FF] text-white shadow-sm shadow-blue-200 dark:shadow-none"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                    }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-neutral-400 dark:text-neutral-500"} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0022FF] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">Admin Crafties</p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">admin@crafties.id</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar — always visible on lg+ ── */}
      <aside className="hidden lg:flex w-[220px] flex-shrink-0 h-screen sticky top-0 flex-col
                        bg-white dark:bg-neutral-950
                        border-r border-neutral-200 dark:border-neutral-800">
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
            onClick={closeSidebar}
            aria-hidden="true"
          />

          {/* Drawer panel — slides in from the left */}
          <aside
            className="relative w-[260px] max-w-[80vw] h-full flex-shrink-0 flex flex-col
                       bg-white dark:bg-neutral-950
                       border-r border-neutral-200 dark:border-neutral-800
                       shadow-2xl animate-slide-in-left"
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      <style>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.22s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
      `}</style>
    </>
  );
}
