"use client";

import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { CartItem, MenuItem } from "@/types";
import { calculateTax } from "@/lib/utils";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  addItem: (menuItem: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateInstructions: (menuItemId: string, instructions: string) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { menuItemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { menuItemId: string; quantity: number } }
  | { type: "UPDATE_INSTRUCTIONS"; payload: { menuItemId: string; instructions: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.find(
        (item) => item.menu_item.id === action.payload.menuItem.id
      );
      if (existing) {
        return state.map((item) =>
          item.menu_item.id === action.payload.menuItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      }
      return [
        ...state,
        {
          menu_item: action.payload.menuItem,
          quantity: action.payload.quantity,
        },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.menu_item.id !== action.payload.menuItemId
      );
    case "UPDATE_QUANTITY":
      if (action.payload.quantity <= 0) {
        return state.filter(
          (item) => item.menu_item.id !== action.payload.menuItemId
        );
      }
      return state.map((item) =>
        item.menu_item.id === action.payload.menuItemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "UPDATE_INSTRUCTIONS":
      return state.map((item) =>
        item.menu_item.id === action.payload.menuItemId
          ? { ...item, special_instructions: action.payload.instructions }
          : item
      );
    case "CLEAR_CART":
      return [];
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dqb-cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "LOAD_CART", payload: parsed });
      }
    } catch {
      // Invalid JSON in localStorage, ignore
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("dqb-cart", JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.menu_item.price * item.quantity,
    0
  );
  const tax = calculateTax(subtotal);
  const total = Math.round((subtotal + tax) * 100) / 100;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (menuItem: MenuItem, quantity: number = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, quantity } });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { menuItemId } });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { menuItemId, quantity } });
  };

  const updateInstructions = (menuItemId: string, instructions: string) => {
    dispatch({
      type: "UPDATE_INSTRUCTIONS",
      payload: { menuItemId, instructions },
    });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        tax,
        total,
        addItem,
        removeItem,
        updateQuantity,
        updateInstructions,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
