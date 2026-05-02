"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BouquetUploadForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    featured: false,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/bouquets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", description: "", price: "", imageUrl: "", featured: false });
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  const field = "w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        required
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={field}
        placeholder="שם הזר"
      />
      <textarea
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className={`${field} resize-none`}
        placeholder="תיאור"
      />
      <input
        required
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className={field}
        placeholder="מחיר (₪)"
        min={0}
      />
      <input
        required
        type="url"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className={field}
        placeholder="קישור תמונה"
      />
      <label className="flex items-center gap-2 text-sm text-[#5C3D2E]/70 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="accent-[#F4B19B]"
        />
        מוצג בדף הבית
      </label>

      {status === "success" && <p className="text-green-600 text-sm text-center">✓ הזר נוסף!</p>}
      {status === "error" && <p className="text-red-500 text-sm text-center">שגיאה בהוספת הזר.</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "מוסיף..." : "הוסף זר"}
      </button>
    </form>
  );
}
