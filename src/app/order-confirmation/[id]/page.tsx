import Link from "next/link";

interface OrderConfirmationPageProps {
  params: { id: string };
}

export default function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      {/* Success Animation */}
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">✅</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
      <p className="mt-3 text-gray-500 text-lg">
        Thank you for your order! We&apos;re preparing your delicious food.
      </p>

      {/* Order ID */}
      <div className="mt-8 bg-orange-50 border border-orange-100 rounded-xl p-6">
        <p className="text-sm text-gray-500">Order ID</p>
        <p className="text-xl font-mono font-bold text-orange-600 mt-1">
          {params.id}
        </p>
      </div>

      {/* Timeline */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          What happens next?
        </h2>
        <div className="space-y-4 text-left">
          {[
            {
              step: "1",
              title: "Order Received",
              desc: "We've got your order and are reviewing it",
              done: true,
            },
            {
              step: "2",
              title: "Preparing",
              desc: "Our chefs will start cooking your food",
              done: false,
            },
            {
              step: "3",
              title: "Out for Delivery",
              desc: "Your food is on its way to you",
              done: false,
            },
            {
              step: "4",
              title: "Delivered",
              desc: "Enjoy your meal! 🎉",
              done: false,
            },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.done
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {item.done ? "✓" : item.step}
              </div>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          📧 A confirmation email has been sent with your order details.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/orders"
          className="inline-flex items-center justify-center bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          View My Orders
        </Link>
        <Link
          href="/menu"
          className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Order More
        </Link>
      </div>
    </div>
  );
}
