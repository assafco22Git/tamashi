import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

function SellerNav({ active }: { active: string }) {
  const links = [
    { href: "/seller", label: "דאשבוארד" },
    { href: "/seller/orders", label: "הזמנות" },
    { href: "/seller/bouquets", label: "זרים" },
  ];
  return (
    <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
        <span className="text-lg font-semibold">Tamashi</span>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`transition-colors ${active === l.href ? "text-[#F4B19B]" : "hover:text-[#F4B19B]"}`}>
            {l.label}
          </Link>
        ))}
        <form action="/api/seller/logout" method="POST">
          <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
        </form>
      </div>
    </nav>
  );
}

export { SellerNav };

export default async function SellerDashboard() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const [openOrders, specialOrders, totalBouquets] = await Promise.all([
    prisma.order.count({ where: { status: { not: "picked_up" } } }),
    prisma.specialOrder.count({ where: { status: { not: "completed" } } }),
    prisma.bouquet.count({ where: { available: true } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    where: { status: { not: "picked_up" } },
    include: { bouquet: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <SellerNav active="/seller" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-[#5C3D2E] mb-8">דאשבוארד</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <StatCard label="הזמנות פתוחות" value={openOrders} color="bg-[#F4B19B]/30" />
          <StatCard label="הזמנות מיוחדות" value={specialOrders} color="bg-[#FAD9CC]" />
          <StatCard label="זרים זמינים" value={totalBouquets} color="bg-green-50" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <Link href="/seller/orders" className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/20 hover:border-[#F4B19B]/60 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#5C3D2E]">הזמנות</h2>
              <span className="text-[#F4B19B] group-hover:translate-x-[-4px] transition-transform">←</span>
            </div>
            <p className="text-sm text-[#5C3D2E]/60">עדכון סטטוס הזמנות ומעקב</p>
          </Link>
          <Link href="/seller/bouquets" className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4B19B]/20 hover:border-[#F4B19B]/60 transition-colors group">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#5C3D2E]">ניהול זרים</h2>
              <span className="text-[#F4B19B] group-hover:translate-x-[-4px] transition-transform">←</span>
            </div>
            <p className="text-sm text-[#5C3D2E]/60">הוספה, עריכה והסרה מהקטלוג</p>
          </Link>
        </div>

        {recentOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">הזמנות אחרונות</h2>
            <div className="flex flex-col gap-3">
              {recentOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-[#F4B19B]/20 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <p className="text-sm text-[#5C3D2E]/60">{order.bouquet.name} · ₪{order.bouquet.price}</p>
                  </div>
                  <Link href="/seller/orders" className="text-xs px-3 py-1.5 bg-[#F4B19B]/30 text-[#5C3D2E] rounded-full hover:bg-[#F4B19B]/60 transition-colors">
                    פתח
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <p className="text-3xl font-semibold text-[#5C3D2E]">{value}</p>
      <p className="text-sm text-[#5C3D2E]/70 mt-1">{label}</p>
    </div>
  );
}
