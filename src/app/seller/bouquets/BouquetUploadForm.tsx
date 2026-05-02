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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        required
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Bouquet name"
      />
      <textarea
        required
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        className="w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B] resize-none"
        placeholder="Description"
      />
      <input
        required
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Price (₪)"
        min={0}
      />
      <input
        required
        type="url"
        value={form.imageUrl}
        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        className="w-full px-3 py-2 rounded-lg border border-[#F4B19B]/50 bg-[#FDF6F0] text-[#5C3D2E] text-sm focus:outline-none focus:border-[#F4B19B]"
        placeholder="Image URL (paste from Cloudinary, etc.)"
      />
      <label className="flex items-center gap-2 text-sm text-[#5C3D2E]/70 cursor-pointer">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          className="accent-[#F4B19B]"
        />
        Featured on homepage
      </label>

      {status === "success" && (
        <p className="text-green-600 text-sm text-center">Bouquet added!</p>
      )}
      {status === "error" && (
        <p className="text-red-500 text-sm text-center">Failed to add bouquet.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-2.5 bg-[#5C3D2E] text-white rounded-full text-sm font-medium hover:bg-[#4a3124] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Adding..." : "Add Bouquet"}
      </button>
    </form>
  );
}
