import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { DeliveryProvider } from "@/context/DeliveryContext";
import LayoutShell from "@/components/layout/LayoutShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Desi Quick Bite — AI-Powered Indian Food Ordering",
  description:
    "Order authentic Indian food with AI-powered recommendations. Find dishes by mood, diet, budget, or macros. Desi Quick Bite — flavors that feel like home.",
  keywords: [
    "Indian food",
    "food ordering",
    "AI chatbot",
    "desi food",
    "online ordering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-white min-h-screen flex flex-col`}>
        <CartProvider>
          <AuthProvider>
            <DeliveryProvider>
            <LayoutShell>{children}</LayoutShell>
            </DeliveryProvider>
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
