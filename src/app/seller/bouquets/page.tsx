import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BouquetUploadForm from "./BouquetUploadForm";
import FlowerForm from "./FlowerForm";

export const dynamic = "force-dynamic";

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function SellerBouquetsPage() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const [bouquets, flowers] = await Promise.all([
    prisma.bouquet.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.flower.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold">Tamashi — זרים</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller" className="hover:text-[#F4B19B] transition-colors">דאשבוארד</Link>
          <Link href="/seller/vendor" className="hover:text-[#F4B19B] transition-colors">ספקים</Link>
          <Link href="/seller/manager" className="hover:text-[#F4B19B] transition-colors">מנהל</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-[#5C3D2E] mb-8">ניהול זרים</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">הוספת זר חדש</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F4B19B]/20">
              <BouquetUploadForm />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">ניהול פרחים</h2>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F4B19B]/20 mb-4">
              <FlowerForm />
            </div>
            <div className="flex flex-wrap gap-2">
              {flowers.map((f) => (
                <span
                  key={f.id}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    f.available
                      ? "border-[#F4B19B] text-[#5C3D2E] bg-[#FAD9CC]/40"
                      : "border-gray-200 text-gray-400 line-through"
                  }`}
                >
                  {f.name}
                </span>
              ))}
              {flowers.length === 0 && (
                <p className="text-[#5C3D2E]/40 text-sm">טרם נוספו פרחים.</p>
              )}
            </div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-[#5C3D2E] mb-4">כל הזרים ({bouquets.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bouquets.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F4B19B]/20">
                <div className="relative aspect-square">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                  {!b.available && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">מוסתר</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-[#5C3D2E] truncate">{b.name}</p>
                  <p className="text-sm text-[#5C3D2E]/60">₪{b.price}</p>
                  <div className="flex gap-2 mt-2">
                    <form action={`/api/bouquets/${b.id}/toggle`} method="POST" className="flex-1">
                      <button className="w-full text-xs py-1.5 rounded-full border border-[#F4B19B]/50 text-[#5C3D2E] hover:bg-[#F4B19B]/20 transition-colors">
                        {b.available ? "הסתר" : "הצג"}
                      </button>
                    </form>
                    <form action={`/api/bouquets/${b.id}/delete`} method="POST" className="flex-1">
                      <button className="w-full text-xs py-1.5 rounded-full border border-red-200 text-red-400 hover:bg-red-50 transition-colors">
                        מחק
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
