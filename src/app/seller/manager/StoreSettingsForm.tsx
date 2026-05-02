"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tagline: string;
  address: string;
  hoursWeekday: string;
  hoursFriday: string;
}

export default function StoreSettingsForm({ tagline, address, hoursWeekday, hoursFriday }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({ tagline, address, hours_weekday: hoursWeekday, hours_friday: hoursFriday });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/store-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2500);
    } catch { setStatus("error"); }
  }

  const field = "w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B] transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">סלוגן (טקסט תחת הלוגו)</label>
        <input type="text" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className={field} />
      </div>
      <div>
        <label className="block text-sm text-[#5C3D2E]/70 mb-1">כתובת</label>
        <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={field} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-[#5C3D2E]/70 mb-1">שעות א׳–ה׳</label>
          <input type="text" value={form.hours_weekday} onChange={e => setForm({ ...form, hours_weekday: e.target.value })} className={field} />
        </div>
        <div>
          <label className="block text-sm text-[#5C3D2E]/70 mb-1">שעות ו׳</label>
          <input type="text" value={form.hours_friday} onChange={e => setForm({ ...form, hours_friday: e.target.value })} className={field} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "loading"}
          className="px-6 py-2.5 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60">
          {status === "loading" ? "שומר..." : "שמור שינויים"}
        </button>
        {status === "success" && <span className="text-green-600 text-sm">✓ נשמר בהצלחה</span>}
        {status === "error" && <span className="text-red-500 text-sm">שגיאה. נסה שוב.</span>}
      </div>
    </form>
  );
}
