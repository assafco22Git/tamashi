"use client";

import { useState } from "react";

const SIZES = ["Small", "Medium", "Large", "Extra Large"];

interface Flower {
  id: string;
  name: string;
}

export default function SpecialOrderForm({ flowers }: { flowers: Flower[] }) {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    size: "",
    budget: "",
    notes: "",
    selectedFlowers: [] as string[],
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function toggleFlower(id: string) {
    setForm((prev) => ({
      ...prev,
      selectedFlowers: prev.selectedFlowers.includes(id)
        ? prev.selectedFlowers.filter((f) => f !== id)
        : [...prev.selectedFlowers, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/special-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail,
          size: form.size,
          budget: form.budget ? parseFloat(form.budget) : null,
          notes: form.notes,
          flowerIds: form.selectedFlowers,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">🌺</div>
        <h3 className="font-serif text-xl text-[#5C3D2E] mb-2">Request Sent!</h3>
        <p className="text-[#5C3D2E]/60">
          We&apos;ll be in touch to discuss your custom bouquet.
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

      {/* Size selector */}
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-2">Bouquet Size *</label>
        <div className="grid grid-cols-2 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setForm({ ...form, size })}
              className={`py-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                form.size === size
                  ? "border-[#5C3D2E] bg-[#5C3D2E] text-white"
                  : "border-[#F4B19B]/50 text-[#5C3D2E] hover:border-[#F4B19B]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Flower selection */}
      {flowers.length > 0 && (
        <div>
          <label className="block text-sm text-[#5C3D2E]/70 mb-2">
            Flowers (select all you like)
          </label>
          <div className="flex flex-wrap gap-2">
            {flowers.map((flower) => (
              <button
                key={flower.id}
                type="button"
                onClick={() => toggleFlower(flower.id)}
                className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${
                  form.selectedFlowers.includes(flower.id)
                    ? "border-[#F4B19B] bg-[#F4B19B] text-[#5C3D2E]"
                    : "border-[#F4B19B]/40 text-[#5C3D2E] hover:border-[#F4B19B]"
                }`}
              >
                {flower.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Budget */}
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Budget (₪, optional)</label>
        <input
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]"
          placeholder="e.g. 150"
          min={0}
        />
      </div>

      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">Additional Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B] resize-none"
          placeholder="Occasion, color preferences, any special requests..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !form.size || !form.customerName || !form.customerPhone}
        className="w-full py-4 bg-[#5C3D2E] text-white rounded-full font-medium text-lg hover:bg-[#4a3124] transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
