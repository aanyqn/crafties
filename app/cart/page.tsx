"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { CartItem, formatVariants } from "@/types/cart";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Trash } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

const SUGGESTIONS: Product[] = [
  MOCK_PRODUCTS.find(p => p.id === "5")!,
  MOCK_PRODUCTS.find(p => p.id === "3")!,
  MOCK_PRODUCTS.find(p => p.id === "7")!,
  MOCK_PRODUCTS.find(p => p.id === "4")!,
].filter(Boolean);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(items.map((i) => i.id))
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === items.length ? new Set() : new Set(items.map((i) => i.id)));
  };

  const handleDeleteAll = () => {
    selected.forEach((id) => removeFromCart(id));
    setSelected(new Set());
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    setSelected((prev) => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleCheckout = () => {
    sessionStorage.setItem("crafties_checkout_ids", JSON.stringify([...selected]));
    router.push("/checkout");
  };

  const selectedItems = items.filter((i) => selected.has(i.id));
  const subtotal      = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16
                       bg-[#F9F8F5] dark:bg-neutral-900">
        <div className="max-w-[1200px] mx-auto px-6 py-8">

          <h1 className="text-3xl font-bold tracking-tight mb-8
                         font-[family-name:var(--font-display)]
                         text-neutral-900 dark:text-neutral-100">
            Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 mb-16">

            {/* ── Left: Cart Items ── */}
            <div className="flex flex-col gap-4">

              {/* Select All Bar */}
              {items.length > 0 && (
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    aria-label="Select all items"
                    checked={selected.size === items.length && items.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600
                               text-[#0022FF] focus:ring-[#0022FF] cursor-pointer"
                  />
                  <span className="text-sm font-semibold
                                   text-neutral-900 dark:text-neutral-100">
                    Select all ({items.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleDeleteAll}
                    disabled={selected.size === 0}
                    className="ml-auto text-sm font-semibold transition-colors
                               text-red-500 hover:text-red-600
                               dark:text-red-400 dark:hover:text-red-300
                               disabled:opacity-50 cursor-pointer"
                  >
                    Delete All
                  </button>
                </div>
              )}

              {/* Empty State */}
              {items.length === 0 ? (
                <div className="rounded-2xl border p-12 flex flex-col items-center justify-center text-center
                                bg-white dark:bg-neutral-950
                                border-neutral-200 dark:border-neutral-800">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4
                                  bg-neutral-100 dark:bg-neutral-800">
                    <ShoppingCart className="text-neutral-100"/>
                  </div>
                  <h2 className="text-lg font-bold mb-2
                                 text-neutral-900 dark:text-neutral-100">
                    Your cart is empty
                  </h2>
                  <p className="text-sm mb-6 max-w-sm
                                text-neutral-500 dark:text-neutral-400">
                    Find some cute and amazing goodies!
                  </p>
                  <Link
                    href="/products"
                    className="px-6 py-2.5 font-semibold rounded-full transition-colors text-white
                               bg-[#0022FF] hover:bg-[#0017AA]
                               dark:bg-[#4d6bff] dark:hover:bg-[#3a56ee]"
                  >
                    Start Shopping
                  </Link>
                </div>

              ) : (
                /* Items List */
                <div className="rounded-2xl border flex flex-col gap-4
                                bg-white dark:bg-neutral-950
                                border-neutral-200 dark:border-neutral-800">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5
                                 items-start sm:items-center relative
                                 border-b border-neutral-100 dark:border-neutral-800
                                 last:border-b-0"
                    >
                      {/* Checkbox + Image + Mobile Info */}
                      <div className="flex gap-3 sm:gap-5 items-start sm:items-center w-full sm:w-auto">
                        <input
                          type="checkbox"
                          aria-label={`Select ${item.name}`}
                          checked={selected.has(item.id)}
                          onChange={() => toggleSelect(item.id)}
                          className="w-4 h-4 mt-8 sm:mt-0 rounded-xl cursor-pointer flex-shrink-0
                                     border-neutral-300 dark:border-neutral-600
                                     text-[#0022FF] focus:ring-[#0022FF]"
                        />
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl relative overflow-hidden flex-shrink-0
                                        bg-neutral-100 dark:bg-neutral-800
                                        border border-neutral-100 dark:border-neutral-800">
                          <Image src={item.image} alt={item.name} fill
                            sizes="(max-width: 640px) 80px, 96px" className="object-cover" />
                        </div>

                        {/* Info — Mobile only */}
                        <div className="flex-1 min-w-0 sm:hidden pr-6">
                          <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5 truncate
                                        text-[#0022FF] dark:text-[#4d6bff]">
                            {item.store}
                          </p>
                          <h3 className="text-sm font-semibold mb-0.5 line-clamp-2 leading-tight
                                         text-neutral-900 dark:text-neutral-100">
                            {item.name}
                          </h3>
                          <p className="text-xs mb-1 truncate
                                        text-neutral-500 dark:text-neutral-400">
                            {formatVariants(item.selectedVariants)}
                          </p>
                          <p className="text-sm font-semibold
                                        text-neutral-900 dark:text-neutral-100">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Info — Desktop only */}
                      <div className="hidden sm:block flex-1 min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 truncate
                                      text-[#0022FF] dark:text-[#4d6bff]">
                          {item.store}
                        </p>
                        <h3 className="text-base font-semibold mb-1 truncate
                                       text-neutral-900 dark:text-neutral-100">
                          {item.name}
                        </h3>
                        <p className="text-sm mb-3 truncate
                                      text-neutral-500 dark:text-neutral-400">
                          {formatVariants(item.selectedVariants)}
                        </p>
                        <p className="text-base font-semibold
                                      text-neutral-900 dark:text-neutral-100">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Delete + Quantity */}
                      <div className="flex items-center justify-end sm:flex-col sm:items-end
                                      w-full sm:w-auto gap-4 sm:gap-6 sm:h-full mt-1 sm:mt-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Hapus item"
                          className="absolute top-4 right-4 sm:static p-1 transition-colors
                                     text-neutral-400 dark:text-neutral-500
                                     hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Trash size={15}/>
                        </button>

                        {/* Qty Controls */}
                        <div className="flex items-center rounded-full overflow-hidden mt-auto
                                        border border-neutral-200 dark:border-neutral-700
                                        bg-white dark:bg-neutral-900">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer
                                       text-neutral-600 dark:text-neutral-400
                                       hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >−</button>
                          <span className="w-10 text-center text-sm font-semibold
                                           text-neutral-900 dark:text-neutral-100">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center transition-colors cursor-pointer
                                       text-neutral-600 dark:text-neutral-400
                                       hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Summary ── */}
            <div className="flex-shrink-0">
              <div className="rounded-2xl border p-6 sticky top-[128px]
                              bg-white dark:bg-neutral-950
                              border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-bold mb-6
                               text-neutral-900 dark:text-neutral-100">
                  Orders Summary
                </h2>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm
                                   text-neutral-600 dark:text-neutral-400">
                    Total Price ({selectedItems.reduce((acc, i) => acc + i.quantity, 0)} items)
                  </span>
                  <span className="text-sm font-medium
                                   text-neutral-900 dark:text-neutral-100">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-6 pb-6 border-b
                                border-neutral-100 dark:border-neutral-800">
                  <span className="text-sm
                                   text-neutral-600 dark:text-neutral-400">
                    Discount
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    - Rp 0
                  </span>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <span className="text-base font-bold
                                   text-neutral-900 dark:text-neutral-100">
                    Total Harga
                  </span>
                  <span className="text-xl font-extrabold
                                   text-neutral-900 dark:text-neutral-100">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={selected.size === 0}
                  className={`flex items-center justify-center w-full h-12 rounded-full font-semibold text-sm transition-all duration-200 ${
                    selected.size > 0
                      ? "bg-[#0022FF] dark:bg-[#4d6bff] text-white hover:bg-[#0017AA] dark:hover:bg-[#3a56ee] shadow-md hover:shadow-lg cursor-pointer"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
                  }`}
                >
                  Beli ({selected.size})
                </button>
              </div>
            </div>
          </div>

          {/* ── You May Also Like ── */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-[family-name:var(--font-display)]
                             text-neutral-900 dark:text-neutral-100">
                More just for you
              </h2>
              <Link
                href="/products"
                className="text-sm font-semibold underline-offset-2 hover:underline
                           text-[#0022FF] dark:text-[#4d6bff]"
              >
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
