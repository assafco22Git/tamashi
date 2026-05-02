"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function handleSeed() {
    setStatus("loading");
    try {
      const res = await fetch("/api/seed-bouquets", { method: "POST" });
      const data = await res.json();
      setMsg(data.message ?? "");
      setStatus("done");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSeed}
        disabled={status === "loading" || status === "done"}
        className="px-5 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-full text-sm font-medium hover:bg-[#E8916F] hover:text-white transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "טוען..." : "הוסף זרים לדוגמה"}
      </button>
      {status === "done" && <span className="text-green-600 text-sm">✓ {msg}</span>}
      {status === "error" && <span className="text-red-500 text-sm">שגיאה</span>}
    </div>
  );
}
