"use client";

import { useState } from "react";
import StarRating from "@/components/StarRating";

const CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "decorations", label: "Decorations" },
  { id: "accessories", label: "Accessories" },
  { id: "toys", label: "Toys" },
  { id: "gifts", label: "Gifts" },
];

type FilterState = {
  category: string;
  minPrice: string;
  maxPrice: string;
  rating: number;
};

type FilterSidebarProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

export type { FilterState };

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(filters.minPrice);
  const [localMax, setLocalMax] = useState(filters.maxPrice);

  const set = (partial: Partial<FilterState>) =>
    onChange({ ...filters, ...partial });

  const applyPrice = () =>
    set({ minPrice: localMin, maxPrice: localMax });

  return (
    <aside className="w-full flex flex-col gap-6" aria-label="Product filters">
      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Categories
          </h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0022FF]" aria-hidden="true" />
        </div>
        <ul className="flex flex-col gap-0.5 list-none p-0 m-0">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => set({ category: cat.id })}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  filters.category === cat.id
                    ? "bg-[#0022FF] text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Prices
          </h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0022FF]" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="filter-min-price" className="text-[10px] text-neutral-400 mb-1 block">
                Min (Rp)
              </label>
              <input
                id="filter-min-price"
                type="number"
                placeholder="0"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full h-9 px-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="filter-max-price" className="text-[10px] text-neutral-400 mb-1 block">
                Max (Rp)
              </label>
              <input
                id="filter-max-price"
                type="number"
                placeholder="999999"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full h-9 px-3 bg-neutral-100 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white transition-colors"
              />
            </div>
          </div>
          <button
            onClick={applyPrice}
            className="w-full h-9 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-[#0022FF] transition-colors cursor-pointer"
          >
            Apply Prices
          </button>
        </div>
      </div>

      <div className="border-t border-neutral-200" />

      {/* Rating Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Ratings
          </h2>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0022FF]" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => set({ rating: filters.rating === star ? 0 : star })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer group ${
                filters.rating === star
                  ? "bg-[#0022FF]/10 border border-[#0022FF]/30"
                  : "hover:bg-neutral-100"
              }`}
              aria-pressed={filters.rating === star}
              aria-label={`Filter ${star} stars and above`}
            >
              <StarRating rating={star} size={13} />
              <span className="text-xs text-neutral-500 group-hover:text-neutral-800 transition-colors">
                & upper
              </span>
            </button>
          ))}
          {filters.rating > 0 && (
            <button
              onClick={() => set({ rating: 0 })}
              className="text-xs text-neutral-400 hover:text-[#0022FF] text-left px-3 py-1 transition-colors cursor-pointer underline underline-offset-2"
            >
              Hapus filter rating
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
