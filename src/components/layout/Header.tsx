"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ShoppingCart, User, MapPin } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useDelivery } from "@/context/DeliveryContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { delivery } = useDelivery();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    { href: "/meal-plans", label: "Meal Plans" },
    { href: "/orders", label: "Orders" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍛</span>
            <span className="text-xl font-bold text-gray-900">
              Desi <span className="text-orange-500">Quick Bite</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-orange-500 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Delivery address badge */}
            {delivery.hasEnteredAddress && (
              <Link
                href="/"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-orange-500 hover:bg-gray-100 transition-colors max-w-[200px] border border-gray-200"
                title="Change delivery address"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{delivery.address || delivery.city}</span>
                {delivery.isServiceable ? (
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                )}
              </Link>
            )}
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Admin link (desktop only) */}
            <Link
              href="/admin"
              className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Admin Panel"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
