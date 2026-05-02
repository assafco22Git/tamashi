import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StoreSettingsForm from "./StoreSettingsForm";
import BouquetEditor from "./BouquetEditor";
import SeedButton from "./SeedButton";

export const dynamic = "force-dynamic";

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function ManagerPage() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const [settings, bouquets] = await Promise.all([
    prisma.storeSetting.findMany(),
    prisma.bouquet.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  const s = Object.fromEntries(settings.map(r => [r.key, r.value]));

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="font-serif text-lg">Tamashi — מנהל</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller" className="hover:text-[#F4B19B] transition-colors">לוח בקרה</Link>
          <Link href="/seller/bouquets" className="hover:text-[#F4B19B] transition-colors">זרים</Link>
          <Link href="/seller/vendor" className="hover:text-[#F4B19B] transition-colors">ספקים</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl text-[#5C3D2E] mb-8">ניהול תוכן</h1>

        {/* Store Settings */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#5C3D2E] mb-4">הגדרות חנות</h2>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/20">
            <StoreSettingsForm
              tagline={s.tagline ?? "זרים עבודת יד, עשויים באהבה בתל אביב"}
              address={s.address ?? "תל אביב"}
              hoursWeekday={s.hours_weekday ?? "א׳–ה׳, 9:00–19:00"}
              hoursFriday={s.hours_friday ?? "ו׳ 9:00–14:00"}
            />
          </div>
        </section>

        {/* Bouquet Editor */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl text-[#5C3D2E]">עריכת זרים</h2>
            {bouquets.length === 0 && <SeedButton />}
          </div>
          <div className="flex flex-col gap-4">
            {bouquets.length === 0 ? (
              <p className="text-[#5C3D2E]/40 text-center py-8">אין זרים עדיין. לחצו על הכפתור להוספת זרים לדוגמה.</p>
            ) : (
              bouquets.map(b => <BouquetEditor key={b.id} bouquet={b} />)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
