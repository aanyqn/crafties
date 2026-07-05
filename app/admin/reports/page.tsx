"use client";

import { useState, useMemo } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Search,
  ChevronDown,
  X,
  AlertTriangle,
  FolderOpen,
  Eye,
  CheckCircle,
  FileText,
  Clock,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReportStatus = "Open" | "Resolved";
type DisputeResolution = "Refund_To_Buyer" | "Release_To_Crafter" | null;

type AdminReport = {
  id: string;
  username: string;
  userId: string;
  createdAt: string;
  problemCategory: string;
  description: string;
  orderId: string;
  disputeAmount: number;
  evidenceUrls: string[];
  status: ReportStatus;
  resolution?: DisputeResolution;
  adminNotes?: string;
};

type ModalState = { type: "review"; report: AdminReport } | null;
type FilterStatus = "All" | ReportStatus;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const INITIAL_REPORTS: AdminReport[] = [
  {
    id: "REP-012",
    username: "User 1",
    userId: "USR-034",
    createdAt: "2026-07-01T10:30:00.000Z",
    problemCategory: "Damaged Item",
    description: "Pottery arrived completely shattered due to poor bubble wrapping.",
    orderId: "ORD-99812",
    disputeAmount: 350000,
    evidenceUrls: ["/assets/evidence/broken-pot.jpg", "/assets/evidence/unboxing.mp4"],
    status: "Open",
  },
  {
    id: "REP-013",
    username: "User 2",
    userId: "USR-401",
    createdAt: "2026-06-30T14:15:00.000Z",
    problemCategory: "Fraud Indication",
    description: "Crafter is unreachable after 2 weeks, order status marked shipped but tracking invalid.",
    orderId: "ORD-99754",
    disputeAmount: 1250000,
    evidenceUrls: ["/assets/evidence/chat-log.png"],
    status: "Open",
  },
  {
    id: "REP-014",
    username: "User 3",
    userId: "USR-231",
    createdAt: "2026-06-28T09:00:00.000Z",
    problemCategory: "Wrong Item Sent",
    description: "Ordered a red knitted amigurumi doll, but received a blue tote bag instead.",
    orderId: "ORD-99521",
    disputeAmount: 180000,
    evidenceUrls: ["/assets/evidence/wrong-package.jpg"],
    status: "Resolved",
    resolution: "Refund_To_Buyer",
    adminNotes: "Investigated chat logs. Crafter admitted mislabeling the shipping package. Refund executed.",
  },
];

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: ReportStatus }) {
  return status === "Open" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-900">
      <Clock size={12} /> Open
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-900">
      <CheckCircle size={12} /> Resolved
    </span>
  );
}

// ─── Dispute Review & Resolution Modal ────────────────────────────────────────

interface ReviewModalProps {
  report: AdminReport;
  onResolve: (id: string, resolution: DisputeResolution, notes: string) => void;
  onClose: () => void;
}

