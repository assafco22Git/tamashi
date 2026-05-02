import Navigation from "@/components/Navigation";
import BouquetCard from "@/components/BouquetCard";
import { prisma } from "@/lib/db";

export const revalidate = 60;

export default async function CatalogPage() {
  const bouquets = await prisma.bouquet.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-serif text-4xl text-[#5C3D2E] text-center mb-2">Our Catalog</h1>
        <p className="text-center text-[#5C3D2E]/60 mb-10">
          Handcrafted with seasonal flowers — ready for pickup
        </p>

        {bouquets.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#5C3D2E]/50 text-lg">
              No bouquets available right now. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bouquets.map((b) => (
              <BouquetCard
                key={b.id}
                id={b.id}
                name={b.name}
                price={b.price}
                imageUrl={b.imageUrl}
                description={b.description}
              />
            ))}
          </div>
        )}
      </div>

      <footer className="text-center py-6 text-[#5C3D2E]/40 text-sm">
        © {new Date().getFullYear()} Tamashi · All rights reserved
      </footer>
    </div>
  );
}
