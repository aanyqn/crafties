"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, Store, X, Package, Truck, CheckCircle2, User, UserCog } from "lucide-react";
import ThemeToggle from "../ThemeToggle"; // Pastikan path ini sesuai di project Anda

// ─── Types & Mock Data ────────────────────────────────────────────────────────

type OrderStatus = "New" | "Process" | "On Delivery" | "Completed";

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
    timestamp: string;
    status: OrderStatus;
    paymentStatus: string;
    items: OrderItem[];
    subtotal: number;
    shippingFee: number;
    platformFee: number;
    totalEarnings: number;
}

const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-99812",
        user: "Alex Johnson (A3400)",
        address: "Jl. Mawar No. 15, Surabaya",
        timestamp: "2026-07-04T08:30:00Z",
        status: "New",
        paymentStatus: "Paid",
        items: [{ id: "P1", name: "Handwoven Rattan Basket", detail: "Large", price: 350000, qty: 1 }],
        subtotal: 400000, shippingFee: 25000, platformFee: 20000, totalEarnings: 380000,
    },
    {
        id: "ORD-99811",
        user: "Sarah Smith (A3401)",
        address: "Apartemen Sudirman Tower C/12, Jakarta",
        timestamp: "2026-07-03T14:20:00Z",
        status: "Process",
        paymentStatus: "Paid",
        items: [{ id: "P3", name: "Ceramic Coffee Mug", detail: "300ml", price: 125000, qty: 2 }],
        subtotal: 250000, shippingFee: 15000, platformFee: 12500, totalEarnings: 237500,
    },
    {
        id: "ORD-99810",
        user: "Michael Lee (A3402)",
        address: "Jl. Merdeka Barat, Bandung",
        timestamp: "2026-07-02T09:15:00Z",
        status: "On Delivery",
        paymentStatus: "Paid",
        items: [{ id: "P4", name: "Batik Table Runner", detail: "Mega Mendung", price: 450000, qty: 1 }],
        subtotal: 450000, shippingFee: 30000, platformFee: 22500, totalEarnings: 427500,
    },
];

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

// ─── Notification Modal Component ─────────────────────────────────────────────

function NotificationModal({ onClose }: { onClose: () => void }) {
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
                            {MOCK_ORDERS.length}
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
                    {MOCK_ORDERS.map((order) => {
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
                </div>
            </div>
        </div>
    );
}

// ─── Main Navbar Component ────────────────────────────────────────────────────

export default function CrafterNavbar() {
    const pathname = usePathname();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const navLinks = [
        { name: "Dashboard", href: "/crafter" },
        { name: "Products", href: "/crafter/products" },
        { name: "Orders", href: "/crafter/orders" },
        { name: "Articles", href: "/crafter/articles" },
    ];

    const unreadCount = MOCK_ORDERS.filter(o => o.status === "New").length;

    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex-shrink-0">
                                <Image
                                    src="/assets/img/LOGO-2.png"
                                    alt="Crafties"
                                    width={80}
                                    height={20}
                                    className="h-5 w-auto"
                                />
                            </Link>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full ms-3 text-[11px] font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800">
                                Crafter
                            </span>
                        </div>

                        {/* Nav Links (Desktop) */}
                        <div className="hidden md:flex space-x-8">
                            {navLinks.map((link) => {
                                const isActive =
                                    link.href === "/crafter"
                                        ? pathname === "/crafter"
                                        : pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                            ? "border-neutral-900 text-neutral-900 dark:border-white dark:text-white"
                                            : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300 dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:border-neutral-700"
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Profile & Notifications */}
                        <div className="flex items-center gap-3">
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
                                <button aria-label="Account"
                                    className="w-9 h-9 flex items-center justify-center rounded-full transition-colors
                             text-neutral-700 dark:text-neutral-300
                             hover:bg-neutral-100 dark:hover:bg-neutral-800
                             hover:text-neutral-900 dark:hover:text-neutral-100">
                                    <Store size={20} />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110]">
                                    <div className="w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-2 flex flex-col">
                                        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                                            <p className="text-sm font-bold text-neutral-900 dark:text-white">My Account</p>
                                        </div>

                                        <Link
                                            href="/products"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-950 dark:hover:text-neutral-100 transition-colors"
                                        >
                                            <User size={16} />
                                            Login as User
                                        </Link>

                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#0022ff] dark:text-[#0022ff] hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#0000ff] dark:hover:text-[#0000ff] transition-colors"
                                        >
                                            <UserCog size={16} />
                                            Login as Admin
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Notification Modal Render */}
            {isNotifOpen && <NotificationModal onClose={() => setIsNotifOpen(false)} />}

            {/* Modal Keyframes */}
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