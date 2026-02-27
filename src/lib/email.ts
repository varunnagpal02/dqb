import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }
  return new Resend(apiKey);
}

interface OrderEmailData {
  to: string;
  orderNumber: number;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  customerName: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const itemRows = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.totalPrice.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f9fafb; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); padding: 24px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 4px 0 0; opacity: 0.9; }
        .content { padding: 24px; }
        .order-number { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
        .order-number h2 { margin: 0; color: #ea580c; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th { padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb; font-size: 14px; color: #6b7280; }
        .totals { background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 16px; }
        .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: #ea580c; border-top: 2px solid #e5e7eb; padding-top: 8px; margin-top: 8px; }
        .address { background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 16px; }
        .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍛 Desi Quick Bite</h1>
          <p>Order Confirmation</p>
        </div>
        <div class="content">
          <p>Hi ${data.customerName},</p>
          <p>Thank you for your order! We've received it and are getting it ready for you.</p>
          
          <div class="order-number">
            <h2>Order #${data.orderNumber}</h2>
            <p style="margin: 4px 0 0; color: #6b7280; font-size: 14px;">${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>$${data.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Tax</span>
              <span>$${data.tax.toFixed(2)}</span>
            </div>
            <div class="total-row total-final">
              <span>Total</span>
              <span>$${data.total.toFixed(2)}</span>
            </div>
          </div>

          <div class="address">
            <p style="margin: 0; font-weight: 600; font-size: 14px;">📍 Delivery Address</p>
            <p style="margin: 4px 0 0; color: #6b7280;">${data.deliveryAddress}</p>
          </div>
        </div>
        <div class="footer">
          <p>Desi Quick Bite — Flavors that feel like home 🏠</p>
          <p>If you have questions about your order, reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const resend = getResendClient();
  const { data: emailData, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "Desi Quick Bite <onboarding@resend.dev>",
    to: [data.to],
    subject: `🍛 Order #${data.orderNumber} Confirmed — Desi Quick Bite`,
    html,
  });

  if (error) {
    console.error("Email send error:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return emailData;
}
