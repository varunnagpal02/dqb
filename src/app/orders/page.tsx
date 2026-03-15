"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  delivery_address: string;
  items: {
    name: string;
    quantity: number;
    unit_price: number;
  }[];
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="text-6xl">🔒</span>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Sign in to view orders
        </h1>
        <p className="mt-2 text-gray-500">
          You need to be signed in to see your order history.
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-6xl">📦</span>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            No orders yet
          </h2>
          <p className="mt-2 text-gray-500">
            Your order history will appear here once you place your first order.
          </p>
          <Link
            href="/menu"
            className="mt-6 inline-flex items-center bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-500 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusVariant = getStatusColor(order.status) as
              | "default"
              | "success"
              | "warning"
              | "danger"
              | "info";
            return (
              <div
                key={order.id}
                className="glass-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <Badge variant={statusVariant}>
                    {order.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                <div className="divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2 text-sm"
                    >
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-orange-600">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
