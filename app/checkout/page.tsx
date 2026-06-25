"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Mock Data ──────────────────────────────────────────────────────────────
const CHECKOUT_ITEMS = [
  {
    id: "cart-1",
    name: "Gelang Manik Bintang",
    price: 28000,
    image: "/assets/img/popular-img1.jpg",
    variant: "Ukuran: M, Warna: Biru Tua",
    quantity: 2,
    store: "Haruna Craft",
  },
  {
    id: "cart-2",
    name: "Vas Bunga Rotan Aestetik",
    price: 108000,
    image: "/assets/img/popular-img2.jpg",
    variant: "Ukuran: L",
    quantity: 1,
    store: "Gamora Studio",
  },
];

const ADDRESS = {
  name: "Budi Santoso",
  phone: "081234567890",
  label: "Rumah",
  fullAddress: "Jl. Sudirman No. 45, RT 01/RW 02, Kel. Karet, Kec. Setiabudi, Jakarta Selatan, DKI Jakarta 12920",
};

const PAYMENT_METHODS = [
  { id: "va-bca", name: "BCA Virtual Account", icon: "bank" },
  { id: "va-mandiri", name: "Mandiri Virtual Account", icon: "bank" },
  { id: "ew-gopay", name: "GoPay", icon: "wallet" },
  { id: "ew-qris", name: "QRIS", icon: "qr" },
];

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState<string>("va-bca");

  const subtotal = CHECKOUT_ITEMS.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = 15000;
  const adminFee = 1000;
  const total = subtotal + shippingCost + adminFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F8F5] pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          
          <h1 className="text-3xl font-bold text-neutral-900 font-[family-name:var(--font-display)] tracking-tight mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            
            {/* ── Left Column: Checkout Details ── */}
            <div className="flex flex-col gap-6">
              
              {/* Destination Address */}
              <section className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-neutral-900">Alamat Pengiriman</h2>
                  <button className="text-sm font-semibold text-[#0022FF] hover:underline underline-offset-2">
                    Ubah Alamat
                  </button>
                </div>
                <div className="border border-[#0022FF]/20 bg-[#0022FF]/5 rounded-xl p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0022FF] bg-[#0022FF]/10 px-2 py-0.5 rounded-full">
                      {ADDRESS.label}
                    </span>
                    <span className="text-sm font-bold text-neutral-900">{ADDRESS.name}</span>
                    <span className="text-sm text-neutral-500">({ADDRESS.phone})</span>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed">{ADDRESS.fullAddress}</p>
                </div>
              </section>

              {/* Order Items */}
              <section className="p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Pesanan Anda</h2>
                <div className="flex flex-col gap-4">
                  {CHECKOUT_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-100 last:border-b-0 last:pb-0">
                      <div className="w-20 h-20 rounded-xl bg-neutral-100 relative overflow-hidden flex-shrink-0 border border-neutral-100">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-1">{item.store}</p>
                        <h3 className="text-sm font-bold text-neutral-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-xs text-neutral-500 mb-2">{item.variant}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1 sm:mt-0 gap-1 sm:gap-0">
                          <p className="text-xs font-medium text-neutral-600">{item.quantity} x {formatPrice(item.price)}</p>
                          <p className="text-sm font-bold text-neutral-900">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Simulated Shipping Selector */}
                <div className="mt-6 pt-6 border-t border-neutral-100">
                  <h3 className="text-sm font-bold text-neutral-900 mb-3">Pilih Pengiriman</h3>
                  <div className="bg-white border border-neutral-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#0022FF] transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">Reguler (2-3 Hari)</p>
                      <p className="text-xs text-neutral-500">JNE / Sicepat / AnterAja</p>
                    </div>
                    <span className="text-sm font-bold text-neutral-900">{formatPrice(shippingCost)}</span>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section className="p-4 sm:p-6">
                <h2 className="text-lg font-bold text-neutral-900 mb-4">Metode Pembayaran</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                        selectedPayment === method.id
                          ? "border-[#0022FF] bg-[#0022FF]/5 shadow-sm"
                          : "border-neutral-200 hover:border-[#0022FF]/50 bg-white"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedPayment === method.id ? "border-[#0022FF]" : "border-neutral-300"
                      }`}>
                        {selectedPayment === method.id && <div className="w-2 h-2 bg-[#0022FF] rounded-full" />}
                      </div>
                      <span className="text-sm font-semibold text-neutral-900">{method.name}</span>
                    </button>
                  ))}
                </div>
              </section>

            </div>

            {/* ── Right Column: Summary ── */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-6 shadow-sm lg:sticky lg:top-[128px]">
                <h2 className="text-lg font-bold text-neutral-900 mb-6">Ringkasan Belanja</h2>
                
                <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-neutral-600">Total Harga ({CHECKOUT_ITEMS.reduce((a, i) => a + i.quantity, 0)} barang)</span>
                    <span className="text-sm font-medium text-neutral-900 shrink-0">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-neutral-600">Total Ongkos Kirim</span>
                    <span className="text-sm font-medium text-neutral-900 shrink-0">{formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-neutral-600">Biaya Layanan</span>
                    <span className="text-sm font-medium text-neutral-900 shrink-0">{formatPrice(adminFee)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span className="text-base font-bold text-neutral-900">Total Tagihan</span>
                  <span className="text-xl font-extrabold text-[#0022FF]">{formatPrice(total)}</span>
                </div>

                <Link
                  href="/orders/ORD-892301/pay"
                  className="flex items-center justify-center w-full h-12 rounded-full font-semibold text-sm transition-all duration-200 bg-[#0022FF] text-white hover:bg-[#0017AA] shadow-md hover:shadow-lg"
                >
                  Buat Pesanan
                </Link>
                <p className="text-[11px] text-center text-neutral-400 mt-4 leading-relaxed">
                  Dengan melanjutkan, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi Crafties.
                </p>
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
