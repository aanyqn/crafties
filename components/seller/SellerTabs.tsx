"use client";

import { useState } from "react";
import { Seller } from "@/types/seller";
import SellerStore    from "./SellerStore";    // ← tambah import
import SellerProducts from "./SellerProducts";
import SellerReviews  from "./SellerReviews";
import { Store, Package, MessageSquare } from "lucide-react";

interface Props {
  seller: Seller;
}

type Tab = "store" | "products" | "reviews";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "store",    label: "Store",    icon: <Store size={15} />         },
  { id: "products", label: "Products", icon: <Package size={15} />       },
  { id: "reviews",  label: "Reviews",  icon: <MessageSquare size={15} /> },
];

export default function SellerTabs({ seller }: Props) {
  const [tab, setTab] = useState<Tab>("store"); // default ke store tab

  return (
    <div className="space-y-6 mt-4">

      {/* Tab bar */}
      <div className="flex gap-1 border-b
                      border-neutral-200 dark:border-neutral-800">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium
                        -mb-px border-b-2 transition-all duration-200
                        ${tab === id
                          ? "border-[#0022FF] dark:border-[#4d6bff] text-[#0022FF] dark:text-[#4d6bff]"
                          : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                        }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "store"    && <SellerStore    seller={seller} />}
      {tab === "products" && <SellerProducts sellerId={seller.id} />}
      {tab === "reviews"  && <SellerReviews  sellerId={seller.id} />}

    </div>
  );
}