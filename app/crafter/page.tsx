"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    CheckCircle2,
    Banknote,
    FileText,
    Download,
    TrendingUp,
    ArrowUpRight,
    X,
    Package,
    Clock,
    User,
    CreditCard,
    Hash,
    Info,
    Shapes,
    Search,
    Truck,
    Eye,
    ChevronRight
} from "lucide-react";
import { AreaChart } from "@tremor/react";

// ─── Types & Interfaces ───────────────────────────────────────────────────────

export type OrderStatus = "New" | "Process" | "On Delivery" | "Completed";
export type PaymentStatus = "Paid";

export interface OrderItem {
    id: string;
    name: string;
    detail: string;
    price: number;
    qty: number;
}

export interface Order {
    id: string;
    user: string;
    address: string;
    timestamp: string; // ISO String
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: OrderItem[];
    trackingNumber?: string;
    // Financial breakdown
    subtotal: number;
    shippingFee: number;
    platformFee: number;
    totalEarnings: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-99812",
        user: "Alex Johnson (A3400)",
        address: "Jl. Mawar No. 15, Surabaya, Jawa Timur 60281",
        timestamp: "2026-07-04T08:30:00Z",
        status: "New",
        paymentStatus: "Paid",
        items: [
            { id: "P1", name: "Handwoven Rattan Basket", detail: "Natural Brown, Large", price: 350000, qty: 1 },
            { id: "P2", name: "Rattan Coaster", detail: "Set of 4", price: 50000, qty: 1 },
        ],
        subtotal: 400000,
        shippingFee: 25000,
        platformFee: 20000,
        totalEarnings: 380000,
    },
    {
        id: "ORD-99811",
        user: "Sarah Smith (A3401)",
        address: "Apartemen Sudirman Tower C/12, Jakarta Selatan",
        timestamp: "2026-07-03T14:20:00Z",
        status: "Process",
        paymentStatus: "Paid",
        items: [
            { id: "P3", name: "Ceramic Coffee Mug", detail: "Speckled White, 300ml", price: 125000, qty: 2 },
        ],
        subtotal: 250000,
        shippingFee: 15000,
        platformFee: 12500,
        totalEarnings: 237500,
    },
    {
        id: "ORD-99810",
        user: "Michael Lee (A3402)",
        address: "Jl. Merdeka Barat, Bandung, Jawa Barat",
        timestamp: "2026-07-02T09:15:00Z",
        status: "On Delivery",
        paymentStatus: "Paid",
        items: [
            { id: "P4", name: "Batik Table Runner", detail: "Mega Mendung Pattern", price: 450000, qty: 1 },
        ],
        trackingNumber: "JNEXX9988776655",
        subtotal: 450000,
        shippingFee: 30000,
        platformFee: 22500,
        totalEarnings: 427500,
    },
    {
        id: "ORD-99809",
        user: "Putri Lestari (A3403)",
        address: "Jl. Melati No. 11, Surabaya, Jawa Timur 60281",
        timestamp: "2026-07-01T08:30:00Z",
        status: "Completed",
        paymentStatus: "Paid",
        items: [
            { id: "P1", name: "Handwoven Rattan Basket", detail: "Natural Brown, Large", price: 350000, qty: 1 },
            { id: "P2", name: "Rattan Coaster", detail: "Set of 4", price: 50000, qty: 1 },
        ],
        subtotal: 400000,
        shippingFee: 25000,
        platformFee: 20000,
        totalEarnings: 380000,
    },
];

const STATS = {
    todayOrders: 20,
    totalProducts: 15,
    totalIncome: 25000000,
    totalArticles: 4,
};

