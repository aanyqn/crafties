"use client";

import { Bell, Settings, Menu, Package, Truck, CheckCircle2, X, AlertCircle, User, UserCheck, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAdminContext } from "@/components/admin/AdminContext";
import Link from "next/link";
import { MOCK_ORDERS } from "@/app/crafter/orders/page";
import { OrderStatus } from "@/app/crafter/page";
import { useEffect, useRef, useState } from "react";
import { INITIAL_REPORTS } from "@/app/admin/reports/page";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminHeaderProps {
  title: string;
  description?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimeAgo(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // in seconds

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const getNotificationConfig = (status: OrderStatus) => {
  switch (status) {
    case "New":
      return { icon: Package, title: "New Order Received!", color: "text-[#0022FF] dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" };
    case "Process":
      return { icon: Package, title: "Order is Processing", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" };
    case "On Delivery":
      return { icon: Truck, title: "Order Dispatched", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" };
    case "Completed":
      return { icon: CheckCircle2, title: "Order Completed", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" };
    default:
      return { icon: Bell, title: "Order Update", color: "text-neutral-600", bg: "bg-neutral-100" };
  }
};

const getReportNotificationConfig = (status: string) => {
  switch (status) {
    case "Open":
      return { icon: AlertCircle, title: "New Dispute Report", color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10" };
    case "Resolved":
      return { icon: CheckCircle2, title: "Dispute Resolved", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" };
    default:
      return { icon: Bell, title: "Report Update", color: "text-neutral-600", bg: "bg-neutral-100" };
  }
};

// ─── Notification Modal Component ─────────────────────────────────────────────

function NotificationModal({ onClose }: { onClose: () => void }) {
  const totalNotifications = MOCK_ORDERS.length + INITIAL_REPORTS.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:items-start sm:justify-end sm:pt-[72px] sm:pr-6 p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-transparent sm:backdrop-blur-none pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-[400px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl animate-modal-in flex flex-col pointer-events-auto max-h-[85vh] sm:max-h-[calc(100vh-100px)]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Notifications</h2>
            <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-[#0022FF] text-white rounded-full">
              {totalNotifications}
            </span>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="p-1.5 -mr-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Notification List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1">

          {/* Map Orders */}
          {MOCK_ORDERS.slice(0, 2).map((order) => {
            const { icon: Icon, title, color, bg } = getNotificationConfig(order.status);
            const firstItemName = order.items[0]?.name || "Product";
            const extraItems = order.items.length > 1 ? ` +${order.items.length - 1} more` : "";

            return (
              <div
                key={order.id}
                className="group flex gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {title}
                    </p>
                    <span className="text-[10px] font-medium text-neutral-400 shrink-0">
                      {formatTimeAgo(order.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    <span className="font-mono text-neutral-400 dark:text-neutral-500">{order.id}</span> • {order.user.split(" (")[0]}
                  </p>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1 truncate">
                    {firstItemName}{extraItems}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Map Reports */}
          {INITIAL_REPORTS.slice(0, 2).map((report) => {
            const { icon: Icon, title, color, bg } = getReportNotificationConfig(report.status);

            return (
              <div
                key={report.id}
                className="group flex gap-4 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center ${bg}`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {title}
                    </p>
                    <span className="text-[10px] font-medium text-neutral-400 shrink-0">
                      {formatTimeAgo(report.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    <span className="font-mono text-neutral-400 dark:text-neutral-500">{report.id}</span> • {report.username}
                  </p>
                  <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mt-1 truncate">
                    {report.problemCategory} (Order: {report.orderId})
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 shrink-0">
          <Link
            href="/crafter/orders"
            onClick={onClose}
            className="flex items-center justify-center w-full h-9 rounded-xl text-xs font-semibold text-[#0022FF] dark:text-blue-400 bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  const { toggleSidebar } = useAdminContext();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Calculate unread count for both orders and reports
  const unreadOrders = MOCK_ORDERS.filter(o => o.status === "New").length;
  const unreadReports = INITIAL_REPORTS.filter(r => r.status === "Open").length;
  const unreadCount = unreadOrders + unreadReports;

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 flex-shrink-0
                        bg-white dark:bg-neutral-950
                        border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — only on mobile (<lg) */}
          <button
            id="admin-header-menu-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0
                     text-neutral-500 dark:text-neutral-400
                     hover:bg-neutral-100 dark:hover:bg-neutral-800
                     hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-tight truncate">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5 truncate hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <ThemeToggle />
          {/* Notification Bell */}
          <div className="relative">
            <button
              title="notification"
              onClick={() => setIsNotifOpen(true)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isNotifOpen
                ? "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-200 dark:text-neutral-300 dark:hover:bg-neutral-700"
                }`}
            >
              <Bell size={18} />
              {/* Unread Indicator */}
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-950" />
              )}
            </button>
          </div>
          <div className="relative group">
            {/* ── Trigger Button ── */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Account"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer
                   text-neutral-700 dark:text-neutral-300
                   hover:bg-neutral-100 dark:hover:bg-neutral-800
                   hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <User size={20} />
            </button>
            {/* ── Dropdown Menu ── */}
            <div
              className={`absolute right-0 top-full pt-2 transition-all duration-200 z-[110]
                  md:group-hover:opacity-100 md:group-hover:visible
                  ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
            >
              <div className="w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-2 flex flex-col">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                  <p className="text-sm font-bold text-neutral-900 dark:text-white">My Account</p>
                </div>

                <Link
                  href="/products"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-orange-800 dark:text-orange-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-orange-950 dark:hover:text-orange-100 transition-colors"
                >
                  <User size={16} />
                  Login as User
                </Link>

                <Link
                  href="/crafter"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-500 dark:text-emerald-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-emerald-700 dark:hover:text-emerald-700 transition-colors"
                >
                  <UserCheck size={16} />
                  Login as Crafter
                </Link>

                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-700 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {isNotifOpen && <NotificationModal onClose={() => setIsNotifOpen(false)} />}

      <style>{`
        @keyframes modal-in {
            from { opacity: 0; transform: scale(0.96) translateY(-8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </>
  );
}