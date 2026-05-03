"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toggle from "@/components/Toggle";

interface Bouquet {
  id: string; name: string; description: string;
  price: number; imageUrl: string; featured: boolean; available: boolean;
}

export default function BouquetEditor({ bouquet }: { bouquet: Bouquet }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: bouquet.name, description: bouquet.description,
    price: String(bouquet.price), imageUrl: bouquet.imageUrl,
    featured: bouquet.featured, available: bouquet.available,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSave() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/bouquets/${bouquet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      router.refresh();
      setTimeout(() => { setStatus("idle"); setOpen(false); }, 1500);
    } catch { setStatus("error"); }
  }

  const field = "w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B] transition-colors";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#F4B19B]/20 overflow-hidden">
      {/* Header row — click to expand */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 hover:bg-[#FDF6F0]/60 transition-colors text-right"
      >
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <Image src={bouquet.imageUrl} alt={bouquet.name} fill className="object-cover" sizes="56px" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#5C3D2E] truncate">{bouquet.name}</p>
          <p className="text-sm text-[#5C3D2E]/60">₪{bouquet.price} · {bouquet.available ? "מוצג" : "מוסתר"}{bouquet.featured ? " · מומלץ" : ""}</p>
        </div>
        <span className={`text-[#5C3D2E]/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Expandable edit form */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 flex flex-col gap-3 border-t border-[#F4B19B]/20 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#5C3D2E]/60 mb-1">שם הזר</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-xs text-[#5C3D2E]/60 mb-1">מחיר (₪)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#5C3D2E]/60 mb-1">תיאור</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={`${field} resize-none`} />
          </div>
          <div>
            <label className="block text-xs text-[#5C3D2E]/60 mb-1">קישור תמונה</label>
            <input type="url" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className={field} />
          </div>
          <div className="flex gap-6">
            <Toggle checked={form.available} onChange={v => setForm({ ...form, available: v })} label="מוצג בחנות" />
            <Toggle checked={form.featured} onChange={v => setForm({ ...form, featured: v })} label="מומלץ בדף הבית" />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={handleSave} disabled={status === "loading"}
              className="px-5 py-2 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60">
              {status === "loading" ? "שומר..." : "שמור"}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              className="px-5 py-2 border border-[#F4B19B]/50 text-[#5C3D2E] rounded-full text-sm hover:bg-[#FAD9CC]/40 transition-colors">
              ביטול
            </button>
            {status === "success" && <span className="text-green-600 text-sm">✓ נשמר</span>}
            {status === "error" && <span className="text-red-500 text-sm">שגיאה</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
