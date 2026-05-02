import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";
import ReservationForm from "./ReservationForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BouquetPage({ params }: Props) {
  const { id } = await params;
  const bouquet = await prisma.bouquet.findUnique({ where: { id } });
  if (!bouquet) notFound();

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link href="/catalog" className="text-[#5C3D2E]/60 hover:text-[#5C3D2E] text-sm mb-6 inline-block">
          ← Back to catalog
        </Link>

        <div className="relative aspect-square w-full overflow-hidden rounded-3xl mb-6 shadow-md">
          <Image
            src={bouquet.imageUrl}
            alt={bouquet.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="font-serif text-4xl text-[#5C3D2E] mb-2">{bouquet.name}</h1>
        <p className="text-2xl text-[#E8916F] font-medium mb-4">₪{bouquet.price}</p>
        <p className="text-[#5C3D2E]/70 leading-relaxed mb-8">{bouquet.description}</p>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/30">
          <h2 className="font-serif text-2xl text-[#5C3D2E] mb-4">Reserve for Pickup</h2>
          <ReservationForm bouquetId={bouquet.id} bouquetName={bouquet.name} />
        </div>
      </div>

      <footer className="text-center py-6 text-[#5C3D2E]/40 text-sm">
        © {new Date().getFullYear()} Tamashi · All rights reserved
      </footer>
    </div>
  );
}
