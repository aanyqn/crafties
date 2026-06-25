"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { Product } from "@/components/ProductCard";

// ── Mock Data ──────────────────────────────────────────────────────────────
type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  variant: string;
  quantity: number;
  store: string;
};

const INITIAL_CART: CartItem[] = [
  {
    id: "cart-1",
    productId: "1",
    name: "Gelang Manik Bintang",
    price: 28000,
    image: "/assets/img/popular-img1.jpg",
    variant: "Ukuran: M, Warna: Biru Tua",
    quantity: 2,
    store: "Haruna Craft",
  },
  {
    id: "cart-2",
    productId: "2",
    name: "Vas Bunga Rotan Aestetik",
    price: 108000,
    image: "/assets/img/popular-img2.jpg",
    variant: "Ukuran: L",
    quantity: 1,
    store: "Gamora Studio",
  },
  {
    id: "cart-3",
    productId: "9",
    name: "Tas Rajut Casual Mini",
    price: 135000,
    image: "/assets/img/hero-image3.jpg",
    variant: "Warna: Cream",
    quantity: 1,
    store: "Blossom Beads",
  },
];

const SUGGESTIONS: Product[] = [
  { id: "5", name: "Kalung Manik Bohemian", price: "Rp 45.000", badge: "Blossom Beads", rating: 4.6, reviewCount: 98, category: "Aksesoris", image: "/assets/img/category-2.png" },
  { id: "3", name: "Gantungan Kunci Beruang Rajut", price: "Rp 26.000", badge: "Arcane Knit", rating: 4.9, reviewCount: 215, category: "Mainan & Amigurumi", image: "/assets/img/popular-img3.jpg" },
  { id: "7", name: "Hamper Kado Ulang Tahun", price: "Rp 155.000", badge: "Gifted Box", rating: 4.7, reviewCount: 62, category: "Kado & Custom", image: "/assets/img/category-4.png" },
  { id: "4", name: "Anyaman Keranjang Rotan", price: "Rp 65.000", badge: "Haruna Craft", rating: 4.2, reviewCount: 41, category: "Dekorasi Rumah", image: "/assets/img/category-1.png" },
];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [selected, setSelected] = useState<Set<string>>(new Set(INITIAL_CART.map((i) => i.id)));

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  const selectedItems = items.filter((i) => selected.has(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
        <div className="max-w-[1200px] mx-auto px-6 py-8">

          <h1 className="text-3xl font-bold text-neutral-900 font-[family-name:var(--font-display)] tracking-tight mb-8">
            Keranjang Belanja
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mb-16">

            {/* ── Left Column: Cart Items ── */}
            <div className="flex flex-col gap-4">

              {/* Select All Bar */}
              {items.length > 0 && (
                <div className="p-4 flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selected.size === items.length}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-neutral-300 text-[#0022FF] focus:ring-[#0022FF] cursor-pointer"
                  />
                  <span className="text-sm font-semibold text-neutral-900">
                    Pilih Semua ({items.length})
                  </span>
                  <button
                    onClick={() => {
                      setItems(prev => prev.filter(i => !selected.has(i.id)));
                      setSelected(new Set());
                    }}
                    disabled={selected.size === 0}
                    className="ml-auto text-sm font-semibold text-red-500 hover:text-red-600 disabled:opacity-50 cursor-pointer transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              )}

              {/* Items List */}
              {items.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-2">Keranjang belanjamu kosong</h2>
                  <p className="text-sm text-neutral-500 mb-6 max-w-sm">
                    Yuk, temukan kerajinan tangan unik dan menarik dari pengrajin lokal untuk mengisi keranjangmu!
                  </p>
                  <Link href="/products" className="px-6 py-2.5 bg-[#0022FF] text-white font-semibold rounded-full hover:bg-[#0017AA] transition-colors">
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-center relative border-b border-neutral-100 sm:border-none last:border-b-0">

                      {/* Checkbox, Image & Mobile Info */}
                      <div className="flex gap-3 sm:gap-5 items-start sm:items-center w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 mt-8 sm:mt-0 rounded-xl border-neutral-300 text-[#0022FF] focus:ring-[#0022FF] cursor-pointer flex-shrink-0"
                        />
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-neutral-100 relative overflow-hidden flex-shrink-0 border border-neutral-100">
                          <Image src={item.image} alt={item.name} fill sizes="(max-width: 640px) 80px, 96px" className="object-cover" />
                        </div>
                        {/* Info on Mobile */}
                        <div className="flex-1 min-w-0 sm:hidden pr-6">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0022FF] mb-0.5 truncate">{item.store}</p>
                          <h3 className="text-sm font-semibold text-neutral-900 mb-0.5 line-clamp-2 leading-tight">{item.name}</h3>
                          <p className="text-xs text-neutral-500 mb-1 truncate">{item.variant}</p>
                          <p className="text-sm font-semibold text-neutral-900">{formatPrice(item.price)}</p>
                        </div>
                      </div>

                      {/* Info on Desktop */}
                      <div className="hidden sm:block flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#0022FF] mb-1 truncate">{item.store}</p>
                        <h3 className="text-base font-semibold text-neutral-900 mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-neutral-500 mb-3 truncate">{item.variant}</p>
                        <p className="text-base font-semibold text-neutral-900">{formatPrice(item.price)}</p>
                      </div>

                      {/* Actions (Delete & Qty) */}
                      <div className="flex items-center justify-end sm:flex-col sm:items-end w-full sm:w-auto gap-4 sm:gap-6 sm:h-full mt-1 sm:mt-0">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="absolute top-4 right-4 sm:static text-neutral-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Hapus item"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                        <div className="flex items-center bg-white border border-neutral-200 rounded-full overflow-hidden mt-auto">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >−</button>
                          <span className="w-10 text-center text-sm font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right Column: Summary ── */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-[128px]">
                <h2 className="text-lg font-bold text-neutral-900 mb-6">Ringkasan Belanja</h2>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-neutral-600">Total Harga ({selectedItems.reduce((acc, i) => acc + i.quantity, 0)} barang)</span>
                  <span className="text-sm font-medium text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between mb-6 pb-6 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">Diskon</span>
                  <span className="text-sm font-medium text-green-600">- Rp 0</span>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span className="text-base font-bold text-neutral-900">Total Harga</span>
                  <span className="text-xl font-extrabold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>

                <Link
                  href="/checkout"
                  className={`flex items-center justify-center w-full h-12 rounded-full font-semibold text-sm transition-all duration-200 ${selected.size > 0
                    ? "bg-[#0022FF] text-white hover:bg-[#0017AA] shadow-md hover:shadow-lg"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed pointer-events-none"
                    }`}
                >
                  Beli ({selected.size})
                </Link>
              </div>
            </div>

          </div>

          {/* ── You May Also Like ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900 font-[family-name:var(--font-display)]">
                Pilihan Lain Untukmu
              </h2>
              <Link href="/products" className="text-sm font-semibold text-[#0022FF] hover:underline underline-offset-2">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUGGESTIONS.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
