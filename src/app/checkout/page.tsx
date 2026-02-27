"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/context/AuthContext";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatPrice, calculateTax } from "@/lib/utils";

// Available promo codes
const PROMO_CODES: Record<string, { discount: number; type: "percent" | "flat"; label: string; minOrder?: number }> = {
  WELCOME10: { discount: 10, type: "percent", label: "10% off your order" },
  FIRST20: { discount: 20, type: "percent", label: "20% off first order", minOrder: 25 },
  CLEAN5: { discount: 5, type: "flat", label: "$5 off (clean eating reward)" },
  ORGANIC15: { discount: 15, type: "percent", label: "15% off organic special", minOrder: 30 },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    instructions: "",
    subscribeEmail: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Calculate discount and adjusted totals
  const { discount, adjustedSubtotal, adjustedTax, adjustedTotal } = useMemo(() => {
    let discountAmount = 0;
    if (appliedPromo && PROMO_CODES[appliedPromo]) {
      const promo = PROMO_CODES[appliedPromo];
      if (promo.type === "percent") {
        discountAmount = Math.round(subtotal * (promo.discount / 100) * 100) / 100;
      } else {
        discountAmount = Math.min(promo.discount, subtotal);
      }
    }
    const adjSub = Math.round((subtotal - discountAmount) * 100) / 100;
    const adjTax = calculateTax(adjSub);
    const adjTotal = Math.round((adjSub + adjTax) * 100) / 100;
    return { discount: discountAmount, adjustedSubtotal: adjSub, adjustedTax: adjTax, adjustedTotal: adjTotal };
  }, [appliedPromo, subtotal]);

  const handleApplyPromo = () => {
    setPromoError("");
    setPromoSuccess("");
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a promo code.");
      return;
    }
    const promo = PROMO_CODES[code];
    if (!promo) {
      setPromoError("Invalid promo code. Please try another.");
      return;
    }
    if (promo.minOrder && subtotal < promo.minOrder) {
      setPromoError(`Minimum order of ${formatPrice(promo.minOrder)} required for this code.`);
      return;
    }
    setAppliedPromo(code);
    setPromoSuccess(`✅ "${code}" applied — ${promo.label}`);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
    setPromoSuccess("");
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: `${formData.address}, ${formData.city} ${formData.zipCode}`,
        special_instructions: formData.instructions,
        subscribe_email: formData.subscribeEmail,
        promo_code: appliedPromo || null,
        discount: discount,
        items: items.map((item) => ({
          menu_item_id: item.menu_item.id,
          name: item.menu_item.name,
          quantity: item.quantity,
          unit_price: item.menu_item.price,
          special_instructions: item.special_instructions,
        })),
        subtotal: adjustedSubtotal,
        tax: adjustedTax,
        total: adjustedTotal,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order");
      }

      const { order } = await res.json();
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Details
            </h2>
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
              <Input
                label="Phone *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Address
            </h2>
            <Input
              label="Street Address *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
              />
              <Input
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Special Instructions
            </h2>
            <Textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Any special requests? Allergies? Delivery notes?"
              rows={3}
            />
          </div>

          {/* Promo Code */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              🎟️ Promo Code
            </h2>
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <div>
                  <p className="text-green-800 font-medium text-sm">{promoSuccess}</p>
                  <p className="text-green-600 text-xs mt-1">You save {formatPrice(discount)}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemovePromo}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoError(""); }}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent uppercase tracking-wider"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyPromo(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-600 text-xs">{promoError}</p>}
                <div className="text-xs text-gray-400">
                  Try: <button type="button" onClick={() => setPromoCode("WELCOME10")} className="text-orange-500 hover:underline">WELCOME10</button>,{" "}
                  <button type="button" onClick={() => setPromoCode("CLEAN5")} className="text-orange-500 hover:underline">CLEAN5</button>,{" "}
                  <button type="button" onClick={() => setPromoCode("ORGANIC15")} className="text-orange-500 hover:underline">ORGANIC15</button>
                </div>
              </>
            )}
          </div>

          {/* Email Signup */}
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="subscribeEmail"
                checked={formData.subscribeEmail}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
              />
              <div>
                <span className="font-medium text-gray-900">
                  📧 Sign me up for deals & updates
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Get exclusive offers, new menu alerts, and AI food
                  recommendations delivered to your inbox.
                </p>
              </div>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting}
          >
            Place Order — {formatPrice(adjustedTotal)}
          </Button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.menu_item.id}
                  className="flex justify-between pt-3 first:pt-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.menu_item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.menu_item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Discount ({appliedPromo})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8.5%)</span>
                <span>{formatPrice(adjustedTax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(adjustedTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
