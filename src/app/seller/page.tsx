import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  picked_up: "bg-gray-100 text-gray-600",
};

const STATUS_HE: Record<string, string> = {
  pending: "ממתין", confirmed: "אושר", ready: "מוכן", picked_up: "נאסף",
};

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function SellerDashboard() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const [openOrders, specialOrders] = await Promise.all([
    prisma.order.findMany({ where: { status: { not: "picked_up" } }, include: { bouquet: true }, orderBy: { createdAt: "desc" } }),
    prisma.specialOrder.findMany({ where: { status: { not: "completed" } }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold">Tamashi — מוכר</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller/bouquets" className="hover:text-[#F4B19B] transition-colors">זרים</Link>
          <Link href="/seller/vendor" className="hover:text-[#F4B19B] transition-colors">ספקים</Link>
          <Link href="/seller/manager" className="hover:text-[#F4B19B] transition-colors">מנהל</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl text-[#5C3D2E] mb-8 font-semibold">דאשבוארד</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="הזמנות פתוחות" value={openOrders.length} color="bg-[#F4B19B]/30" />
          <StatCard label="הזמנות מיוחדות" value={specialOrders.length} color="bg-[#FAD9CC]" />
          <StatCard label="ממתינות" value={openOrders.filter(o => o.status === "pending").length} color="bg-yellow-50" />
          <StatCard label="מוכנות" value={openOrders.filter(o => o.status === "ready").length} color="bg-green-50" />
        </div>

        <div className="mb-10">
          <Link href="/seller/manager" className="inline-flex items-center gap-2 px-6 py-3 bg-[#5C3D2E] text-white rounded-full font-medium hover:bg-[#4a3124] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            מעבר למצב מנהל
          </Link>
        </div>

        <section className="mb-10">
          <h2 className="font-semiboldtext-2xl text-[#5C3D2E] mb-4">הזמנות פתוחות</h2>
          {openOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/50 py-8 text-center">אין הזמנות פתוחות כרגע.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {openOrders.map(order => <OrderRow key={order.id} order={order} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semiboldtext-2xl text-[#5C3D2E] mb-4">הזמנות מיוחדות</h2>
          {specialOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/50 py-8 text-center">אין הזמנות מיוחדות.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {specialOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>{STATUS_HE[order.status] ?? order.status}</span>
                  </div>
                  <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
                  <p className="text-sm text-[#5C3D2E]/60">גודל: {order.size}{order.budget ? ` · תקציב: ₪${order.budget}` : ""}</p>
                  {order.notes && <p className="text-sm text-[#5C3D2E]/60 mt-1 italic">{order.notes}</p>}
                  <p className="text-xs text-[#5C3D2E]/40 mt-2">{new Date(order.createdAt).toLocaleDateString("he-IL")}</p>
                </div>
              ))}
            </div>
          )}
        </section>
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

function OrderRow({ order }: { order: { id: string; customerName: string; customerPhone: string; status: string; createdAt: Date; pickupDate: Date | null; bouquet: { name: string; price: number } } }) {
  const next: Record<string, string> = { pending: "confirmed", confirmed: "ready", ready: "picked_up" };
  const nextLabel: Record<string, string> = { confirmed: "אושר", ready: "מוכן", picked_up: "נאסף" };
  const nextStatus = next[order.status];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>{STATUS_HE[order.status] ?? order.status}</span>
        </div>
        <p className="text-sm text-[#5C3D2E]/70">{order.bouquet.name} · ₪{order.bouquet.price}</p>
        <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
        {order.pickupDate && <p className="text-xs text-[#5C3D2E]/50 mt-1">איסוף: {new Date(order.pickupDate).toLocaleDateString("he-IL")}</p>}
      </div>
      {nextStatus && (
        <form action={`/api/orders/${order.id}/status`} method="POST">
          <input type="hidden" name="status" value={nextStatus} />
          <button type="submit" className="text-xs px-3 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-full hover:bg-[#E8916F] hover:text-white transition-colors whitespace-nowrap">
            סמן כ{nextLabel[nextStatus]}
          </button>
        </form>
      )}
    </div>
  );
}
