"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import AdminHeader from "@/components/admin/AdminHeader";
import { MOCK_CRAFTERS } from "@/data/mockCrafters";
import { CrafterApplication, CrafterStatus } from "@/types/crafter";
import {
  Search,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  MessageCircleHeart,
  ShoppingBag,
  Tag,
  CalendarDays,
  Store,
  AlertTriangle,
  BadgeCheck,
  Hammer,
  ExternalLink,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

/* ─── Helpers ─── */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
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
  return AVATAR_COLORS[name[0]?.toUpperCase() ?? "A"] ?? "#0022FF";
}

/* ─── Status badge ─── */
function StatusBadge({ status }: { status: CrafterStatus }) {
  const map: Record<CrafterStatus, { label: string; cls: string; dot: string }> = {
    Pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:ring-amber-800",
      dot: "bg-amber-400",
    },
    Active: {
      label: "Active",
      cls: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:ring-emerald-800",
      dot: "bg-emerald-500",
    },
    Rejected: {
      label: "Rejected",
      cls: "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950 dark:text-red-400 dark:ring-red-800",
      dot: "bg-red-500",
    },
    Suspended: {
      label: "Suspended",
      cls: "bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:ring-neutral-700",
      dot: "bg-neutral-400",
    },
  };
  const { label, cls, dot } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} flex-shrink-0`} />
      {label}
    </span>
  );
}

/* ─── Category badge ─── */
function CategoryBadge({ category }: { category: string }) {
  const map: Record<string, string> = {
    Accessories: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:ring-blue-800",
    Decorations: "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:ring-purple-800",
    Gifts: "bg-pink-50 text-pink-700 ring-1 ring-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:ring-pink-800",
    Toys: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:ring-orange-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${map[category] ?? "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200"}`}>
      {category}
    </span>
  );
}

/* ═══════════════════════════════════════════════
   DETAIL SLIDE-OVER PANEL
═══════════════════════════════════════════════ */
interface DetailPanelProps {
  crafter: CrafterApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

function DetailPanel({ crafter, onClose, onApprove, onReject }: DetailPanelProps) {
  const isPending = crafter.status === "Pending";
  const isActive  = crafter.status === "Active";

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel — slides in from right */}
      <aside
        className="relative ml-auto w-full max-w-[520px] h-full bg-white dark:bg-neutral-900
                   border-l border-neutral-200 dark:border-neutral-700 shadow-2xl
                   flex flex-col overflow-hidden animate-slide-in-right"
      >
        {/* ── Panel Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: avatarColor(crafter.storeName) }}
            >
              {getInitials(crafter.storeName)}
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                {crafter.storeName}
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500">{crafter.ownerName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={crafter.status} />
            <button
              id="crafter-detail-close"
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                         text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                         dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">

          {/* ── Section: Store Info ── */}
          <section>
            <SectionTitle icon={<Store size={14} />} label="Store Information" />
            <div className="space-y-2.5 mt-3">
              <InfoRow label="Store ID" value={crafter.id} mono />
              <InfoRow label="Category">
                <CategoryBadge category={crafter.category} />
              </InfoRow>
              <InfoRow label="Description" value={crafter.storeDescription} multiline />
              <InfoRow label="Submitted" value={formatDate(crafter.submittedAt)} />
              {crafter.reviewedAt && (
                <InfoRow label="Reviewed" value={formatDate(crafter.reviewedAt)} />
              )}
            </div>
          </section>

