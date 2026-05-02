"use client";

import { useState } from "react";

interface Props {
  bouquetId: string;
  bouquetName: string;
}

export default function ReservationForm({ bouquetId, bouquetName }: Props) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupDate: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, bouquetId }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🌸</div>
        <h3 className="font-serif text-xl text-[#5C3D2E] mb-2">Reservation Received!</h3>
        <p className="text-[#5C3D2E]/60">
          We will contact you to confirm your pickup for <strong>{bouquetName}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Full Name *</label>
        <input
          required
          type="text"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Phone *</label>
        <input
          required
          type="tel"
          value={form.customerPhone}
          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]"
          placeholder="05X-XXXXXXX"
        />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Email (optional)</label>
        <input
          type="email"
          value={form.customerEmail}
          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Preferred Pickup Date</label>
        <input
          type="date"
          value={form.pickupDate}
          onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]"
        />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Notes (optional)</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B] resize-none"
          placeholder="Any special requests..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">
          Something went wrong. Please try again.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 bg-[#5C3D2E] text-white rounded-full font-medium text-lg hover:bg-[#4a3124] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Reserve Bouquet"}
      </button>
    </form>
  );
}
