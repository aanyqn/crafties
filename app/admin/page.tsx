"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  CheckCircle2,
  Banknote,
  FileText,
  Download,
  MoreHorizontal,
  TrendingUp,
  ArrowUpRight,
  X,
  Package,
  Clock,
  User,
  CreditCard,
  Hash,
  Info,
} from "lucide-react";
import { AreaChart } from "@tremor/react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STATS = {
  activeCrafters: 142,
  reportsSolvedRate: 94,
  monthlyGross: 45000000,
  totalArticles: 24,
};

const ANALYTICS_6_MONTHS = [
  { month: "Jan", gross: 20000000, commission: 2000000, withdrawal: 15000000 },
  { month: "Feb", gross: 25000000, commission: 2500000, withdrawal: 18000000 },
  { month: "Mar", gross: 22000000, commission: 2200000, withdrawal: 19000000 },
  { month: "Apr", gross: 30000000, commission: 3000000, withdrawal: 25000000 },
  { month: "May", gross: 35000000, commission: 3500000, withdrawal: 28000000 },
  { month: "Jun", gross: 45000000, commission: 4500000, withdrawal: 35000000 },
];

const RECENT_TRANSACTIONS = [
  {
    id: "ORD_99812",
    productName: "Handwoven Rattan Basket",
    extraItems: 1,
    detail: "Natural Brown, Large",
    price: 350000,
    user: "Alex Johnson",
    userId: "A3400",
    email: "alex.johnson@mail.com",
    timestamp: "2026-07-04T08:30:00Z",
    status: "Success",
    paymentMethod: "BCA Virtual Account",
    note: "Customer requested gift wrapping.",
  },
  {
    id: "ORD_99811",
    productName: "Ceramic Coffee Mug",
    extraItems: 0,
    detail: "Speckled White, 300ml",
    price: 125000,
    user: "Sarah Smith",
    userId: "A3401",
    email: "sarah.smith@mail.com",
    timestamp: "2026-07-03T14:20:00Z",
    status: "Success",
    paymentMethod: "GoPay",
    note: "",
  },
  {
    id: "ORD_99810",
    productName: "Beaded Friendship Bracelet",
    extraItems: 3,
    detail: "Custom Name, Rainbow",
    price: 85000,
    user: "Michael Lee",
    userId: "A3402",
    email: "michael.lee@mail.com",
    timestamp: "2026-07-03T09:15:00Z",
    status: "Pending",
    paymentMethod: "Mandiri Virtual Account",
    note: "Awaiting payment confirmation.",
  },
  {
    id: "ORD_99809",
    productName: "Knitted Amigurumi Bear",
    extraItems: 0,
    detail: "Brown, 15cm",
    price: 210000,
    user: "Emma Davis",
    userId: "A3403",
    email: "emma.davis@mail.com",
    timestamp: "2026-07-02T16:45:00Z",
    status: "Failed",
    paymentMethod: "QRIS",
    note: "Payment gateway timeout.",
  },
  {
    id: "ORD_99808",
    productName: "Batik Table Runner",
    extraItems: 2,
    detail: "Mega Mendung Pattern",
    price: 450000,
    user: "David Wilson",
    userId: "A3404",
    email: "david.wilson@mail.com",
    timestamp: "2026-07-01T11:00:00Z",
    status: "Success",
    paymentMethod: "BCA Virtual Account",
    note: "",
  },
];

type Transaction = typeof RECENT_TRANSACTIONS[0];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

/* Short label for Y-axis (e.g. "Rp 45Jt") */
const shortIDR = (n: number) =>
  n === 0
    ? "Rp 0"
    : n >= 1_000_000
    ? `Rp ${n / 1_000_000 % 1 === 0 ? n / 1_000_000 : (n / 1_000_000).toFixed(1)}M`
    : `Rp ${(n / 1_000).toFixed(0)}K`;

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Pending: "bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Failed:  "bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

// ─── Transaction Detail Modal ─────────────────────────────────────────────────

