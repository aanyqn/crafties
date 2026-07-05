"use client";

import { OrderStatus } from "@/types/order";

export type OrderTab = "All" | OrderStatus;

interface OrderTabsProps {
  activeTab: OrderTab;
  onChange: (tab: OrderTab) => void;
}

const tabs: OrderTab[] = [
  "All",
  "Unpaid",
  "Process",
  "On Delivery",
  "Done",
  "Returned",
  "Canceled",
];

export default function OrderTabs({
  activeTab,
  onChange,
}: OrderTabsProps) {
  return (
    <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex gap-8 justify-between overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => {
          const active = tab === activeTab;

          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={`
                relative
                flex-shrink-0
                pb-4
                text-sm
                md:text-base
                font-medium
                transition-all
                duration-200
                cursor-pointer

                ${
                  active
                    ? "text-[#0022FF]"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }
              `}
            >
              {tab}

              <span
                className={`
                  absolute
                  left-0
                  bottom-0
                  h-[3px]
                  rounded-full
                  bg-[#0022FF]
                  transition-all
                  duration-300

                  ${
                    active
                      ? "w-full opacity-100"
                      : "w-0 opacity-0"
                  }
                `}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}