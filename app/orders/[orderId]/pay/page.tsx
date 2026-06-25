"use client";

import { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Mock Data ──────────────────────────────────────────────────────────────
const ORDER_DETAILS = {
  id: "ORD-892301",
  totalAmount: 165000,
  paymentMethod: "BCA Virtual Account",
  paymentCode: "8077 0812 3456 7890",
  deadline: "Besok, 14:30 WIB",
};

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success">("pending");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ORDER_DETAILS.paymentCode.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5] pb-16 pt-8 flex items-center justify-center">
        <div className="max-w-xl w-full px-4 sm:px-6">
          
          <div className="py-6 sm:p-12">
            
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-neutral-900 font-[family-name:var(--font-display)] mb-2">
                Selesaikan Pembayaran
              </h1>
              <p className="text-sm text-neutral-500">
                Selesaikan pembayaran sebelum <span className="font-semibold text-neutral-900">{ORDER_DETAILS.deadline}</span>
              </p>
              
              {/* Countdown Timer (Simulated static) */}
              <div className="mt-6 inline-flex items-center gap-3 bg-red-50 border border-red-100 px-5 py-2.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm font-bold text-red-600 tracking-wider">23 : 59 : 59</span>
              </div>
            </div>

            {/* Payment Details Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-8">
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-neutral-200">
                <div>
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Total Pembayaran</p>
                  <p className="text-2xl font-extrabold text-[#0022FF]">{formatPrice(ORDER_DETAILS.totalAmount)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Order ID</p>
                  <p className="text-sm font-bold text-neutral-900">{orderId}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Metode Pembayaran</p>
                <p className="text-sm font-bold text-neutral-900 mb-6">{ORDER_DETAILS.paymentMethod}</p>

                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Nomor Virtual Account</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-xl p-4">
                  <span className="text-lg sm:text-xl font-bold tracking-[0.1em] text-neutral-900 break-words">
                    {ORDER_DETAILS.paymentCode}
                  </span>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-sm font-semibold text-[#0022FF] hover:text-[#0017AA] transition-colors self-start sm:self-auto"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Tersalin
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Salin
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {paymentStatus === "success" ? (
                <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 className="text-lg font-bold text-green-700 mb-1">Pembayaran Berhasil!</h3>
                  <p className="text-sm text-green-600 mb-6 text-center">Terima kasih, pesanan Anda sedang diproses oleh pengrajin.</p>
                  <Link href="/products" className="w-full h-12 flex items-center justify-center bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors">
                    Lanjut Belanja
                  </Link>
                </div>
              ) : (
                <>
                  <button 
                    onClick={simulatePayment}
                    disabled={paymentStatus === "processing"}
                    className="w-full h-12 flex items-center justify-center bg-[#0022FF] text-white font-semibold rounded-full hover:bg-[#0017AA] transition-colors shadow-md hover:shadow-lg disabled:opacity-70"
                  >
                    {paymentStatus === "processing" ? "Mengecek..." : "Cek Status Pembayaran"}
                  </button>
                  <Link href="/products" className="w-full h-12 flex items-center justify-center bg-white border border-neutral-200 text-neutral-600 font-semibold rounded-full hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
                    Kembali ke Beranda
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
