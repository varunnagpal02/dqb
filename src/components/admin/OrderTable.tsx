"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate, getStatusColor } from "@/lib/utils";

interface OrderItem {
  item_name: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  status: string;
  subtotal_amount: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

interface OrderTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  isUpdating: string | null;
}

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

export function OrderTable({
  orders,
  onUpdateStatus,
  isUpdating,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <span className="text-4xl">📦</span>
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          No orders found
        </h3>
        <p className="text-gray-500 mt-1">
          Orders will appear here once customers start ordering.
        </p>
      </div>
    );
  }

  return (
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
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <Badge variant={statusVariant}>
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Customer
                </h4>
                <p className="text-sm font-medium text-gray-900">
                  {order.customer_name}
                </p>
                <p className="text-sm text-gray-500">{order.customer_email}</p>
                <p className="text-sm text-gray-500">{order.customer_phone}</p>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {order.delivery_address}
                </p>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Items
                </h4>
                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-sm flex justify-between"
                    >
                      <span className="text-gray-700">
                        {item.item_name} × {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-2 pt-2 text-sm font-bold flex justify-between">
                  <span>Total</span>
                  <span className="text-orange-600">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Update Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={
                        order.status === status ? "primary" : "outline"
                      }
                      onClick={() => onUpdateStatus(order.id, status)}
                      isLoading={isUpdating === order.id}
                      disabled={order.status === status}
                      className="text-xs"
                    >
                      {status.replace(/_/g, " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
