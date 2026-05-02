"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VendorOrderForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    vendorName: "",
    items: "",
    totalAmount: "",
    expectedDate: "",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/vendor-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          totalAmount: form.totalAmount ? parseFloat(form.totalAmount) : null,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ vendorName: "", items: "", totalAmount: "", expectedDate: "", notes: "" });
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
      <input
        required
        type="text"
        value={form.vendorName}
        onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
        className="px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Vendor name"
      />
      <input
        type="number"
        value={form.totalAmount}
        onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
        className="px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Total amount (₪)"
        min={0}
      />
      <textarea
        required
        value={form.items}
        onChange={(e) => setForm({ ...form, items: e.target.value })}
        rows={3}
        className="col-span-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B] resize-none"
        placeholder="Items ordered (flowers, quantities, etc.)"
      />
      <input
        type="date"
        value={form.expectedDate}
        onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
        className="px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Expected delivery date"
      />
      <input
        type="text"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className="px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Notes (optional)"
      />
      <div className="col-span-full flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2.5 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Adding..." : "Add Order"}
        </button>
        {status === "success" && <span className="text-green-600 text-sm">Order added!</span>}
        {status === "error" && <span className="text-red-500 text-sm">Failed. Try again.</span>}
      </div>
    </form>
  );
}
