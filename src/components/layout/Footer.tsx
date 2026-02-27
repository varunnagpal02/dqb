import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍛</span>
              <span className="text-xl font-bold text-white">
                Desi Quick Bite
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic Indian flavors made with clean, organic ingredients — no seed oils,
              no preservatives. Powered by AI to find your perfect dish.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🌱 Organic</span>
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">🚫 No Seed Oils</span>
              <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded-full">💚 Clean Labels</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/menu", label: "Full Menu" },
                { href: "/cart", label: "Your Cart" },
                { href: "/orders", label: "Order History" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 orders@desiquickbite.com</li>
              <li>📞 (555) 123-4567</li>
              <li>📍 123 Spice Lane, Flavor Town</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Desi Quick Bite. All rights reserved.
            Crafted with ❤️ and lots of spice.
          </p>
        </div>
      </div>
    </footer>
  );
}