          {/* ── Section: Owner Contact ── */}
          <section>
            <SectionTitle icon={<Mail size={14} />} label="Owner &amp; Contact" />
            <div className="space-y-2.5 mt-3">
              <InfoRow label="Full Name" value={crafter.ownerName} />
              <InfoRow label="Email">
                <a href={`mailto:${crafter.ownerEmail}`}
                  className="text-[#0022FF] dark:text-blue-400 text-sm hover:underline">
                  {crafter.ownerEmail}
                </a>
              </InfoRow>
              <InfoRow label="Phone" value={crafter.phoneNumber} />
              <InfoRow label="Store Address" value={crafter.storeAddress} multiline />
              {crafter.instagramUrl && (
                <InfoRow label="Instagram">
                  <a href={crafter.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#0022FF] dark:text-blue-400 hover:underline">
                    <MessageCircleHeart size={13} />
                    {crafter.instagramUrl.replace("https://instagram.com/", "@")}
                    <ExternalLink size={11} />
                  </a>
                </InfoRow>
              )}
              {crafter.shopeeUrl && (
                <InfoRow label="Shopee">
                  <a href={crafter.shopeeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#0022FF] dark:text-blue-400 hover:underline">
                    <ShoppingBag size={13} />
                    View Store
                    <ExternalLink size={11} />
                  </a>
                </InfoRow>
              )}
            </div>
          </section>

          {/* ── Section: KTP / Identity Documents ── */}
          <section>
            <SectionTitle icon={<FileText size={14} />} label="Identity Documents" />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <DocCard label="KTP / ID Card" src={crafter.ktpImageUrl} />
              <DocCard label="Selfie with KTP" src={crafter.selfieWithKtpUrl} />
            </div>
          </section>

          {/* ── Section: Portfolio ── */}
          <section>
            <SectionTitle icon={<ImageIcon size={14} />} label={`Portfolio (${crafter.portfolio.length} items)`} />
            <div className="mt-3 grid grid-cols-3 gap-2">
              {crafter.portfolio.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-square
                                              border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={item.imageUrl}
                    alt={item.caption}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                  flex items-end p-2">
                    <p className="text-white text-[10px] font-medium leading-tight">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Admin Note (if reviewed) ── */}
          {crafter.adminNote && (
            <section>
              <SectionTitle icon={<FileText size={14} />} label="Admin Note" />
              <div className={`mt-3 p-3 rounded-xl text-sm leading-relaxed
                ${crafter.status === "Rejected"
                  ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                  : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"}`}>
                {crafter.adminNote}
              </div>
            </section>
          )}
        </div>

        {/* ── Panel Footer Actions ── */}
        {(isPending || isActive) && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80">
            {isPending && (
              <div className="flex gap-2">
                <button
                  id={`panel-reject-${crafter.id}`}
                  onClick={onReject}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                             border border-red-300 dark:border-red-700
                             text-red-600 dark:text-red-400
                             hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <XCircle size={15} />
                  Reject
                </button>
                <button
                  id={`panel-approve-${crafter.id}`}
                  onClick={onApprove}
                  className="flex-[2] flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                             bg-[#0022FF] hover:bg-[#001de0] text-white transition-colors shadow-sm"
                >
                  <CheckCircle2 size={15} />
                  Approve Store
                </button>
              </div>
            )}
            {isActive && (
              <button
                id={`panel-suspend-${crafter.id}`}
                onClick={onReject}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold
                           border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <XCircle size={15} />
                Suspend Store
              </button>
            )}
          </div>
        )}
      </aside>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.22s cubic-bezier(0.4,0,0.2,1) both; }
      `}</style>
    </div>
  );
}

/* ── Small helpers inside panel ── */
function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-800">
      <span className="text-neutral-400 dark:text-neutral-500">{icon}</span>
      <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
        {label}
      </h3>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
  multiline,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  multiline?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`flex ${multiline ? "flex-col gap-0.5" : "items-start justify-between gap-4"}`}>
      <span className="text-xs text-neutral-400 dark:text-neutral-500 flex-shrink-0 min-w-[90px]">{label}</span>
      {children ?? (
        <span className={`text-sm text-neutral-900 dark:text-neutral-100 text-right
          ${mono ? "font-mono text-xs text-neutral-500" : ""}
          ${multiline ? "text-left" : ""}`}>
          {value}
        </span>
      )}
    </div>
  );
}

function DocCard({ label, src }: { label: string; src: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
      <div className="relative aspect-[4/3]">
        <Image src={src} alt={label} fill className="object-cover" />
      </div>
      <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 px-2 py-1.5 text-center">
        {label}
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONFIRM MODAL
═══════════════════════════════════════════════ */
interface ConfirmModalProps {
  crafter: CrafterApplication;
  action: "approve" | "reject";
  onConfirm: (note?: string) => void;
  onCancel: () => void;
}

function ConfirmModal({ crafter, action, onConfirm, onCancel }: ConfirmModalProps) {
  const [note, setNote] = useState("");
  const isApprove = action === "approve";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative z-10 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-[420px]
                      border border-neutral-200 dark:border-neutral-700 animate-modal-in p-6">
        {/* Close */}
        <button
          id="confirm-modal-close"
          onClick={onCancel}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full
                     text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100
                     dark:hover:text-neutral-200 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={15} />
        </button>

        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
          ${isApprove ? "bg-emerald-50 dark:bg-emerald-950" : "bg-red-50 dark:bg-red-950"}`}>
          {isApprove
            ? <BadgeCheck size={22} className="text-emerald-600 dark:text-emerald-400" />
            : <XCircle size={22} className="text-red-600 dark:text-red-400" />}
        </div>

        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 text-center mb-1">
          {isApprove ? "Approve Store Registration?" : "Reject Application?"}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-5 leading-relaxed">
          {isApprove
            ? <><strong className="text-neutral-800 dark:text-neutral-200">{crafter.storeName}</strong> will be activated and {crafter.ownerName} will receive a verification email.</>
            : <>The application from <strong className="text-neutral-800 dark:text-neutral-200">{crafter.storeName}</strong> will be rejected.</>}
        </p>

        {/* Store chip */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 mb-4
                        border border-neutral-200 dark:border-neutral-700">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ backgroundColor: avatarColor(crafter.storeName) }}>
            {getInitials(crafter.storeName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{crafter.storeName}</p>
            <p className="text-xs text-neutral-400 truncate">{crafter.ownerEmail}</p>
          </div>
          <CategoryBadge category={crafter.category} />
        </div>

        {/* Warning / Info */}
        {isApprove ? (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950
                          border border-emerald-200 dark:border-emerald-800 mb-4">
            <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              Store will be set to Active. An email notification will be sent to the crafter.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950
                            border border-red-200 dark:border-red-800 mb-3">
              <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                Provide a reason so the crafter knows what to fix before reapplying.
              </p>
            </div>
            <textarea
              id="reject-note-input"
              placeholder="Reason for rejection (e.g. blurry KTP, insufficient portfolio)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm
                         bg-neutral-50 dark:bg-neutral-800
                         border border-neutral-200 dark:border-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         placeholder-neutral-400 dark:placeholder-neutral-500
                         focus:outline-none focus:border-[#0022FF] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30
                         resize-none mb-4 transition-all"
            />
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            id="confirm-cancel-btn"
            onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700
                       text-sm font-medium text-neutral-700 dark:text-neutral-300
                       hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-action-btn"
            onClick={() => onConfirm(note || undefined)}
            disabled={!isApprove && note.trim().length === 0}
            className={`flex-[1.5] h-10 rounded-xl text-sm font-semibold text-white transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
              ${isApprove
                ? "bg-[#0022FF] hover:bg-[#001de0]"
                : "bg-red-600 hover:bg-red-700"}`}
          >
            {isApprove ? "Yes, Approve" : "Yes, Reject"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.18s ease-out both; }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUCCESS TOAST
═══════════════════════════════════════════════ */
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl
      border text-sm font-medium animate-modal-in
      ${type === "success"
        ? "bg-emerald-600 text-white border-emerald-500"
        : "bg-red-600 text-white border-red-500"}`}>
      {type === "success"
        ? <BadgeCheck size={16} className="flex-shrink-0" />
        : <XCircle size={16} className="flex-shrink-0" />}
      {message}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
type FilterStatus = "All" | CrafterStatus;

export default function AdminCraftersPage() {
  const [crafters, setCrafters] = useState<CrafterApplication[]>(MOCK_CRAFTERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [detailCrafter, setDetailCrafter] = useState<CrafterApplication | null>(null);
  const [confirmState, setConfirmState] = useState<{
    crafter: CrafterApplication;
    action: "approve" | "reject";
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return crafters.filter((c) => {
      const matchSearch =
        !q ||
        c.storeName.toLowerCase().includes(q) ||
        c.ownerName.toLowerCase().includes(q) ||
        c.ownerEmail.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      const matchCat = categoryFilter === "All" || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [crafters, search, statusFilter, categoryFilter]);

  /* ── Stats ── */
  const pending  = crafters.filter((c) => c.status === "Pending").length;
  const active   = crafters.filter((c) => c.status === "Active").length;
  const rejected = crafters.filter((c) => c.status === "Rejected").length;

  /* ── Toast helper ── */
  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }

  /* ── Actions ── */
  function openApprove(crafter: CrafterApplication) {
    setDetailCrafter(null);
    setConfirmState({ crafter, action: "approve" });
  }

  function openReject(crafter: CrafterApplication) {
    setDetailCrafter(null);
    setConfirmState({ crafter, action: "reject" });
  }

  function handleConfirm(note?: string) {
    if (!confirmState) return;
    const { crafter, action } = confirmState;
    const now = new Date().toISOString();

    setCrafters((prev) =>
      prev.map((c) =>
        c.id === crafter.id
          ? {
              ...c,
              status: action === "approve" ? "Active" : "Rejected",
              reviewedAt: now,
              adminNote: note,
            }
          : c
      )
    );

    showToast(
      action === "approve"
        ? `✓ ${crafter.storeName} has been approved. Notification email sent.`
        : `${crafter.storeName} has been rejected.`,
      action === "approve" ? "success" : "error"
    );

    setConfirmState(null);
  }

  return (
    <>
      <AdminHeader
        title="Crafters"
        description="Review and curate new crafter store applications"
      />

      <main className="flex-1 p-3 sm:p-6 overflow-auto">

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: "Pending Review",   value: pending,  color: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-950/40",   icon: <Hammer size={18} className="text-amber-400" /> },
            { label: "Active Stores",    value: active,   color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/40", icon: <Store size={18} className="text-emerald-400" /> },
            { label: "Rejected",         value: rejected, color: "text-red-600 dark:text-red-400",        bg: "bg-red-50 dark:bg-red-950/40",          icon: <XCircle size={18} className="text-red-400" /> },
          ].map(({ label, value, color, bg, icon }) => (
            <div key={label}
              className={`rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 ${bg}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
                {icon}
              </div>
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
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                id="crafters-search"
                type="search"
                placeholder="Search store, owner, or ID..."
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

            {/* Status filter */}
            <div className="relative">
              <select
                id="crafters-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF] cursor-pointer transition-all"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            {/* Category filter */}
            <div className="relative">
              <select
                id="crafters-filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium
                           bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700
                           text-neutral-700 dark:text-neutral-300
                           focus:outline-none focus:border-[#0022FF] cursor-pointer transition-all"
              >
                <option value="All">All Categories</option>
                <option value="Accessories">Accessories</option>
                <option value="Decorations">Decorations</option>
                <option value="Gifts">Gifts</option>
                <option value="Toys">Toys</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            <p className="ml-auto text-xs text-neutral-400 dark:text-neutral-500 whitespace-nowrap hidden sm:block">
              {filtered.length} of {crafters.length} crafters
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" id="crafters-table">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">CID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Store Name</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Status</th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Submitted</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Location</th>
                  <th className="px-4 py-3 text-right pr-5 text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wide whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                          <Hammer size={28} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">No crafters found</p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((crafter) => (
                    <tr
                      key={crafter.id}
                      id={`crafter-row-${crafter.id}`}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0
                                 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* CID */}
                      <td className="hidden md:table-cell px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">{crafter.id}</span>
                      </td>

                      {/* Store name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ backgroundColor: avatarColor(crafter.storeName) }}
                          >
                            {getInitials(crafter.storeName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">{crafter.storeName}</p>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">{crafter.ownerName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="hidden sm:table-cell px-4 py-3.5 whitespace-nowrap">
                        <CategoryBadge category={crafter.category} />
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <StatusBadge status={crafter.status} />
                      </td>

                      {/* Submitted */}
                      <td className="hidden lg:table-cell px-4 py-3.5 text-neutral-500 dark:text-neutral-400 whitespace-nowrap text-sm">
                        {formatDate(crafter.submittedAt)}
                      </td>

                      {/* Location */}
                      <td className="hidden md:table-cell px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-sm">
                          <MapPin size={12} className="flex-shrink-0" />
                          {crafter.location}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View button */}
                          <button
                            id={`crafter-view-${crafter.id}`}
                            onClick={() => setDetailCrafter(crafter)}
                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium transition-colors
                                       border border-neutral-200 dark:border-neutral-700
                                       text-neutral-600 dark:text-neutral-300
                                       hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:border-neutral-300"
                          >
                            <Eye size={13} />
                            <span className="hidden sm:inline">Review</span>
                          </button>

                          {/* Approve — only for Pending */}
                          {crafter.status === "Pending" && (
                            <button
                              id={`crafter-approve-${crafter.id}`}
                              onClick={() => openApprove(crafter)}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors
                                         bg-[#0022FF] hover:bg-[#001de0] text-white shadow-sm"
                            >
                              <CheckCircle2 size={13} />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                          )}

                          {/* Reject — only for Pending */}
                          {crafter.status === "Pending" && (
                            <button
                              id={`crafter-reject-${crafter.id}`}
                              onClick={() => openReject(crafter)}
                              className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors
                                         border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400
                                         hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <XCircle size={13} />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Detail panel ── */}
      {detailCrafter && (
        <DetailPanel
          crafter={detailCrafter}
          onClose={() => setDetailCrafter(null)}
          onApprove={() => openApprove(detailCrafter)}
          onReject={() => openReject(detailCrafter)}
        />
      )}

      {/* ── Confirm modal ── */}
      {confirmState && (
        <ConfirmModal
          crafter={confirmState.crafter}
          action={confirmState.action}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
