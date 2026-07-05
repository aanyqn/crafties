"use client";

import { createContext, useContext, useEffect, useReducer } from "react";
import { CartItem } from "@/types/cart";
import { cartReducer, CartAction } from "./cartReducer";

// ---------------------------------------------------------------------------
// Context value interface
// ---------------------------------------------------------------------------

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextValue | null>(null);

// ---------------------------------------------------------------------------
// localStorage initializer
// ---------------------------------------------------------------------------

function initCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("crafties_cart");
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// CartProvider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, [], initCart);

  // Sync cart state to localStorage on every change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("crafties_cart", JSON.stringify(items));
    } catch {
      // suppress quota/unavailable errors
    }
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (item: Omit<CartItem, "id">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeFromCart = (cartItemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { cartItemId } });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ items, totalItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// useCart hook
// ---------------------------------------------------------------------------

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
