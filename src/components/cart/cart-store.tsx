"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  lineId: string;
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  farmName: string;
};

type CartContextValue = {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  addItem: (item: CartItem) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
};

const CART_KEY = "bhavnagar_cart";

const CartContext = createContext<CartContextValue | null>(null);

function toKg(quantity: number, unit: string): number {
  if (unit.toLowerCase() === "g") {
    return quantity / 1000;
  }
  return quantity;
}

function buildLineId(item: Pick<CartItem, "id" | "unit">): string {
  return `${item.id}::${item.unit.toLowerCase()}`;
}

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<CartItem>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is CartItem => Boolean(item?.id && item?.name && typeof item?.quantity === "number"))
      .map((item) => {
        const unit = typeof item.unit === "string" ? item.unit : "kg";
        return {
          lineId: typeof item.lineId === "string" ? item.lineId : buildLineId({ id: item.id, unit }),
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit,
          pricePerUnit: typeof item.pricePerUnit === "number" ? item.pricePerUnit : 0,
          farmName: typeof item.farmName === "string" ? item.farmName : "",
        };
      });
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore failures (e.g. storage full, privacy mode)
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const lineId = item.lineId || buildLineId(item);
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + item.quantity } : i,
        );
      }
      return [...prev, { ...item, lineId }];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.lineId === lineId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0),
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + toKg(item.quantity, item.unit), 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, totalAmount, totalQuantity, addItem, removeItem, updateQuantity, clear }),
    [items, totalAmount, totalQuantity, addItem, removeItem, updateQuantity, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