function TransactionDetailModal({
  tx,
  onClose,
}: {
  tx: Transaction;
  onClose: () => void;
}) {
  const totalWithExtras = tx.extraItems > 0
    ? `${formatIDR(tx.price)} (×${tx.extraItems + 1} items)`
    : formatIDR(tx.price);

  const rows = [
    { icon: Hash,        label: "Order ID",       value: tx.id, mono: true },
    { icon: Package,     label: "Product",        value: `${tx.productName}${tx.extraItems > 0 ? ` +${tx.extraItems} more` : ""}` },
    { icon: Info,        label: "Variant",        value: tx.detail },
    { icon: CreditCard,  label: "Amount",         value: totalWithExtras, bold: true },
    { icon: CreditCard,  label: "Payment Method", value: tx.paymentMethod },
    { icon: User,        label: "Customer",       value: `${tx.user} (${tx.userId})` },
    { icon: Clock,       label: "Timestamp",      value: formatTimestamp(tx.timestamp), mono: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] rounded-2xl shadow-2xl animate-modal-in
                      bg-white dark:bg-neutral-900
                      border border-neutral-200 dark:border-neutral-700">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b
                        border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
              {tx.id}
            </p>
            <h2 className="text-base font-bold mt-0.5
                           text-neutral-900 dark:text-neutral-100">
              Transaction Detail
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge status={tx.status} />
            <button
              title="close"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full transition-colors
                         text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                         dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          <div className="space-y-1">
            {rows.map(({ icon: Icon, label, value, mono, bold }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2.5 border-b last:border-0
                           border-neutral-50 dark:border-neutral-800/60"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={13} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
                </div>
                <span
                  className={`text-sm max-w-[200px] text-right truncate
                    ${mono  ? "font-mono text-xs text-neutral-500 dark:text-neutral-400" : ""}
                    ${bold  ? "font-bold text-neutral-900 dark:text-neutral-100" : "font-medium text-neutral-800 dark:text-neutral-200"}`}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Note */}
          {tx.note && (
            <div className="mt-4 p-3 rounded-xl border
                            bg-amber-50/50 dark:bg-amber-950/20
                            border-amber-200/60 dark:border-amber-800/40">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-0.5">
                Note
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                {tx.note}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl border text-sm font-medium transition-colors
                       border-neutral-200 dark:border-neutral-700
                       text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Animated Trend Chart ─────────────────────────────────────────────────────

const CustomTooltip = (props: any) => {
  const { payload, active } = props;
  
  if (!active || !payload || payload.length === 0) return null;

  const d = payload[0].payload;

  return (
    <div className="rounded-xl shadow-xl p-3 min-w-[152px] border bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-700 animate-in fade-in zoom-in-95 duration-200">
      <p className="text-[11px] font-bold pb-1.5 mb-1.5 border-b text-neutral-900 dark:text-neutral-100 border-neutral-100 dark:border-neutral-800">
        {d.month} 2025
      </p>
      <div className="space-y-1.5">
        {[
          { label: "Gross", val: formatIDR(d.gross), cls: "text-neutral-900 dark:text-neutral-100" },
          { label: "Commission", val: formatIDR(d.commission), cls: "text-emerald-600 dark:text-emerald-400" },
          { label: "Withdrawal", val: formatIDR(d.withdrawal), cls: "text-blue-600 dark:text-blue-400" },
        ].map(({ label, val, cls }) => (
          <div key={label} className="flex justify-between gap-3">
            <span className="text-[11px] text-neutral-400">{label}</span>
            <span className={`text-[11px] font-bold ${cls}`}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Chart Component ────────────────────────────────────────────────────

export function TrendChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[140px] sm:h-[190px] md:h-[210px]">
      <AreaChart
        className="h-full w-full stroke-[#0022ff] dark:stroke-[#0022ff] fill-neutral-400 dark:fill-neutral-500"
        data={data}
        index="month"
        categories={["gross"]}
        colors={["blue"]}
        valueFormatter={shortIDR}
        showLegend={false}
        showAnimation={true}
        animationDuration={1500}
        yAxisWidth={80}
        customTooltip={CustomTooltip}
        curveType="natural"
        showGridLines={false}
        showGradient={true}
        rotateLabelX={{ angle:20, verticalShift:10, xAxisHeight:40 }}
      />
    </div>
  );
}
// ─── Main Page ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    href:    "/admin/crafters",
    icon:    Users,
    iconBg:  "bg-blue-50 dark:bg-blue-500/10",
    iconCls: "text-[#0022FF] dark:text-blue-400",
    label:   "Active Crafters",
    value:   STATS.activeCrafters,
    suffix:  "",
    ring:    "hover:ring-blue-200/60 dark:hover:ring-blue-800/40",
  },
  {
    href:    "/admin/reports",
    icon:    CheckCircle2,
    iconBg:  "bg-emerald-50 dark:bg-emerald-500/10",
    iconCls: "text-emerald-600 dark:text-emerald-400",
    label:   "Reports Solved",
    value:   STATS.reportsSolvedRate,
    suffix:  "%",
    ring:    "hover:ring-emerald-200/60 dark:hover:ring-emerald-800/40",
  },
  {
    href:    "/admin/transactions",
    icon:    Banknote,
    iconBg:  "bg-purple-50 dark:bg-purple-500/10",
    iconCls: "text-purple-600 dark:text-purple-400",
    label:   "Monthly Gross",
    value:   formatIDR(STATS.monthlyGross),
    suffix:  "",
    ring:    "hover:ring-purple-200/60 dark:hover:ring-purple-800/40",
  },
  {
    href:    "/admin/articles",
    icon:    FileText,
    iconBg:  "bg-amber-50 dark:bg-amber-500/10",
    iconCls: "text-amber-600 dark:text-amber-400",
    label:   "Articles Published",
    value:   STATS.totalArticles,
    suffix:  "",
    ring:    "hover:ring-amber-200/60 dark:hover:ring-amber-800/40",
  },
];

export default function AdminDashboardPage() {
  const [exportDuration, setExportDuration] = useState("1");
  const [selectedTx, setSelectedTx]         = useState<Transaction | null>(null);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your platform's core metrics, financial analytics, and recent activities."
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ href, icon: Icon, iconBg, iconCls, label, value, suffix, ring }) => (
              <Link
                key={href}
                href={href}
                className={`group relative p-5 rounded-2xl border transition-all duration-200
                            bg-white dark:bg-neutral-900/50
                            border-neutral-200 dark:border-neutral-800/60
                            hover:shadow-md hover:-translate-y-0.5
                            hover:ring-2 ${ring}`}
              >
                {/* Arrow indicator */}
                <ArrowUpRight
                  size={14}
                  className="absolute top-4 right-4 text-neutral-300 dark:text-neutral-600
                             group-hover:text-neutral-500 dark:group-hover:text-neutral-400
                             transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
                    <Icon size={16} className={iconCls} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider
                                text-neutral-500 dark:text-neutral-400">
                    {label}
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-baseline gap-1">
                  {value}
                  {suffix && (
                    <span className="text-sm font-medium text-neutral-400">{suffix}</span>
                  )}
                </h3>

                <p className="text-[11px] mt-1.5 font-medium
                               text-neutral-400 dark:text-neutral-600
                               group-hover:text-[#0022FF] dark:group-hover:text-blue-400
                               transition-colors">
                  View details →
                </p>
              </Link>
            ))}
          </div>

          {/* ── 2. Chart + Analytics ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Animated Line Chart */}
            <div className="lg:col-span-1 rounded-2xl border p-5
                            bg-white dark:bg-neutral-900/50
                            border-neutral-200 dark:border-neutral-800/60">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Gross Transactions
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Last 6 months
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-500/10
                                text-[#0022FF] dark:text-blue-400">
                  <TrendingUp size={16} />
                </div>
              </div>
              <TrendChart data={ANALYTICS_6_MONTHS} />
            </div>

            {/* Analytics table */}
            <div className="rounded-2xl border overflow-hidden flex flex-col
                            bg-white dark:bg-neutral-900/50
                            border-neutral-200 dark:border-neutral-800/60">
              <div className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800/50">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Analytics Detail
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Financial breakdown
                </p>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/50 dark:bg-neutral-800/20
                                    text-neutral-500 dark:text-neutral-400">
                    <tr>
                      {["Period", "Gross", "Comm.", "W/D"].map((h, i) => (
                        <th
                          key={h}
                          className={`px-4 py-3 font-semibold uppercase tracking-wide
                                      ${i > 0 ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                    {ANALYTICS_6_MONTHS.slice().reverse().map((row) => (
                      <tr
                        key={row.month}
                        className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-semibold text-neutral-900 dark:text-neutral-200">
                          {row.month}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-neutral-700 dark:text-neutral-300">
                          {formatIDR(row.gross).replace("Rp", "")}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                          {formatIDR(row.commission).replace("Rp", "")}
                        </td>
                        <td className="px-4 py-3 text-right text-neutral-500 dark:text-neutral-400">
                          {formatIDR(row.withdrawal).replace("Rp", "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── 3. Recent Transactions ── */}
          <div className="rounded-2xl border overflow-hidden
                          bg-white dark:bg-neutral-900/50
                          border-neutral-200 dark:border-neutral-800/60">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5
                            border-b border-neutral-100 dark:border-neutral-800/50">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Recent Transactions
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Live feed of the latest platform orders
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  title="duration"
                  value={exportDuration}
                  onChange={(e) => setExportDuration(e.target.value)}
                  className="h-9 px-3 rounded-lg text-xs font-medium appearance-none cursor-pointer
                             bg-neutral-50 dark:bg-neutral-800
                             border border-neutral-200 dark:border-neutral-700
                             text-neutral-700 dark:text-neutral-300
                             focus:outline-none focus:border-[#0022FF] transition-colors"
                >
                  <option value="1">Last 1 Month</option>
                  <option value="2">Last 2 Months</option>
                  <option value="3">Last 3 Months</option>
                </select>
                <button
                  onClick={() => alert(`Exporting ${exportDuration} month(s) as CSV…`)}
                  className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold
                             text-white transition-colors
                             bg-neutral-900 hover:bg-neutral-800
                             dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-neutral-500 dark:text-neutral-400 border-b
                                  bg-neutral-50/50 dark:bg-neutral-800/20
                                  border-neutral-100 dark:border-neutral-800/50">
                  <tr>
                    {["ORD_ID", "Product Info", "User", "Timestamp", "Payment Status", "Action"].map(
                      (h, i) => (
                        <th
                          key={h}
                          className={`px-5 py-3 font-semibold uppercase tracking-wide text-[11px]
                                      ${i === 5 ? "text-right" : ""}`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-neutral-50/30 dark:hover:bg-neutral-800/20 transition-colors"
                    >
                      {/* ORD_ID */}
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-xs
                                     text-neutral-500 dark:text-neutral-400">
                        {tx.id}
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {tx.productName}
                          {tx.extraItems > 0 && (
                            <span className="text-neutral-400 font-normal ml-1.5 text-xs">
                              +{tx.extraItems}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {tx.detail}
                        </p>
                        <p className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mt-0.5">
                          {formatIDR(tx.price)}
                        </p>
                      </td>

                      {/* User */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs
                                     text-neutral-700 dark:text-neutral-300">
                        {tx.user} ({tx.userId})
                      </td>

                      {/* Timestamp */}
                      <td className="px-5 py-4 whitespace-nowrap font-mono text-xs
                                     text-neutral-500 dark:text-neutral-400">
                        {formatTimestamp(tx.timestamp)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={tx.status} />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg
                                     transition-colors
                                     text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100
                                     dark:hover:text-white dark:hover:bg-neutral-800"
                          title="View details"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

      {/* Transaction detail modal */}
      {selectedTx && (
        <TransactionDetailModal
          tx={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        @keyframes tooltip-in {
          from { opacity: 0; transform: translateY(4px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes dot-pop {
          from { opacity: 0; transform: scale(0);   }
          to   { opacity: 1; transform: scale(1);   }
        }
        .animate-modal-in   { animation: modal-in   0.18s ease-out both; }
        .animate-tooltip-in { animation: tooltip-in 0.12s ease-out both; }
      `}</style>
    </>
  );
}