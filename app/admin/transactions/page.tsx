"use client";

import { useState, useMemo } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  ChevronDown,
  FolderOpen,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionType = "Purchase" | "Withdrawal";
type TransactionStatus = "Success" | "Pending" | "Gateway_Failed";

type AdminTransaction = {
  id: string;
  username: string;
  userId: string;
  crafterName: string;
  crafterId: string;
  type: TransactionType;
  amount: number;
  platformFee: number; // Potongan komisi platform
  netAmount: number;   // Dana bersih untuk pengrajin
  status: TransactionStatus;
  updatedAt: string;   // ISO string
};

type FilterStatus = "All" | TransactionStatus;
type FilterType = "All" | TransactionType;

// ─── Mock Data ────────────────────────────────────────────────────────────────

const now = Date.now();
const mins  = (n: number) => new Date(now - n * 60_000).toISOString();
const hours = (n: number) => new Date(now - n * 3_600_000).toISOString();
const days  = (n: number) => new Date(now - n * 86_400_000).toISOString();

const INITIAL_TRANSACTIONS: AdminTransaction[] = [
  { id: "TX-012", username: "User 1", userId: "USR-001", crafterName: "Crafter 1", crafterId: "213", type: "Purchase", amount: 250000, platformFee: 25000, netAmount: 225000, status: "Success", updatedAt: mins(15) },
  { id: "TX-013", username: "User 2", userId: "USR-002", crafterName: "Crafter 2", crafterId: "214", type: "Purchase", amount: 450000, platformFee: 45000, netAmount: 405000, status: "Success", updatedAt: mins(45) },
  { id: "TX-014", username: "Crafter 1", userId: "USR-040", crafterName: "Crafter 1", crafterId: "213", type: "Withdrawal", amount: 1200000, platformFee: 0, netAmount: 1200000, status: "Pending", updatedAt: hours(1) },
  { id: "TX-015", username: "User 3", userId: "USR-120", crafterName: "Crafter 3", crafterId: "215", type: "Purchase", amount: 150000, platformFee: 15000, netAmount: 135000, status: "Gateway_Failed", updatedAt: hours(3) },
  { id: "TX-016", username: "User 4", userId: "USR-230", crafterName: "Crafter 1", crafterId: "213", type: "Purchase", amount: 300000, platformFee: 30000, netAmount: 270000, status: "Success", updatedAt: days(1) },
  { id: "TX-017", username: "Crafter 2", userId: "USR-123", crafterName: "Crafter 2", crafterId: "214", type: "Withdrawal", amount: 850000, platformFee: 0, netAmount: 850000, status: "Success", updatedAt: days(2) },
];

