import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";
import SpecialOrderForm from "./SpecialOrderForm";

export default async function SpecialOrderPage() {
  const flowers = await prisma.flower.findMany({
    where: { available: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#5C3D2E] mb-2">Special Order</h1>
          <p className="text-[#5C3D2E]/60">
            Can&apos;t find what you&apos;re looking for? Let us create something just for you.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/30">
          <SpecialOrderForm flowers={flowers.map((f) => ({ id: f.id, name: f.name }))} />
        </div>
      </div>

      <footer className="text-center py-6 text-[#5C3D2E]/40 text-sm">
        © {new Date().getFullYear()} Tamashi · All rights reserved
      </footer>
    </div>
  );
}
