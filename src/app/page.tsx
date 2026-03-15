"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDelivery } from "@/context/DeliveryContext";
import { useAuth } from "@/context/AuthContext";
import {
  checkServiceability,
  filterSuggestions,
  parseAddressForServiceability,
  type AreaSuggestion,
} from "@/data/serviceable-areas";
import {
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Leaf,
  ShieldCheck,
  ChefHat,
  X,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { setAddress, setServiceability, setTiming, setEntered } = useDelivery();
  const { user, signIn, signUp } = useAuth();

  // Address
  const [addressInput, setAddressInput] = useState("");
  const [suggestions, setSuggestions] = useState<AreaSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedArea, setSelectedArea] = useState<AreaSuggestion | null>(null);

  // Timing
  const [orderTiming, setOrderTimingLocal] = useState<"now" | "scheduled">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "warning"; message: string } | null>(null);

  // Auth
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const addressRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        addressRef.current &&
        !addressRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleAddressChange(value: string) {
    setAddressInput(value);
    setSelectedArea(null);
    const matches = filterSuggestions(value);
    setSuggestions(matches);
    setShowSuggestions(matches.length > 0);
  }

  function handleSelectSuggestion(s: AreaSuggestion) {
    setAddressInput(s.label);
    setSelectedArea(s);
    setShowSuggestions(false);
  }

  // Time slots
  const timeSlots: string[] = [];
  for (let h = 10; h <= 21; h++) {
    for (const m of ["00", "30"]) {
      const hour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      timeSlots.push(`${hour}:${m} ${ampm}`);
    }
  }

  // Date options (next 7 days)
  const dateOptions: { label: string; value: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dateOptions.push({
      label:
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      value: d.toISOString().split("T")[0],
    });
  }

  const canProceed =
    addressInput.trim().length >= 3 &&
    (orderTiming === "now" || (scheduledDate && scheduledTime));

  function handleProceed() {
    if (!canProceed) return;

    let city = "";
    let zip = "";
    if (selectedArea) {
      city = selectedArea.city;
      zip = selectedArea.zip;
    } else {
      const parsed = parseAddressForServiceability(addressInput);
      city = parsed.city;
      zip = parsed.zip;
    }

    setAddress(addressInput.trim(), city, zip);
    const result = checkServiceability(zip, city);
    setServiceability(result.isServiceable);
    setTiming(orderTiming, scheduledDate, scheduledTime);
    setEntered(true);

    setToast({
      type: result.isServiceable ? "success" : "warning",
      message: result.isServiceable
        ? "Delivering to your area! 🎉"
        : "We're not in your area yet — browse our menu anyway!",
    });

    setTimeout(() => router.push("/menu"), 1200);
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (authMode === "signin") {
        const { error } = await signIn(email, password);
        if (error) setAuthError(error);
      } else {
        const { error } = await signUp(email, password, "");
        if (error) setAuthError(error);
      }
    } catch {
      setAuthError("Something went wrong.");
    }
    setAuthLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[120px]" />
        <div className="absolute -bottom-48 -left-48 w-[400px] h-[400px] bg-amber-100/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-50/50 rounded-full blur-[140px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-8 py-3.5 rounded-full shadow-2xl text-sm font-semibold animate-fade-up ${
            toast.type === "success"
              ? "bg-green-500 text-white"
              : "bg-amber-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">🍛</span>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Desi <span className="text-orange-500">Quick Bite</span>
          </span>
        </div>
        {user ? (
          <span className="text-sm text-gray-600">
            Hey, <span className="text-orange-500 font-medium">{user.email?.split("@")[0]}</span>
          </span>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium px-5 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Sign in
          </button>
        )}
      </header>

      {/* Hero section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-20">
        {/* Heading */}
        <div className="text-center mb-10 animate-fade-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-5 tracking-tight leading-[1.1]">
            Homemade Indian food,
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              delivered to your door.
            </span>
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
            Authentic flavors made with organic ingredients.
            <br className="hidden sm:block" />
            No seed oils. No preservatives.
          </p>
        </div>

        {/* Main card — glassmorphism */}
        <div className="w-full max-w-xl animate-fade-up-delay">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl">
            {/* Single address bar */}
            <div className="relative mb-5">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <input
                  ref={addressRef}
                  type="text"
                  placeholder="Enter your delivery address"
                  value={addressInput}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 focus:bg-white text-base transition-all"
                  autoComplete="off"
                />
                {addressInput && (
                  <button
                    onClick={() => {
                      setAddressInput("");
                      setSuggestions([]);
                      setSelectedArea(null);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-30"
                >
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-left transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{s.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Timing selector pills */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={() => setOrderTimingLocal("now")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  orderTiming === "now"
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Deliver Now
              </button>
              <button
                onClick={() => setOrderTimingLocal("scheduled")}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all ${
                  orderTiming === "scheduled"
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Schedule
              </button>
            </div>

            {/* Schedule date/time — visible only when scheduling */}
            {orderTiming === "scheduled" && (
              <div className="grid grid-cols-2 gap-3 mb-5">
                <select
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-sm [&>option]:bg-white [&>option]:text-gray-700"
                >
                  <option value="">Select date</option>
                  {dateOptions.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <select
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-sm [&>option]:bg-white [&>option]:text-gray-700"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleProceed}
              disabled={!canProceed}
              className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                canProceed
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-600/25"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Find Food Near You
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 animate-fade-up-delay-2">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>No Seed Oils</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Leaf className="w-3.5 h-3.5 text-green-500" />
              <span>Organic</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <ChefHat className="w-3.5 h-3.5 text-orange-500" />
              <span>Homemade</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth modal overlay */}
      {showAuth && !user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowAuth(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 border border-gray-200 shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-gray-900 text-xl font-bold mb-6 text-center">
              {authMode === "signin" ? "Welcome back" : "Create your account"}
            </h3>
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => setAuthMode("signin")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  authMode === "signin"
                    ? "bg-orange-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  authMode === "signup"
                    ? "bg-orange-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Create Account
              </button>
            </div>
            <form onSubmit={handleAuth} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              />
              {authError && (
                <p className="text-red-400 text-xs text-center">{authError}</p>
              )}
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-semibold text-sm disabled:opacity-50 transition-all"
              >
                {authLoading ? "..." : authMode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <button
              onClick={() => setShowAuth(false)}
              className="w-full text-center mt-4 text-gray-400 text-xs hover:text-gray-600 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