// ─── Helpers & Badges ─────────────────────────────────────────────────────────

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const d = Math.floor(hrs / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case "Success":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800">
          <CheckCircle2 size={12} /> Success
        </span>
      );
    case "Pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800">
          <Clock size={12} /> Pending
        </span>
      );
    case "Gateway_Failed":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800">
          <AlertCircle size={12} /> Gateway Failed
        </span>
      );
  }
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [typeFilter, setTypeFilter] = useState<FilterType>("All");

  // ── Filtered List ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return transactions.filter((t) => {
      const matchSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.username.toLowerCase().includes(q) ||
        t.userId.toLowerCase().includes(q) ||
        t.crafterId.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchType = typeFilter === "All" || t.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [transactions, search, statusFilter, typeFilter]);

  // ── Financial Stats Compilation ──────────────────────────────────────────────
  const stats = useMemo(() => {
    let totalVolume = 0;      // Total perputaran uang bruto
    let totalCommission = 0;  // Total pemotongan komisi platform
    let totalWithdrawals = 0; // Total pencairan dana sukses

    transactions.forEach((t) => {
      if (t.status === "Success") {
        if (t.type === "Purchase") {
          totalVolume += t.amount;
          totalCommission += t.platformFee;
        } else if (t.type === "Withdrawal") {
          totalWithdrawals += t.amount;
        }
      }
    });

    return { totalVolume, totalCommission, totalWithdrawals };
  }, [transactions]);

  // ── Export Handler ──────────────────────────────────────────────────────────
  const handleExport = () => {
    // Sesuai alur flow poin 4, admin dapat mengunduh dokumen digital
    alert("Downloading financial report as CSV/PDF summary...");
  };

  return (
    <>
      <AdminHeader
        title="Transactions"
        description="Monitor platform cashflow, platform fees, withdrawals, and gateway statuses real-time."
      />

      <main className="flex-1 p-3 sm:p-6 overflow-auto">
        
        {/* ── Financial Stats Overview ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 bg-blue-50/40 dark:bg-blue-950/20">
            <p className="text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">Total Gross Volume</p>
            <p className="text-2xl font-bold text-[#0022FF] dark:text-[#4d6bff]">{formatIDR(stats.totalVolume)}</p>
          </div>
          <div className="rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 bg-emerald-50/40 dark:bg-emerald-950/20">
            <p className="text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">Platform Commissions Net</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatIDR(stats.totalCommission)}</p>
          </div>
          <div className="rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 bg-purple-50/40 dark:bg-purple-950/20">
            <p className="text-xs font-medium mb-1 text-neutral-500 dark:text-neutral-400">Successful Withdrawals</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatIDR(stats.totalWithdrawals)}</p>
          </div>
        </div>

        {/* ── Table Card Container ── */}
        <div className="rounded-2xl border overflow-hidden bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
          
          {/* Toolbar (Sesuai Layout wireframe pada berkas image_de55fe.png) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[140px] max-w-[320px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search ID, User, or Crafter ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm transition-all bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#0022FF]"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                title="method"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium cursor-pointer transition-all bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF]"
              >
                <option value="All">All Types</option>
                <option value="Purchase">Purchase</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                title="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium cursor-pointer transition-all bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF]"
              >
                <option value="All">All Status</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Gateway_Failed">Gateway Failed</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Export Document Button (Flow Poin 4 & Wireframe berkas image_de561d.png) */}
            <button
              onClick={handleExport}
              className="ml-auto flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 transition-colors border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              <Download size={15} />
              Export Reports
            </button>
          </div>

          {/* ── Table Layout (Sesuai Referensi Kolom Wireframe berkas image_de561d.png) ── */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {["Transaction ID", "Username / User ID", "Crafter ID", "Financial Flow", "Gateway Status", "Logged Time"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap text-neutral-400 dark:text-neutral-500 ${
                          i === 3 ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  /* State Kosong Sesuai Rancangan berkas image_de55fe.png */
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                          <FolderOpen size={28} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          No transactions found
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600">
                          Try adjusting your active cashflow filters or search parameters.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Transaction ID */}
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-neutral-400 dark:text-neutral-500">
                        {tx.id}
                      </td>

                      {/* Username (User ID) */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {tx.username}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          ({tx.userId})
                        </p>
                      </td>

                      {/* Crafter ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          Crafter ({tx.crafterId})
                        </span>
                      </td>

                      {/* Financial Flow Detail (Gross, Fee, Net) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex flex-col items-end">
                          <span className={`text-sm font-bold flex items-center gap-1 ${tx.type === "Purchase" ? "text-emerald-600 dark:text-emerald-400" : "text-purple-600 dark:text-purple-400"}`}>
                            {tx.type === "Purchase" ? <ArrowDownLeft size={13} /> : <ArrowUpRight size={13} />}
                            {formatIDR(tx.amount)}
                          </span>
                          {tx.type === "Purchase" && (
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                              Platform Fee: -{formatIDR(tx.platformFee)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>

                      {/* Logged Time */}
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-neutral-500 dark:text-neutral-400">
                        {timeAgo(tx.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}