const ANALYTICS_6_MONTHS = [
    { month: "Jan", gross: 30000000, service: 2000000, withdrawal: 28000000 },
    { month: "Feb", gross: 25000000, service: 2500000, withdrawal: 22500000 },
    { month: "Mar", gross: 22000000, service: 2200000, withdrawal: 19800000 },
    { month: "Apr", gross: 30000000, service: 3000000, withdrawal: 27000000 },
    { month: "May", gross: 35000000, service: 3500000, withdrawal: 31500000 },
    { month: "Jun", gross: 25000000, service: 2500000, withdrawal: 22500000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
};

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

function StatusBadge({ status }: { status: OrderStatus }) {
    const styles = {
        "New": "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
        "Process": "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        "On Delivery": "bg-purple-50 text-purple-700 border-purple-200/60 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
        "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    };

    const icons = {
        "New": <Package size={12} className="mr-1" />,
        "Process": <Package size={12} className="mr-1" />,
        "On Delivery": <Truck size={12} className="mr-1" />,
        "Completed": <CheckCircle2 size={12} className="mr-1" />,
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${styles[status]}`}>
            {icons[status]} {status}
        </span>
    );
}

// ─── Transaction Detail Modal ─────────────────────────────────────────────────

function TransactionDetailModal({
    tx,
    onClose,
}: {
    tx: Order;
    onClose: () => void;
}) {
    const firstProduct = tx.items[0];
    const extraItemsCount = tx.items.length - 1;

    const rows = [
        { icon: Hash, label: "Order ID", value: tx.id, mono: true },
        { icon: Package, label: "Product", value: `${firstProduct.name}${extraItemsCount > 0 ? ` +${extraItemsCount} more` : ""}` },
        { icon: CreditCard, label: "Total Earnings", value: formatIDR(tx.totalEarnings), bold: true },
        { icon: CheckCircle2, label: "Payment Status", value: tx.paymentStatus },
        { icon: User, label: "Customer", value: tx.user },
        { icon: Clock, label: "Timestamp", value: formatTimestamp(tx.timestamp), mono: true },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-[440px] rounded-2xl shadow-2xl animate-modal-in bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                            {tx.id}
                        </p>
                        <h2 className="text-base font-bold mt-0.5 text-neutral-900 dark:text-neutral-100">
                            Transaction Detail
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge status={tx.status} />
                        <button
                            title="close"
                            onClick={onClose}
                            className="w-7 h-7 flex items-center justify-center rounded-full transition-colors text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:text-neutral-200 dark:hover:bg-neutral-800"
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
                                className="flex items-center justify-between py-2.5 border-b last:border-0 border-neutral-50 dark:border-neutral-800/60"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon size={13} className="text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
                                </div>
                                <span
                                    className={`text-sm max-w-[200px] text-right truncate
                                    ${mono ? "font-mono text-xs text-neutral-500 dark:text-neutral-400" : ""}
                                    ${bold ? "font-bold text-neutral-900 dark:text-neutral-100" : "font-medium text-neutral-800 dark:text-neutral-200"}`}
                                >
                                    {value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Address Block replacing Note */}
                    <div className="mt-4 p-3 rounded-xl border bg-neutral-50 dark:bg-neutral-800/50 border-neutral-100 dark:border-neutral-800">
                        <p className="text-xs font-semibold text-neutral-900 dark:text-white mb-1">
                            Delivery Address
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {tx.address}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full h-10 rounded-xl border text-sm font-medium transition-colors border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
                    { label: "Commission", val: formatIDR(d.commission || d.service), cls: "text-emerald-600 dark:text-emerald-400" },
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

export function TrendChart({ data }: { data: any[] }) {
    return (
        <div className="w-full h-[140px] sm:h-[168px] md:h-[190px]">
            <AreaChart
                className="h-full w-full text-sm stroke-[#0022ff] dark:stroke-[#0022ff] fill-neutral-400 dark:fill-neutral-500"
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
                rotateLabelX={{ angle: 20, verticalShift: 10, xAxisHeight: 40 }}
            />
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STAT_CARDS = [
    {
        href: "/crafter/orders",
        icon: Package,
        iconBg: "bg-blue-50 dark:bg-blue-500/10",
        iconCls: "text-[#0022FF] dark:text-blue-400",
        label: "Today Orders",
        value: STATS.todayOrders,
        suffix: "",
        ring: "hover:ring-blue-200/60 dark:hover:ring-blue-800/40",
    },
    {
        href: "/crafter/products",
        icon: Shapes,
        iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
        iconCls: "text-emerald-600 dark:text-emerald-400",
        label: "Products",
        value: STATS.totalProducts,
        suffix: "",
        ring: "hover:ring-emerald-200/60 dark:hover:ring-emerald-800/40",
    },
    {
        href: "/crafter/orders",
        icon: Banknote,
        iconBg: "bg-purple-50 dark:bg-purple-500/10",
        iconCls: "text-purple-600 dark:text-purple-400",
        label: "This Month Income",
        value: formatIDR(STATS.totalIncome),
        suffix: "",
        ring: "hover:ring-purple-200/60 dark:hover:ring-purple-800/40",
    },
    {
        href: "/crafter/articles",
        icon: FileText,
        iconBg: "bg-amber-50 dark:bg-amber-500/10",
        iconCls: "text-amber-600 dark:text-amber-400",
        label: "Articles",
        value: STATS.totalArticles,
        suffix: "",
        ring: "hover:ring-amber-200/60 dark:hover:ring-amber-800/40",
    },
];

export default function AdminDashboardPage() {
    const [exportDuration, setExportDuration] = useState("1");
    const [selectedTx, setSelectedTx] = useState<Order | null>(null);

    // Perbaikan: MOCK_ORDERS adalah array, gunakan method slice langsung
    const filteredOrders = MOCK_ORDERS.slice(0, 5);

    return (
        <>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {STAT_CARDS.map(({ href, icon: Icon, iconBg, iconCls, label, value, suffix, ring }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`group relative p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/60 hover:shadow-md hover:-translate-y-0.5 hover:ring-2 ${ring}`}
                            >
                                <ArrowUpRight
                                    size={14}
                                    className="absolute top-4 right-4 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
                                        <Icon size={16} className={iconCls} />
                                    </div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        {label}
                                    </p>
                                </div>
                                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-baseline gap-1">
                                    {value}
                                    {suffix && (
                                        <span className="text-sm font-medium text-neutral-400">{suffix}</span>
                                    )}
                                </h3>
                                <p className="text-[11px] mt-1.5 font-medium text-neutral-400 dark:text-neutral-600 group-hover:text-[#0022FF] dark:group-hover:text-blue-400 transition-colors">
                                    View details →
                                </p>
                            </Link>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Animated Line Chart */}
                        <div className="lg:col-span-1 rounded-2xl border p-5 bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/60">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                                        Monthly Income
                                    </h2>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                        Last 6 months
                                    </p>
                                </div>
                                <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-500/10 text-[#0022FF] dark:text-blue-400">
                                    <TrendingUp size={16} />
                                </div>
                            </div>
                            <TrendChart data={ANALYTICS_6_MONTHS} />
                        </div>

                        {/* Analytics table */}
                        <div className="rounded-2xl border overflow-hidden flex flex-col bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/60">
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
                                    <thead className="bg-neutral-50/50 dark:bg-neutral-800/20 text-neutral-500 dark:text-neutral-400">
                                        <tr>
                                            {["Period", "Gross", "Serv.", "W/D"].map((h, i) => (
                                                <th
                                                    key={h}
                                                    className={`px-4 py-3 font-semibold uppercase tracking-wide ${i > 0 ? "text-right" : ""}`}
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
                                                    {formatIDR(row.service).replace("Rp", "")}
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
                    <div className="rounded-2xl border overflow-hidden bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/60">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-neutral-100 dark:border-neutral-800/50">
                            <div>
                                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                                    Recent Orders
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    Live feed of the latest platform orders
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`crafter/orders`}>
                                    <button className="flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs font-semibold text-white transition-colors bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                                    >
                                        See All
                                        <ChevronRight />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 rounded-b-2xl overflow-hidden">
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-neutral-100 dark:border-neutral-800">
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                                ORD_ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                                Product Summary
                                            </th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                                User
                                            </th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                                TIMESTAMPTZ
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                            <Package size={28} className="text-neutral-300 dark:text-neutral-600" />
                                                        </div>
                                                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No orders found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((order) => {
                                                const firstProduct = order.items[0];
                                                const extraItems = order.items.length - 1;

                                                return (
                                                    <tr
                                                        key={order.id}
                                                        className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                                                    >
                                                        {/* ID */}
                                                        <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                                                            <p className="font-medium text-[11px] text-neutral-400 font-mono">{order.id}</p>
                                                        </td>

                                                        {/* Product Summary */}
                                                        <td className="px-4 py-3.5 min-w-[200px]">
                                                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                                                {firstProduct.name} {extraItems > 0 && <span className="text-neutral-400 font-normal ml-1">+{extraItems}</span>}
                                                            </p>
                                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                                                                {firstProduct.detail}
                                                            </p>
                                                            <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 mt-1">
                                                                {formatIDR(order.subtotal)}
                                                            </p>
                                                        </td>

                                                        {/* User */}
                                                        <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                                                            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                                                {order.user.split(" (")[0]}
                                                            </span>
                                                        </td>

                                                        {/* Date */}
                                                        <td className="hidden lg:table-cell px-4 py-3.5 whitespace-nowrap font-mono text-xs text-neutral-500">
                                                            {formatTimestamp(order.timestamp)}
                                                        </td>

                                                        {/* Status Badges */}
                                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1.5 items-start">
                                                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                                    <CheckCircle2 size={10} /> {order.paymentStatus}
                                                                </span>
                                                                <StatusBadge status={order.status} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-in { animation: modal-in 0.18s ease-out both; }
            `}</style>
        </>
    );
}