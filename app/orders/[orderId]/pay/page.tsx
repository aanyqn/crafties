"use client";

import { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Smartphone } from "lucide-react";
import Image from "next/image";
import { calcCheckoutTotals, filterCheckoutItems } from "@/lib/checkoutUtils";
import { useCart } from "@/contexts/CartContext";

const PAYMENT_CONFIGS = {
  "va-bca": {
    name: "BCA Virtual Account",
    bankName: "Bank Central Asia",
    type: "va" as const,
    code: "8077 0812 3456 7890",
    instructions: [
      "Open m-BCA or BCA ATM.",
      'Select "Transfer" → "BCA Virtual Account".',
      "Enter the virtual account number above.",
      "Confirm the amount and complete the payment.",
    ],
  },
  "va-mandiri": {
    name: "Mandiri Virtual Account",
    bankName: "Bank Mandiri",
    type: "va" as const,
    code: "8928 0176 4532 1089",
    instructions: [
      "Open Livin' by Mandiri or a Mandiri ATM.",
      'Select "Bayar" → "Multi Payment".',
      "Enter company code 70014 then the virtual account number.",
      "Confirm the amount and complete the payment.",
    ],
  },
  "ew-gopay": {
    name: "GoPay",
    type: "ewallet" as const,
    instructions: [
      "Tap the button below or open your Gojek app.",
      'Select "GoPay" and scan the QR code.',
      "Confirm the payment amount and complete.",
    ],
  },
  "ew-qris": {
    name: "QRIS",
    type: "qris" as const,
    instructions: [
      "Open any QRIS-supported payment app.",
      "Tap 'Scan QR' and point it at the code below.",
      "Verify the merchant name and amount, then confirm.",
    ],
  },
} as const;

type MethodId = keyof typeof PAYMENT_CONFIGS;
type Config = typeof PAYMENT_CONFIGS[MethodId];

