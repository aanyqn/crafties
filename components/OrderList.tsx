"use client";

import Image from "next/image";
import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import { Order } from "@/types/order";
import { Package } from "lucide-react";
import { formatPrice } from "@/data/mockOrders";

interface Props {
  orders: Order[];
}

export default function OrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border py-20 px-6 text-center justify-center
                      bg-white dark:bg-neutral-950
                      border-neutral-200 dark:border-neutral-800">
        <Package className="block mx-auto mb-5 w-16 h-16
                            text-neutral-300 dark:text-neutral-700" />
        <h3 className="text-xl font-bold
                       text-neutral-900 dark:text-neutral-100">
          No Orders Found
        </h3>
        <p className="mt-3
                      text-neutral-500 dark:text-neutral-400">
          There are no orders in this category.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center mt-8 h-11 px-6 rounded-full
                     text-white transition-colors
                     bg-[#0022FF] hover:bg-[#0019d8]
                     dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border overflow-hidden
                    bg-white dark:bg-neutral-950
                    border-neutral-200 dark:border-neutral-800">

      {/* ── Desktop table header ── */}
      <div className="hidden lg:grid grid-cols-[80px_0.5fr_88px_160px_144px_0.5fr] gap-4 px-6 py-3.5 border-b
                      bg-neutral-50 dark:bg-neutral-950
                      border-neutral-100 dark:border-neutral-800">
        <div />
        {["Product", "Qty", "Total", "Status", "Action"].map((label, i) => (
          <div
            key={label}
            className={`text-xs font-semibold uppercase tracking-wider
                        text-neutral-400 dark:text-neutral-600
                        ${i > 0 ? "text-center" : ""}`}
          >
            {label}
          </div>
        ))}
        <div />
      </div>

      {/* ── Mobile / tablet mini-header ── */}
      <div className="lg:hidden flex items-center justify-between px-5 py-3 border-b
                      bg-neutral-50 dark:bg-neutral-950
                      border-neutral-100 dark:border-neutral-800">
        <span className="text-xs font-semibold uppercase tracking-wider
                         text-neutral-800 dark:text-neutral-400">
          Orders
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {orders.length} item{orders.length !== 1 ? "s" : ""}
        </span>
      </div>

      {orders.map((order, index) => (
        <OrderCard
          key={order.id}
          order={order}
          last={index === orders.length - 1}
        />
      ))}
    </div>
  );
}

interface CardProps {
  order: Order;
  last: boolean;
}

function OrderCard({ order, last }: CardProps) {
  const actionLabel =
    order.status === "Done"        ? "Buy Again"   :
    order.status === "On Delivery" ? "Track Order" : "View Detail";

  const actionBtn = `
    h-9 px-4 rounded-full text-sm font-medium cursor-pointer whitespace-nowrap
    transition-colors
    border border-[#0022FF] text-[#0022FF]
    hover:bg-[#0022FF] hover:text-white
    dark:border-[#4d6bff] dark:text-[#4d6bff]
    dark:hover:bg-[#4d6bff] dark:hover:text-white
  `;

  const thumb = `
    relative rounded-xl overflow-hidden flex-shrink-0
    border border-neutral-100 dark:border-neutral-800
    bg-neutral-50 dark:bg-neutral-900
  `;

  return (
    <div
      className={`
        px-5 lg:px-6 py-5 transition-colors
        hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60
        ${!last && "border-b border-neutral-100 dark:border-neutral-800"}
      `}
    >

      {/* ══ Desktop ≥ lg ══ */}
      <div className="hidden lg:grid grid-cols-[80px_0.5fr_88px_160px_144px_0.5fr] items-center gap-4">

        <div className={`${thumb} w-[72px] h-[72px]`}>
          <Image src={order.productImage} alt={order.productName} fill className="object-cover" />
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-[15px] truncate
                         text-neutral-900 dark:text-neutral-100">
            {order.productName}
          </h3>
          <p className="text-sm mt-0.5 truncate
                        text-neutral-400 dark:text-neutral-500">
            {order.variant}
          </p>
          <p className="mt-2 font-bold
                        text-[#0022FF] dark:text-[#4d6bff]">
            {formatPrice(order.price)}
          </p>
        </div>

        <div className="text-center">
          <span className="text-sm font-semibold
                           text-neutral-700 dark:text-neutral-300">
            × {order.quantity}
          </span>
        </div>

        <div className="text-center">
          <span className="text-sm font-semibold
                           text-neutral-700 dark:text-neutral-300">
            {formatPrice(order.total)}
          </span>
        </div>

        <div className="flex justify-center">
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex justify-center">
          <button className={actionBtn}>{actionLabel}</button>
        </div>
      </div>

      {/* ══ Tablet md–lg ══ */}
      <div className="hidden md:flex lg:hidden items-center gap-4">

        <div className={`${thumb} w-20 h-20`}>
          <Image src={order.productImage} alt={order.productName} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-[15px] truncate
                           text-neutral-900 dark:text-neutral-100">
              {order.productName}
            </h3>
            <div className="flex-shrink-0">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <p className="text-sm mt-0.5 truncate
                        text-neutral-400 dark:text-neutral-500">
            {order.variant}
          </p>

          <div className="flex items-center justify-between gap-3 mt-2.5">
            <div>
              <p className="font-bold
                            text-[#0022FF] dark:text-[#4d6bff]">
                {formatPrice(order.total)}
              </p>
              <p className="text-xs mt-0.5
                            text-neutral-400 dark:text-neutral-500">
                Qty × {order.quantity}
              </p>
            </div>
            <button className={`flex-shrink-0 ${actionBtn}`}>{actionLabel}</button>
          </div>
        </div>
      </div>

      {/* ══ Mobile < md ══ */}
      <div className="md:hidden flex gap-3">

        <div className={`${thumb} w-[68px] h-[68px]`}>
          <Image src={order.productImage} alt={order.productName} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 flex-1
                           text-neutral-900 dark:text-neutral-100">
              {order.productName}
            </h3>
            <div className="flex-shrink-0 mt-0.5">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <p className="text-xs mt-0.5 truncate
                        text-neutral-400 dark:text-neutral-500">
            {order.variant}
          </p>

          <div className="flex items-center justify-between mt-1.5">
            <p className="font-bold text-sm
                          text-[#0022FF] dark:text-[#4d6bff]">
              {formatPrice(order.total)}
            </p>
            <p className="text-xs
                          text-neutral-400 dark:text-neutral-500">
              × {order.quantity}
            </p>
          </div>

          <button className={`mt-3 h-10 active:scale-[0.98] ${actionBtn}`}>
            {actionLabel}
          </button>
        </div>
      </div>

    </div>
  );
}