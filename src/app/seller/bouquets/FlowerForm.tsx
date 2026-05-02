"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FlowerForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/flowers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      router.refresh();
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        required
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Flower name (e.g. Rose)"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-lg text-sm font-medium hover:bg-[#E8916F] hover:text-white transition-colors disabled:opacity-60"
      >
        {status === "success" ? "Added!" : "Add"}
      </button>
    </form>
  );
}
