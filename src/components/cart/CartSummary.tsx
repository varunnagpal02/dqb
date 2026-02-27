"use client";

import React from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CartSummary() {
  const { items, subtotal, tax, total } = useCart();

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (8.5%)</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
          <span>Total</span>
          <span className="text-orange-600">{formatPrice(total)}</span>
        </div>
      </div>

      <Link href="/checkout" className="block mt-6">
        <Button variant="primary" size="lg" className="w-full">
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/menu" className="block mt-3">
        <Button variant="ghost" size="md" className="w-full">
          Continue Browsing
        </Button>
      </Link>
    </div>
  );
}
