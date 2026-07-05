"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown, Eye, X, Package, Truck, CheckCircle2, ChevronLeft } from "lucide-react";
import SellerHeader from "@/components/crafter/SellerHeader";
import { formatRupiah } from "@/components/crafter/ProductUI";

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type OrderStatus = "New" | "Process" | "On Delivery" | "Completed";
type PaymentStatus = "Paid";

interface OrderItem {
    id: string;
    name: string;
    detail: string;
    price: number;
    qty: number;
}

interface Order {
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

// ─── Formatting Helpers ───────────────────────────────────────────────────────

function formatDate(iso: string) {
    return new Date(iso).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

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

// ─── Detail Modal Component ───────────────────────────────────────────────────

function OrderDetailModal({
    order,
    onClose,
    onReceive,
    onDeliver,
}: {
    order: Order;
    onClose: () => void;
    onReceive: (id: string) => void;
    onDeliver: (id: string, tracking: string) => void;
}) {
    const [trackingInput, setTrackingInput] = useState("");
    const [error, setError] = useState("");

    const handleDeliverySubmit = () => {
        if (!trackingInput.trim()) {
            setError("Please input a valid tracking number.");
            return;
        }
        onDeliver(order.id, trackingInput.trim());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
            <div className="relative z-10 w-full max-w-[600px] rounded-2xl shadow-2xl animate-modal-in bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-h-[90vh] flex flex-col">

                {/* Header with Back Button / Close */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button title="back" onClick={onClose} className="p-1.5 -ml-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Order Detail</h2>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                        {order.paymentStatus}
                    </span>
                </div>

                <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">
                    {/* Top Section: ID & Time */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-900 dark:text-white font-mono">{order.id}</h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{formatDate(order.timestamp)}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <hr className="border-neutral-100 dark:border-neutral-800" />

                    {/* Product List */}
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-neutral-900 dark:text-white">{item.name}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{item.detail} (x{item.qty})</p>
                                </div>
                                <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                    {formatRupiah(item.price * item.qty)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <hr className="border-neutral-100 dark:border-neutral-800" />

                    {/* Address */}
                    <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">Delivery Address</h4>
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800">
                            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{order.user.split(" (")[0]}</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{order.address}</p>
                        </div>
                    </div>

                    {/* Earnings Breakdown */}
                    <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">Earnings</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                <span>Subtotal (Products)</span>
                                <span>{formatRupiah(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                <span>Platform Fee</span>
                                <span className="text-red-500">-{formatRupiah(order.platformFee)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base text-neutral-900 dark:text-white pt-2 border-t border-neutral-100 dark:border-neutral-800 mt-2">
                                <span>Total Earnings</span>
                                <span>{formatRupiah(order.totalEarnings)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 flex-shrink-0 flex flex-col gap-3 rounded-b-2xl">
                    {/* Action: Receive */}
                    {order.status === "New" && (
                        <button
                            onClick={() => onReceive(order.id)}
                            className="w-full h-12 rounded-full text-sm font-bold text-white bg-[#0022FF] hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            Receive Orders (Start Processing)
                        </button>
                    )}

                    {/* Action: Input Resi & Dispatch */}
                    {order.status === "Process" && (
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Input Logistics Tracking Number (Resi)..."
                                    value={trackingInput}
                                    onChange={(e) => { setTrackingInput(e.target.value); setError(""); }}
                                    className={`w-full h-12 px-4 rounded-full text-sm border bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${
                                        error ? "border-red-400 focus:ring-red-100" : "border-neutral-300 dark:border-neutral-700 focus:border-[#0022FF] focus:ring-blue-100/30"
                                    }`}
                                />
                                {error && <p className="text-xs text-red-500 mt-1 ml-4">{error}</p>}
                            </div>
                            <button
                                onClick={handleDeliverySubmit}
                                className="w-full h-12 rounded-full text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors shadow-sm"
                            >
                                Konfirmasi Pengiriman (Dispatch)
                            </button>
                        </div>
                    )}

                    {/* Read Only Tracking */}
                    {order.status === "On Delivery" && (
                        <div className="w-full h-12 px-4 flex items-center justify-between rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-sm">
                            <span className="text-neutral-500">Tracking Number:</span>
                            <span className="font-mono font-bold text-neutral-900 dark:text-white">{order.trackingNumber}</span>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full h-12 rounded-full text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // ─── Filter Logic ───
    const filteredOrders = useMemo(() => {
        const q = search.toLowerCase().trim();
        return orders.filter((o) => {
            const matchSearch = !q || o.id.toLowerCase().includes(q) || o.user.toLowerCase().includes(q);
            const matchStatus = statusFilter === "All" || o.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    // ─── Actions (Sesuai Flow) ───
    const handleReceiveOrder = (id: string) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Process" } : o)));
        setSelectedOrder(null);
    };

    const handleConfirmDelivery = (id: string, trackingNumber: string) => {
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "On Delivery", trackingNumber } : o)));
        setSelectedOrder(null);
    };

    return (
        <>
            <SellerHeader
                title="Orders"
                description="Manage your orders."
            />
            
            <main className="flex-1 p-3 sm:p-6 overflow-auto">
                {/* ── Table card ── */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[140px] max-w-[360px]">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search ORD_ID or Customer name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
                            />
                        </div>

                        {/* Status filter */}
                        <div className="relative ml-auto sm:ml-0">
                            <select
                                title="filter-status"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as "All" | OrderStatus)}
                                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF] cursor-pointer transition-all"
                            >
                                <option value="All">All Status</option>
                                <option value="New">New Orders</option>
                                <option value="Process">In Process</option>
                                <option value="On Delivery">On Delivery</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                        </div>

                        <p className="ml-auto text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap hidden sm:block">
                            {filteredOrders.length} of {orders.length} Orders
                        </p>
                    </div>

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
                                    <th className="px-4 py-3 text-right pr-5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                                        Actions
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
                                                <p className="text-xs text-neutral-400 dark:text-neutral-600">
                                                    Try adjusting your filters or search keywords
                                                </p>
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
                                                        {formatRupiah(order.subtotal)}
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
                                                    {formatDate(order.timestamp)}
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

                                                {/* Action */}
                                                <td className="px-4 py-3.5 whitespace-nowrap text-right pr-5">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                                                        >
                                                            <Eye size={13} />
                                                            <span className="hidden md:inline">Detail</span>
                                                        </button>
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
            </main>

            {/* Render Dynamic Details Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onReceive={handleReceiveOrder}
                    onDeliver={handleConfirmDelivery}
                />
            )}

            {/* Keyframe Configurations for Smooth Modal Entrance */}
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