const ORDER_DETAILS = {
  id: "ORD-892301",
  totalAmount: 165000,
  deadline: "Besok, 14:30 WIB",
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
function QRCodeMock({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="p-3 rounded-2xl border-2 bg-white
                      border-neutral-200 dark:border-neutral-700">
        <Image width={500} height={500} src={'/assets/img/QRIS.jpg'} alt="qrcode" />
      </div>
      <p className="text-xs text-center text-neutral-500 dark:text-neutral-400 max-w-[180px]">
        {label}
      </p>
    </div>
  );
}

function Instructions({ steps }: { steps: readonly string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-xs font-semibold transition-colors w-full text-left
                   text-[#0022FF] dark:text-[#4d6bff]
                   hover:text-[#0017AA] dark:hover:text-[#6b85ff]"
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
        {open ? "Hide" : "How to pay"}
      </button>

      {open && (
        <ol className="mt-3 space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed
                                    text-neutral-600 dark:text-neutral-400">
              <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5
                               bg-[#0022FF]/10 dark:bg-[#4d6bff]/20
                               text-[#0022FF] dark:text-[#4d6bff]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function PaymentContent({ config, orderId }: { config: Config; orderId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Virtual Account ── */
  if (config.type === "va") {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1
                        text-neutral-500 dark:text-neutral-400">
            Payment Method
          </p>
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {config.name}
          </p>
          <p className="text-xs mt-0.5 text-neutral-400 dark:text-neutral-500">
            {config.bankName}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-2
                        text-neutral-500 dark:text-neutral-400">
            Virtual Account Number
          </p>
          <div className="flex items-center justify-between gap-4 rounded-xl border p-4
                          bg-white dark:bg-neutral-800
                          border-neutral-200 dark:border-neutral-700">
            <span className="text-xl font-bold tracking-[0.12em] break-all
                             text-neutral-900 dark:text-neutral-100">
              {config.code}
            </span>
            <button
              onClick={() => handleCopy(config.code)}
              className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 transition-colors
                         text-[#0022FF] hover:text-[#0017AA]
                         dark:text-[#4d6bff] dark:hover:text-[#6b85ff]"
            >
              {copied ? <><Check size={15} />Copied</> : <><Copy size={15} />Copy</>}
            </button>
          </div>
        </div>

        <Instructions steps={config.instructions} />
      </>
    );
  }

  /* ── GoPay ── */
  if (config.type === "ewallet") {
    return (
      <>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-1
                        text-neutral-500 dark:text-neutral-400">
            Payment Method
          </p>
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {config.name}
          </p>
        </div>

        <QRCodeMock label="Scan with GoPay" />

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          <span className="text-xs text-neutral-400 dark:text-neutral-500">or</span>
          <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        </div>

        <Link href="https://gojek.onelink.me/2un4/landing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-11 rounded-full text-sm font-semibold
        transition-colors text-white
        bg-[#00ADE0] hover:bg-[#009ec9]">
          <Smartphone size={16} />
          Open GoPay App
        </Link>

        <Instructions steps={config.instructions} />
      </>
    );
  }

  /* ── QRIS ── */
  return (
    <>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-1
                      text-neutral-500 dark:text-neutral-400">
          Payment Method
        </p>
        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {config.name}
        </p>
      </div>

      <QRCodeMock label="Scan with any QRIS-supported app" />

      {/* Compatible apps */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {["GoPay", "OVO", "DANA", "ShopeePay", "LinkAja", "+ more"].map((app) => (
          <span
            key={app}
            className="text-[11px] px-2 py-0.5 rounded-full font-medium
                       bg-neutral-100 dark:bg-neutral-800
                       text-neutral-500 dark:text-neutral-400"
          >
            {app}
          </span>
        ))}
      </div>

      <Instructions steps={config.instructions} />
    </>
  );
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { items } = useCart();
  const [checkoutIds, setCheckoutIds] = useState<string[]>([]);
  const { orderId } = use(params);
  const searchParams = useSearchParams();
  const methodId = (searchParams.get("method") ?? "va-bca") as MethodId;
  const config = PAYMENT_CONFIGS[methodId] ?? PAYMENT_CONFIGS["va-bca"];

  const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success">("pending");

  const simulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => setPaymentStatus("success"), 2000);
  };

  const checkoutItems = filterCheckoutItems(items, checkoutIds);
  const { subtotal, shippingCost, adminFee, total } = calcCheckoutTotals(checkoutItems);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16 pt-8 flex items-center justify-center
                       bg-[#F9F8F5] dark:bg-neutral-950">
        <div className="max-w-xl w-full px-4 sm:px-6">
          <div className="py-6 sm:p-12">

            {/* ── Header ── */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2 font-[family-name:var(--font-display)]
                             text-neutral-900 dark:text-neutral-100">
                Finish Payment
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Complete before{" "}
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {ORDER_DETAILS.deadline}
                </span>
              </p>

              {/* Countdown */}
              <div className="mt-5 inline-flex items-center gap-3 rounded-full px-5 py-2.5 border
                              bg-red-50 dark:bg-red-950/30
                              border-red-100 dark:border-red-900/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="stroke-red-600 dark:stroke-red-400">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-sm font-bold tracking-wider text-red-600 dark:text-red-400">
                  23 : 59 : 59
                </span>
              </div>
            </div>

            {/* ── Payment Details Card ── */}
            <div className="rounded-2xl border p-6 mb-6
                            bg-neutral-50 dark:bg-neutral-900
                            border-neutral-200 dark:border-neutral-800">

              {/* Total + Order ID */}
              <div className="flex justify-between items-start gap-4 mb-6 pb-6 border-b
                              border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1
                                text-neutral-500 dark:text-neutral-400">
                    Total Payment
                  </p>
                  <p className="text-2xl font-extrabold
                                text-[#0022FF] dark:text-[#4d6bff]">
                    {formatPrice(total)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1
                                text-neutral-500 dark:text-neutral-400">
                    Order ID
                  </p>
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {orderId}
                  </p>
                </div>
              </div>

              {/* Dynamic content based on payment method */}
              <div className="flex flex-col gap-5">
                <PaymentContent config={config} orderId={orderId} />
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex flex-col gap-3">
              {paymentStatus === "success" ? (
                <div className="flex flex-col items-center p-6 rounded-2xl border
                                bg-green-50 dark:bg-green-950/30
                                border-green-200 dark:border-green-900/50">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4
                                  bg-green-100 dark:bg-green-900/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="stroke-green-600 dark:stroke-green-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-green-700 dark:text-green-400">
                    Payment successful!
                  </h3>
                  <p className="text-sm text-center mb-6 text-green-600 dark:text-green-500">
                    Thank you! Your order is being processed.
                  </p>
                  <Link
                    href="/products"
                    className="w-full h-12 flex items-center justify-center font-semibold rounded-full
                               text-white transition-colors
                               bg-green-600 hover:bg-green-700
                               dark:bg-green-700 dark:hover:bg-green-800"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={simulatePayment}
                    disabled={paymentStatus === "processing"}
                    className="w-full h-12 flex items-center justify-center font-semibold rounded-full
                               text-white shadow-md hover:shadow-lg disabled:opacity-70 transition-colors
                               bg-[#0022FF] hover:bg-[#0017AA]
                               dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
                  >
                    {paymentStatus === "processing" ? "Checking…" : "Check Payment Status"}
                  </button>

                  <Link
                    href="/products"
                    className="w-full h-12 flex items-center justify-center font-semibold rounded-full
                               border transition-colors
                               bg-white dark:bg-neutral-900
                               border-neutral-200 dark:border-neutral-700
                               text-neutral-600 dark:text-neutral-300
                               hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    Back to Home
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