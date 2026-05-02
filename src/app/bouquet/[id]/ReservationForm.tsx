"use client";

import { useState } from "react";

interface Props {
  bouquetId: string;
  bouquetName: string;
}

export default function ReservationForm({ bouquetId, bouquetName }: Props) {
  const [form, setForm] = useState({ customerName: "", customerPhone: "", customerEmail: "", pickupDate: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, bouquetId }) });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">🌸</div>
        <h3 className="font-serif text-xl text-[#5C3D2E] mb-2">ההזמנה התקבלה!</h3>
        <p className="text-[#5C3D2E]/60">ניצור איתך קשר לאישור ההזמנה של <strong>{bouquetName}</strong>.</p>
      </div>
    );
  }

  const field = "w-full px-4 py-3 rounded-xl border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] focus:outline-none focus:border-[#F4B19B]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">שם מלא *</label>
        <input required type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} className={field} placeholder="השם שלך" />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">טלפון *</label>
        <input required type="tel" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} className={field} placeholder="05X-XXXXXXX" />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">אימייל (אופציונלי)</label>
        <input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} className={field} placeholder="your@email.com" />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">תאריך איסוף מועדף</label>
        <input type="date" value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })} className={field} />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">הערות (אופציונלי)</label>
        <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className={`${field} resize-none`} placeholder="בקשות מיוחדות..." />
      </div>
      {status === "error" && <p className="text-red-500 text-sm text-center">משהו השתבש. נסה שוב.</p>}
      <button type="submit" disabled={status === "loading"} className="w-full py-4 bg-[#5C3D2E] text-white rounded-full font-medium text-lg hover:bg-[#4a3124] transition-colors disabled:opacity-60">
        {status === "loading" ? "שולח..." : "הזמן זר"}
      </button>
    </form>
  );
}
