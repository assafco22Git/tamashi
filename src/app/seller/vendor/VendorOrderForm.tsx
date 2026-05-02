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

  const field = "px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]";

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-3">
      <input
        required
        type="text"
        value={form.vendorName}
        onChange={(e) => setForm({ ...form, vendorName: e.target.value })}
        className={field}
        placeholder="שם הספק"
      />
      <input
        type="number"
        value={form.totalAmount}
        onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
        className={field}
        placeholder="סכום כולל (₪)"
        min={0}
      />
      <textarea
        required
        value={form.items}
        onChange={(e) => setForm({ ...form, items: e.target.value })}
        rows={3}
        className={`col-span-full ${field} resize-none`}
        placeholder="פריטים להזמנה (פרחים, כמויות וכו׳)"
      />
      <input
        type="date"
        value={form.expectedDate}
        onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
        className={field}
      />
      <input
        type="text"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        className={field}
        placeholder="הערות (אופציונלי)"
      />
      <div className="col-span-full flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-2.5 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "מוסיף..." : "הוסף הזמנה"}
        </button>
        {status === "success" && <span className="text-green-600 text-sm">✓ ההזמנה נוספה!</span>}
        {status === "error" && <span className="text-red-500 text-sm">שגיאה. נסה שוב.</span>}
      </div>
    </form>
  );
}
