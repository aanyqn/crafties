"use client";

import { useState, useMemo } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { MOCK_ADMIN_USERS } from "@/data/mockAdminUsers";
import { AdminUser, UserRole, UserStatus } from "@/types/adminUser";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  ShieldOff,
  ShieldCheck,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  UserCircle2,
} from "lucide-react";

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS: Record<string, string> = {
  A: "#0022FF", B: "#7C3AED", C: "#DB2777", D: "#D97706",
  E: "#059669", F: "#DC2626", G: "#2563EB", H: "#9333EA",
  I: "#16A34A", J: "#EA580C", K: "#0891B2", L: "#BE185D",
  M: "#6D28D9", N: "#1D4ED8", O: "#7C2D12", P: "#065F46",
  Q: "#86198F", R: "#B45309", S: "#0F766E", T: "#9D174D",
  U: "#1E3A5F", V: "#4C1D95", W: "#7F1D1D", X: "#134E4A",
  Y: "#3730A3", Z: "#713F12",
};
function avatarColor(name: string) {
  const letter = name[0]?.toUpperCase() ?? "A";
  return AVATAR_COLORS[letter] ?? "#0022FF";
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, { label: string; cls: string }> = {
    Active: { label: "Active", cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800" },
    Suspended: { label: "Suspended", cls: "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800" },
    Inactive: { label: "Inactive", cls: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700" },
  };
  const { label, cls } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Role badge ─── */
function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; cls: string }> = {
    Buyer: { label: "Buyer", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800" },
    Crafter: { label: "Crafter", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-800" },
    Admin: { label: "Admin", cls: "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:ring-purple-800" },
  };
  const { label, cls } = map[role];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Confirm modal ─── */
interface ConfirmModalProps {
  user: AdminUser;
  action: "suspend" | "restore";
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmModal({ user, action, onConfirm, onCancel }: ConfirmModalProps) {
  const isSuspend = action === "suspend";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      id="confirm-modal-overlay"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      {/* Card */}
      <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[400px] p-6
                      border border-neutral-200 dark:border-neutral-700 animate-modal-in">
        {/* Close */}
        <button
          title="confirm-modal"
          id="confirm-modal-close"
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full
                     text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                     dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
          ${isSuspend ? "bg-red-50 dark:bg-red-950" : "bg-emerald-50 dark:bg-emerald-950"}`}>
          {isSuspend
            ? <ShieldOff size={22} className="text-red-600 dark:text-red-400" />
            : <ShieldCheck size={22} className="text-emerald-600 dark:text-emerald-400" />}
        </div>

        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 text-center mb-1">
          {isSuspend ? "Suspend Account?" : "Restore Account?"}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-5 leading-relaxed">
          {isSuspend
            ? <>Are you sure you want to suspend  <strong className="text-neutral-800 dark:text-neutral-200">{user.username}</strong>? They won't be able to access Crafties.</>
            : <>Are you sure you want to restore <strong className="text-neutral-800 dark:text-neutral-200">{user.username}</strong>? They will be able to access Crafties again</>
          }
        </p>

        {/* User info chip */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-5 border border-neutral-200 dark:border-neutral-700">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: avatarColor(user.username) }}
          >
            {getInitials(user.username)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{user.username}</p>
            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
          </div>
          <div className="ml-auto">
            <RoleBadge role={user.role} />
          </div>
        </div>

        {/* Warning */}
        {isSuspend && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 mb-5">
            <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
              This action will immediately update the account status. You can restore it at any time.
            </p>
          </div>
        )}
        {!isSuspend && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 mb-5">
            <CheckCircle2 size={15} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              The account will be restored and the user can use Crafties again.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            id="confirm-modal-cancel"
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700
                       text-sm font-medium text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-modal-confirm"
            onClick={onConfirm}
            className={`flex-1 h-10 rounded-xl text-sm font-semibold text-white transition-colors
              ${isSuspend
                ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                : "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"}`}
          >
            {isSuspend ? "Yes, Suspend" : "Yes, Restore"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Detail modal ─── */
interface DetailModalProps {
  user: AdminUser;
  onClose: () => void;
  onSuspend: () => void;
  onRestore: () => void;
}
function DetailModal({ user, onClose, onSuspend, onRestore }: DetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[460px]
                      border border-neutral-200 dark:border-neutral-700 animate-modal-in overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 border-b border-neutral-100 dark:border-neutral-800">
          <button
            title="close-detail-modal"
            id="detail-modal-close"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full
                       text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                       dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: avatarColor(user.username) }}
            >
              {getInitials(user.username)}
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{user.username}</h2>
              <p className="text-sm text-neutral-400 dark:text-neutral-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 py-4 space-y-3">
          {[
            { label: "User ID", value: user.id },
            { label: "Joined", value: formatDate(user.dateJoined) },
            { label: "Last Active", value: `${timeAgo(user.lastActive)} (${formatDate(user.lastActive)})` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
              <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        {user.role !== "Admin" && (
          <div className="px-6 pb-6 flex gap-2">
            {user.status === "Suspended" ? (
              <button
                id={`detail-restore-${user.id}`}
                onClick={onRestore}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                           bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                <ShieldCheck size={15} />
                Restore Account
              </button>
            ) : (
              <button
                id={`detail-suspend-${user.id}`}
                onClick={onSuspend}
                className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                           bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <ShieldOff size={15} />
                Suspend Account
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Action dropdown ─── */
interface ActionMenuProps {
  user: AdminUser;
  onView: () => void;
  onSuspend: () => void;
  onRestore: () => void;
  isOpen: boolean;
  onToggle: () => void;
}
function ActionMenu({ user, onView, onSuspend, onRestore, isOpen, onToggle }: ActionMenuProps) {
  return (
    <div className="relative">
      <button
        title="action-button"
        id={`action-menu-btn-${user.id}`}
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                   text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                   dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-30 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl
                        border border-neutral-200 dark:border-neutral-700 py-1 overflow-hidden">
          <button
            id={`action-view-${user.id}`}
            onClick={onView}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left"
          >
            <Eye size={14} className="text-neutral-400" />
            View Detail
          </button>

          {user.role !== "Admin" && (
            <>
              <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
              {user.status === "Suspended" ? (
                <button
                  id={`action-restore-${user.id}`}
                  onClick={onRestore}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-emerald-600 dark:text-emerald-400
                             hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors text-left"
                >
                  <ShieldCheck size={14} />
                  Restore Account
                </button>
              ) : (
                <button
                  id={`action-suspend-${user.id}`}
                  onClick={onSuspend}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 dark:text-red-400
                             hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left"
                >
                  <ShieldOff size={14} />
                  Suspend Account
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
type FilterRole = "All" | UserRole;
type FilterStatus = "All" | UserStatus;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("All");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);
  const [confirmState, setConfirmState] = useState<{
    user: AdminUser;
    action: "suspend" | "restore";
  } | null>(null);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter((u) => {
      const matchSearch =
        !q ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  /* ── Stats ── */
  const total = users.length;
  const active = users.filter((u) => u.status === "Active").length;
  const suspended = users.filter((u) => u.status === "Suspended").length;

  /* ── Actions ── */
  function handleConfirm() {
    if (!confirmState) return;
    const { user, action } = confirmState;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id
          ? { ...u, status: action === "suspend" ? "Suspended" : "Active" }
          : u
      )
    );
    // Sync detailUser if open
    if (detailUser?.id === user.id) {
      setDetailUser((prev) =>
        prev ? { ...prev, status: action === "suspend" ? "Suspended" : "Active" } : prev
      );
    }
    setConfirmState(null);
  }

  function openSuspend(user: AdminUser) {
    setOpenMenu(null);
    setDetailUser(null);
    setConfirmState({ user, action: "suspend" });
  }

  function openRestore(user: AdminUser) {
    setOpenMenu(null);
    setDetailUser(null);
    setConfirmState({ user, action: "restore" });
  }

  return (
    <>
      <AdminHeader
        title="Users"
        description="Manage and monitor all Crafties platform users"
      />

      <main className="flex-1 p-3 sm:p-6 overflow-auto">
        {/* ── Stats cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: "Total Users", value: total, color: "text-[#0022FF]", bg: "bg-blue-50 dark:bg-blue-950/40" },
            { label: "Active Accounts", value: active, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
            { label: "Suspended", value: suspended, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/40" },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 ${bg}`}
            >
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Table card ── */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
            {/* Search */}
            <div className="relative flex-1 min-w-[140px] max-w-[360px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              <input
                id="users-search-input"
                type="search"
                placeholder="Search name, email, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-900 dark:text-neutral-100
                           placeholder-neutral-400 dark:placeholder-neutral-500
                           focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30
                           transition-all"
              />
            </div>

            {/* Role filter */}
            <div className="relative">
              <select
                title="role-filter"
                id="users-filter-role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as FilterRole)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF]
                           cursor-pointer transition-all"
              >
                <option value="All">All Roles</option>
                <option value="Buyer">Buyer</option>
                <option value="Crafter">Crafter</option>
                <option value="Admin">Admin</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                title="status-filter"
                id="users-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800
                           border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF]
                           cursor-pointer transition-all"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
            </div>

            <p className="ml-auto text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap hidden sm:block">
              {filtered.length} of {total} users
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" id="users-table">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">User</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Role</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Date Joined</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Last Active</th>
                  <th className="px-4 py-3 text-right pr-5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                          <UserCircle2 size={28} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          No users found
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600">
                          Try adjusting your filters or search terms
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.id}
                      id={`user-row-${user.id}`}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0
                                 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors group"
                      onClick={() => setOpenMenu(null)}
                    >
                      {/* ID — hidden on mobile */}
                      <td className="hidden md:table-cell px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
                          {user.id}
                        </span>
                      </td>

                      {/* Username */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ backgroundColor: avatarColor(user.username) }}
                          >
                            {getInitials(user.username)}
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {user.username}
                          </span>
                        </div>
                      </td>

                      {/* Email — hidden on small screens */}
                      <td className="hidden sm:table-cell px-4 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>

                      {/* Date joined — hidden on mobile */}
                      <td className="hidden lg:table-cell px-4 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {formatDate(user.dateJoined)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={user.status} />
                      </td>

                      {/* Last active — hidden on mobile */}
                      <td className="hidden md:table-cell px-4 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {timeAgo(user.lastActive)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right pr-5" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu
                          user={user}
                          isOpen={openMenu === user.id}
                          onToggle={() => setOpenMenu((prev) => (prev === user.id ? null : user.id))}
                          onView={() => { setOpenMenu(null); setDetailUser(user); }}
                          onSuspend={() => openSuspend(user)}
                          onRestore={() => openRestore(user)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Detail modal ── */}
      {detailUser && (
        <DetailModal
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onSuspend={() => openSuspend(detailUser)}
          onRestore={() => openRestore(detailUser)}
        />
      )}

      {/* ── Confirm modal ── */}
      {confirmState && (
        <ConfirmModal
          user={confirmState.user}
          action={confirmState.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {/* Close dropdown on outside click */}
      {openMenu && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => setOpenMenu(null)}
        />
      )}

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.18s ease-out both; }
      `}</style>
    </>
  );
}