function ReportReviewModal({ report, onResolve, onClose }: ReviewModalProps) {
  const [resolution, setResolution] = useState<DisputeResolution>("Refund_To_Buyer");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!notes.trim()) {
      setError("Please provide a concluding summary of your investigation.");
      return;
    }
    onResolve(report.id, resolution, notes.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-[560px] rounded-2xl shadow-2xl animate-modal-in bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">Review Dispute Ticket</h2>
              <span className="text-xs font-mono px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500">
                {report.id}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">Submitted by {report.username} ({report.userId})</p>
          </div>
          <button title="close-modal" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body (Scrollable Content) */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
          {/* Dispute Context */}
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-150 dark:border-neutral-800">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Order ID</p>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{report.orderId}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Escrow Amount</p>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(report.disputeAmount)}
              </p>
            </div>
          </div>

          {/* Chronology Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1 text-neutral-500">Problem Chronology</label>
            <div className="text-sm p-3.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-xl leading-relaxed">
              {report.description}
            </div>
          </div>

          {/* Evidence Attachments */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-500">Evidence Supporting Materials</label>
            <div className="flex flex-wrap gap-2">
              {report.evidenceUrls.map((url, index) => (
                <a
                  key={index}
                  href="#view-evidence"
                  onClick={(e) => { e.preventDefault(); alert(`Viewing file: ${url}`); }}
                  className="inline-flex items-center gap-2 px-3 h-9 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <FileText size={14} />
                  <span>Evidence #{index + 1}</span>
                  <ExternalLink size={12} className="text-neutral-400" />
                </a>
              ))}
            </div>
          </div>

          <hr className="border-neutral-100 dark:border-neutral-800" />

          {/* Ticket State Condition */}
          {report.status === "Open" ? (
            <div className="space-y-4">
              {/* Action Decision Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-500">Dispute Resolution Verdict</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${resolution === "Refund_To_Buyer" ? "border-[#0022FF] bg-blue-50/20 dark:border-[#4d6bff] dark:bg-blue-950/10" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={resolution === "Refund_To_Buyer"} onChange={() => setResolution("Refund_To_Buyer")} className="text-[#0022FF]" />
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Full Refund to Buyer</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">Reverse payment back to the buyer's balance.</p>
                  </label>
                  <label className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${resolution === "Release_To_Crafter" ? "border-[#0022FF] bg-blue-50/20 dark:border-[#4d6bff] dark:bg-blue-950/10" : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" checked={resolution === "Release_To_Crafter"} onChange={() => setResolution("Release_To_Crafter")} className="text-[#0022FF]" />
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Release to Crafter</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">Dismiss dispute and release escrow funds to the crafter.</p>
                  </label>
                </div>
              </div>

              {/* Response Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5 text-neutral-500">Investigation Conclusion Notes <span className="text-red-500">*</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); if (error) setError(""); }}
                  placeholder="Type down findings and final agreement conditions..."
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg text-sm resize-none bg-neutral-50 dark:bg-neutral-800 border text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 ${error ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-900/30" : "border-neutral-200 dark:border-neutral-700 focus:border-[#0022FF] focus:ring-blue-100"}`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            </div>
          ) : (
            /* Historical Closed Record View */
            <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle size={14} /> Ticket Closed & Funds Settled
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                <strong>Verdict Action:</strong> {report.resolution === "Refund_To_Buyer" ? "Full Refund Issued to Buyer" : "Funds Transferred to Crafter Account"}.
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                &ldquo;{report.adminNotes}&rdquo;
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 px-6 py-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 rounded-b-2xl flex-shrink-0">
          <button onClick={onClose} className="flex-1 h-10 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Close Panel
          </button>
          {report.status === "Open" && (
            <button onClick={handleSubmit} className="flex-1 h-10 bg-[#0022FF] hover:bg-[#0017AA] dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee] rounded-xl text-sm font-semibold text-white transition-colors shadow-sm">
              Resolve Ticket
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Page Component ──────────────────────────────────────────

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("All");
  const [modal, setModal] = useState<ModalState>(null);

  // ── Filter Data Logic ──
  const filteredReports = useMemo(() => {
    const q = search.toLowerCase().trim();
    return reports.filter((r) => {
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.problemCategory.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [reports, search, statusFilter]);

  // ── Resolve Handler (Flow Poin 4 & 5) ──
  const handleResolveTicket = (id: string, resolution: DisputeResolution, notes: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "Resolved", resolution, adminNotes: notes }
          : r
      )
    );
    setModal(null);
    // Real-world integration alert trigger context matching prompt rules
    alert(`Success! Dispute ${id} settled. Emails dispatching to both parties.`);
  };

  return (
    <>
      <AdminHeader
        title="Reports"
        description="Mediate dispute cases, examine verification assets, and handle transactional escrow resolutions."
      />

      <main className="flex-1 p-3 sm:p-6 overflow-auto">
        
        {/* Table/Card Workspace Layout */}
        <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 overflow-hidden">
          
          {/* Toolbar (Matches Header Filters Design in image_e87072.png) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-3 sm:p-4 border-b border-neutral-100 dark:border-neutral-800">
            
            {/* Search Input Box */}
            <div className="relative flex-1 min-w-[140px] max-w-[320px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Search report details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-4 rounded-lg text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] transition-all"
              />
            </div>

            {/* Ticket State Filter Status Dropdown */}
            <div className="relative">
              <select
                title="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                className="appearance-none h-9 pl-3 pr-8 rounded-lg text-sm font-medium bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:border-[#0022FF] cursor-pointer transition-all"
              >
                <option value="All">All Ticket Status</option>
                <option value="Open">Open Cases</option>
                <option value="Resolved">Resolved Cases</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

            <p className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:block ml-2">
              Showing {filteredReports.length} tickets
            </p>
          </div>

          {/* Table Container Section */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  {/* Matches Column Setup directly from image_e87072.png & image_e870cb.png */}
                  {["Report ID", "Username", "Created At", "Problem Category", "Description", "Action"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 whitespace-nowrap ${
                        i === 5 ? "text-right pr-6" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredReports.length === 0 ? (
                  /* Renders No Reports Empty State Wireframe Layout inside image_e87072.png */
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                          <FolderOpen size={28} className="text-neutral-300 dark:text-neutral-600" />
                        </div>
                        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                          No reports found
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-600">
                          Dispute records are clean. No active user complaints registered.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* Renders Populated Rows from Table Setup within image_e870cb.png */
                  filteredReports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b border-neutral-50 dark:border-neutral-800/60 last:border-0 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* Column 1: Report ID */}
                      <td className="px-4 py-4 whitespace-nowrap font-mono text-xs text-neutral-400 dark:text-neutral-500">
                        {report.id}
                      </td>

                      {/* Column 2: Username */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">{report.username}</span>
                          <span className="text-xs text-neutral-400">({report.userId})</span>
                        </div>
                      </td>

                      {/* Column 3: Created At */}
                      <td className="px-4 py-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400 text-xs">
                        {new Date(report.createdAt).toLocaleDateString("en-GB")}
                      </td>

                      {/* Column 4: Problem Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          <AlertTriangle size={13} className="text-amber-500" />
                          {report.problemCategory}
                        </span>
                      </td>

                      {/* Column 5: Description Summary */}
                      <td className="px-4 py-4">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[240px] truncate" title={report.description}>
                          {report.description}
                        </p>
                      </td>

                      {/* Column 6: Action Panel Trigger Component */}
                      <td className="px-4 py-4 whitespace-nowrap text-right pr-6">
                        <button
                          onClick={() => setModal({ type: "review", report })}
                          className={`inline-flex items-center gap-1.5 h-7 px-3.5 rounded-full text-xs font-semibold transition-colors ${
                            report.status === "Open"
                              ? "bg-[#0022FF] text-white hover:bg-[#0017AA] dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
                              : "border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <Eye size={12} />
                          {report.status === "Open" ? "Investigate" : "View Log"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Render Dynamic Modal State Component */}
      {modal?.type === "review" && (
        <ReportReviewModal
          report={modal.report}
          onClose={() => setModal(null)}
          onResolve={handleResolveTicket}
        />
      )}

      {/* Animation Global Transitions Keyframe Styles Injection */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
      `}</style>
    </>
  );
}