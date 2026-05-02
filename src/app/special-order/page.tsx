import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";
import SpecialOrderForm from "./SpecialOrderForm";

export default async function SpecialOrderPage() {
  const flowers = await prisma.flower.findMany({ where: { available: true }, orderBy: { name: "asc" } });

  return (
    <div className="min-h-screen page-enter">
      <Navigation />
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-[#5C3D2E] mb-2">הזמנה מיוחדת</h1>
          <p className="text-[#5C3D2E]/60">לא מצאתם מה שחיפשתם? ניצור עבורכם זר מותאם אישית.</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/30">
          <SpecialOrderForm flowers={flowers.map(f => ({ id: f.id, name: f.name }))} />
        </div>
      </div>
      <footer className="text-center py-6 text-[#5C3D2E]/40 text-sm">
        © {new Date().getFullYear()} Tamashi · כל הזכויות שמורות
      </footer>
    </div>
  );
}
