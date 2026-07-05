"use client";

import { useMemo, useState } from "react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OrderTabs, { OrderTab } from "@/components/OrderTabs";
import OrderList from "@/components/OrderList";

import { MOCK_ORDERS } from "@/data/mockOrders";

export default function OrdersPage() {
  const [activeTab, setActiveTab] =
    useState<OrderTab>("All");

  const filteredOrders = useMemo(() => {
    if (activeTab === "All") {
      return MOCK_ORDERS;
    }

    return MOCK_ORDERS.filter(
      (order) => order.status === activeTab
    );
  }, [activeTab]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F9F8F5] dark:bg-neutral-900 pb-16">

        {/* Header */}
        <section>
          <div className="max-w-[1200px] mx-auto px-6 py-8">

            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-[family-name:var(--font-display)]">
              Orders
            </h1>

          </div>
        </section>

        {/* Content */}
        <section className="max-w-[1200px] mx-auto px-6">

          <OrderTabs
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="mt-8">
            <OrderList
              orders={filteredOrders}
            />
          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}