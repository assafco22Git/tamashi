import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BouquetUploadForm from "./BouquetUploadForm";
import BouquetEditor from "./BouquetEditor";

export const dynamic = "force-dynamic";

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function SellerBouquetsPage() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const bouquets = await prisma.bouquet.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold">Tamashi</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller" className="hover:text-[#F4B19B] transition-colors">דאשבוארד</Link>
          <Link href="/seller/orders" className="hover:text-[#F4B19B] transition-colors">הזמנות</Link>
          <Link href="/seller/bouquets" className="text-[#F4B19B]">זרים</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-[#5C3D2E] mb-8">ניהול זרים</h1>

        {/* Add bouquet */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">הוספת זר חדש</h2>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F4B19B]/20">
            <BouquetUploadForm />
          </div>
        </section>

        {/* Bouquet list */}
        <section>
          <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">הקטלוג ({bouquets.length})</h2>
          <div className="flex flex-col gap-4">
            {bouquets.length === 0 ? (
              <p className="text-[#5C3D2E]/40 text-center py-8">טרם נוספו זרים.</p>
            ) : (
              bouquets.map(b => <BouquetEditor key={b.id} bouquet={b} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
