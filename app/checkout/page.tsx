"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { filterCheckoutItems, calcCheckoutTotals } from "@/lib/checkoutUtils";
import { formatVariants } from "@/types/cart";

const ADDRESS = {
  name: "Budi Santoso",
  phone: "081234567890",
  label: "Rumah",
  fullAddress: "Jl. Sudirman No. 45, RT 01/RW 02, Kel. Karet, Kec. Setiabudi, Jakarta Selatan, DKI Jakarta 12920",
};

const PAYMENT_METHODS = [
  { id: "va-bca",     name: "BCA Virtual Account",     icon: "bank"   },
  { id: "va-mandiri", name: "Mandiri Virtual Account",  icon: "bank"   },
  { id: "ew-gopay",   name: "GoPay",                   icon: "wallet" },
  { id: "ew-qris",    name: "QRIS",                    icon: "qr"     },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function CheckoutPage() {
  const { items } = useCart();
  const [checkoutIds, setCheckoutIds] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("va-bca");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("crafties_checkout_ids");
      if (stored) setCheckoutIds(JSON.parse(stored) as string[]);
    } catch {
      // fallback: empty array = show all items
    }
  }, []);

  const checkoutItems = filterCheckoutItems(items, checkoutIds);
  const { subtotal, shippingCost, adminFee, total } = calcCheckoutTotals(checkoutItems);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16
                       bg-[#F9F8F5] dark:bg-neutral-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">

          <h1 className="text-3xl font-bold tracking-tight mb-8
                         font-[family-name:var(--font-display)]
                         text-neutral-900 dark:text-neutral-100">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

            {/* ── Left Column ── */}
            <div className="flex flex-col gap-6">

              {/* Alamat Pengiriman */}
              <section className="rounded-2xl border p-4 sm:p-6
                                  bg-white dark:bg-neutral-950
                                  border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold
                                 text-neutral-900 dark:text-neutral-100">
                    Delivery Address
                  </h2>
                  <button type="button" className="text-sm font-semibold hover:underline underline-offset-2
                                     text-[#0022FF] dark:text-[#4d6bff]">
                    Change Address
                  </button>
                </div>

                <div className="rounded-xl p-3 sm:p-4 border
                                border-[#0022FF]/20 dark:border-[#4d6bff]/20
                                bg-[#0022FF]/5 dark:bg-[#4d6bff]/10">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider rounded-full px-2 py-0.5
                                     text-[#0022FF] dark:text-[#4d6bff]
                                     bg-[#0022FF]/10 dark:bg-[#4d6bff]/20">
                      {ADDRESS.label}
                    </span>
                    <span className="text-sm font-bold
                                     text-neutral-900 dark:text-neutral-100">
                      {ADDRESS.name}
                    </span>
                    <span className="text-sm
                                     text-neutral-500 dark:text-neutral-400">
                      ({ADDRESS.phone})
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed
                                text-neutral-600 dark:text-neutral-400">
                    {ADDRESS.fullAddress}
                  </p>
                </div>
              </section>

              {/* Pesanan & Pengiriman & Pembayaran */}
              <section className="rounded-2xl border p-5 sm:p-6 transition-colors
                                  bg-white dark:bg-neutral-950
                                  border-neutral-200 dark:border-neutral-800">

                {/* Order Items */}
                <h2 className="text-lg font-bold mb-4
                               text-neutral-900 dark:text-neutral-100">
                  Pesanan Anda
                </h2>
                <div className="flex flex-col gap-4">
                  {checkoutItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-4 last:pb-0 border-b last:border-b-0
                                 border-neutral-100 dark:border-neutral-800"
                    >
                      <div className="w-20 h-20 rounded-xl relative overflow-hidden flex-shrink-0 border
                                      bg-neutral-100 dark:bg-neutral-800
                                      border-neutral-100 dark:border-neutral-800">
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-1
                                      text-neutral-500 dark:text-neutral-400">
                          {item.store}
                        </p>
                        <h3 className="text-sm font-bold mb-1 truncate
                                       text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </h3>
                        <p className="text-xs mb-2
                                      text-neutral-500 dark:text-neutral-400">
                          {formatVariants(item.selectedVariants)}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-1 sm:mt-0 gap-1 sm:gap-0">
                          <p className="text-xs font-medium
                                        text-neutral-600 dark:text-neutral-400">
                            {item.quantity} x {formatPrice(item.price)}
                          </p>
                          <p className="text-sm font-bold
                                        text-neutral-900 dark:text-neutral-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping */}
                <div className="mt-6 pt-6 border-t
                                border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-bold mb-3
                                 text-neutral-900 dark:text-neutral-100">
                    Choose Delivery Service
                  </h3>
                  <div className="rounded-xl p-3 flex items-center justify-between cursor-pointer border transition-colors
                                  bg-white dark:bg-neutral-900
                                  border-neutral-200 dark:border-neutral-700
                                  hover:border-[#0022FF] dark:hover:border-[#4d6bff]">
                    <div>
                      <p className="text-sm font-semibold
                                    text-neutral-900 dark:text-neutral-100">
                        Reguler (2-3 Days)
                      </p>
                      <p className="text-xs
                                    text-neutral-500 dark:text-neutral-400">
                        JNE / Sicepat / AnterAja
                      </p>
                    </div>
                    <span className="text-sm font-bold
                                     text-neutral-900 dark:text-neutral-100">
                      {formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mt-6 pt-6 border-t
                                border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-bold mb-3
                                 text-neutral-900 dark:text-neutral-100">
                    Payment Method
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedPayment(method.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200
                          ${selectedPayment === method.id
                            ? "border-[#0022FF] dark:border-[#4d6bff] bg-[#0022FF]/5 dark:bg-[#4d6bff]/10 shadow-sm"
                            : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-[#0022FF]/50 dark:hover:border-[#4d6bff]/50"
                          }`}
                      >
                        {/* Radio */}
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${selectedPayment === method.id
                            ? "border-[#0022FF] dark:border-[#4d6bff]"
                            : "border-neutral-300 dark:border-neutral-600"
                          }`}>
                          {selectedPayment === method.id && (
                            <div className="w-2 h-2 rounded-full
                                            bg-[#0022FF] dark:bg-[#4d6bff]" />
                          )}
                        </div>
                        <span className="text-sm font-semibold
                                         text-neutral-900 dark:text-neutral-100">
                          {method.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* ── Right Column: Summary ── */}
            <div className="flex-shrink-0">
              <div className="rounded-2xl border p-5 sm:p-6 shadow-sm lg:sticky lg:top-[128px]
                              bg-white dark:bg-neutral-950
                              border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-bold mb-6
                               text-neutral-900 dark:text-neutral-100">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-3 mb-6 pb-6 border-b
                                border-neutral-100 dark:border-neutral-800">
                  {[
                    { label: `Total Price (${checkoutItems.reduce((a, i) => a + i.quantity, 0)} barang)`, value: formatPrice(subtotal) },
                    { label: "Delivery Service", value: formatPrice(shippingCost) },
                    { label: "Service Charge",      value: formatPrice(adminFee)     },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-sm
                                       text-neutral-600 dark:text-neutral-400">
                        {label}
                      </span>
                      <span className="text-sm font-medium shrink-0
                                       text-neutral-900 dark:text-neutral-100">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span className="text-base font-bold
                                   text-neutral-900 dark:text-neutral-100">
                    Total Charge
                  </span>
                  <span className="text-xl font-extrabold
                                   text-[#0022FF] dark:text-[#4d6bff]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Link
                  href={`/orders/ORD-892301/pay?method=${selectedPayment}`}
                  className="flex items-center justify-center w-full h-12 rounded-full font-semibold text-sm
                             transition-all duration-200 text-white shadow-md hover:shadow-lg
                             bg-[#0022FF] hover:bg-[#0017AA]
                             dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
                >
                  Make Order
                </Link>

                <p className="text-[11px] text-center mt-4 leading-relaxed
                              text-neutral-400 dark:text-neutral-500">
                  Continue this process remind you are agree with our privacy policy
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
