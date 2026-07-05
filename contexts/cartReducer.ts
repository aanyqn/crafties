import { CartItem, variantKey } from "@/types/cart";

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "REMOVE_ITEM"; payload: { cartItemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { cartItemId: string; quantity: number } }
  | { type: "CLEAR_CART" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return Date.now().toString();
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const incoming = action.payload;
      const incomingKey = variantKey(incoming.selectedVariants);

      // Find an existing line with the same product + variant combination
      const existingIndex = state.findIndex(
        (item) =>
          item.productId === incoming.productId &&
          variantKey(item.selectedVariants) === incomingKey
      );

      if (existingIndex !== -1) {
        // Duplicate: increment quantity in place, return new array
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + incoming.quantity }
            : item
        );
      }

      // New item: append with a generated id
      return [...state, { ...incoming, id: generateId() }];
    }

    case "REMOVE_ITEM": {
      return state.filter(
        (item) => item.id !== action.payload.cartItemId
      );
    }

    case "UPDATE_QUANTITY": {
      const { cartItemId, quantity } = action.payload;

      // quantity < 1 → treat as removal (Requirement 2.5)
      if (quantity < 1) {
        return state.filter((item) => item.id !== cartItemId);
      }

      return state.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
    }

    case "CLEAR_CART": {
      return [];
    }

    default: {
      return state;
    }
  }
}
