import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendOrderConfirmationEmail } from "@/lib/email";

// POST - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      special_instructions,
      subscribe_email,
      items,
      subtotal,
      tax,
      total,
    } = body;

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !delivery_address) {
      return NextResponse.json(
        { error: "Name, email, phone, and address are required" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "At least one item is required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Get current user (optional - guests can order too)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        special_instructions: special_instructions || null,
        subtotal_amount: subtotal,
        tax_amount: tax,
        total_amount: total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(
      (item: {
        menu_item_id: string;
        name: string;
        quantity: number;
        unit_price: number;
        special_instructions?: string;
      }) => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        item_name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.unit_price * item.quantity,
        special_instructions: item.special_instructions || null,
      })
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items error:", itemsError);
      // Order was created, but items failed - still return order
    }

    // Send confirmation email (non-blocking)
    sendOrderConfirmationEmail({
      to: customer_email,
      orderNumber: Date.now(), // Use timestamp as order number
      customerName: customer_name,
      deliveryAddress: delivery_address,
      items: items.map(
        (item: { name: string; quantity: number; unit_price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.unit_price * item.quantity,
        })
      ),
      subtotal,
      tax,
      total,
    }).catch((err) => {
      console.error("Email send error:", err);
    });

    // Handle email subscription (non-blocking)
    if (subscribe_email && customer_email) {
      // Could store in a subscribers table or send to email marketing service
      console.log(`Email subscription: ${customer_email}`);
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Fetch orders for authenticated user
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        items:order_items(*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
