import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  picked_up: "bg-gray-100 text-gray-500",
  completed: "bg-green-100 text-green-800",
};

const STATUS_HE: Record<string, string> = {
  pending: "ממתין", confirmed: "אושר", ready: "מוכן", picked_up: "נאסף", completed: "הושלם",
};

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function OrdersPage() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [openOrders, specialOrders, pastOrders, pastSpecialOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: { not: "picked_up" } },
      include: { bouquet: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.specialOrder.findMany({
      where: { status: { not: "completed" } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      where: { status: "picked_up", updatedAt: { gte: oneMonthAgo } },
      include: { bouquet: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.specialOrder.findMany({
      where: { status: "completed", updatedAt: { gte: oneMonthAgo } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="text-lg font-semibold">Tamashi</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller" className="hover:text-[#F4B19B] transition-colors">דאשבוארד</Link>
          <Link href="/seller/orders" className="text-[#F4B19B]">הזמנות</Link>
          <Link href="/seller/bouquets" className="hover:text-[#F4B19B] transition-colors">זרים</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">יציאה</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-[#5C3D2E] mb-8">הזמנות</h1>

        {/* Regular orders */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">
            הזמנות קטלוג <span className="text-base font-normal text-[#5C3D2E]/50">({openOrders.length})</span>
          </h2>
          {openOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/40 py-6 text-center">אין הזמנות פתוחות כרגע.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {openOrders.map(order => <OrderRow key={order.id} order={order} />)}
            </div>
          )}
        </section>

        {/* Special orders */}
        <section>
          <h2 className="text-xl font-semibold text-[#5C3D2E] mb-4">
            הזמנות מיוחדות <span className="text-base font-normal text-[#5C3D2E]/50">({specialOrders.length})</span>
          </h2>
          {specialOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/40 py-6 text-center">אין הזמנות מיוחדות.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {specialOrders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20">
                  <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
                      {STATUS_HE[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
                  <p className="text-sm text-[#5C3D2E]/60">גודל: {order.size}{order.budget ? ` · תקציב: ₪${order.budget}` : ""}</p>
                  {order.notes && <p className="text-sm text-[#5C3D2E]/60 mt-1 italic">{order.notes}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-[#5C3D2E]/40">{new Date(order.createdAt).toLocaleDateString("he-IL")}</p>
                    <SpecialOrderStatusForm id={order.id} status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past orders (last 30 days) */}
        {(pastOrders.length > 0 || pastSpecialOrders.length > 0) && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-[#5C3D2E]/50 mb-4">
              הזמנות שהסתיימו <span className="text-base font-normal">({pastOrders.length + pastSpecialOrders.length})</span>
            </h2>
            <div className="flex flex-col gap-3">
              {pastOrders.map(order => (
                <div key={order.id} className="bg-white/60 rounded-xl p-4 shadow-sm border border-[#F4B19B]/10 opacity-60">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">נאסף</span>
                  </div>
                  <p className="text-sm text-[#5C3D2E]/70">{order.bouquet.name} · ₪{order.bouquet.price}</p>
                  <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
                  <p className="text-xs text-[#5C3D2E]/40 mt-1">{new Date(order.updatedAt).toLocaleDateString("he-IL")}</p>
                </div>
              ))}
              {pastSpecialOrders.map(order => (
                <div key={order.id} className="bg-white/60 rounded-xl p-4 shadow-sm border border-[#F4B19B]/10 opacity-60">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">הושלם</span>
                  </div>
                  <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
                  <p className="text-sm text-[#5C3D2E]/60">גודל: {order.size}{order.budget ? ` · תקציב: ₪${order.budget}` : ""}</p>
                  <p className="text-xs text-[#5C3D2E]/40 mt-1">{new Date(order.updatedAt).toLocaleDateString("he-IL")}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: { id: string; customerName: string; customerPhone: string; status: string; createdAt: Date; pickupDate: Date | null; bouquet: { name: string; price: number } } }) {
  const next: Record<string, string> = { pending: "confirmed", confirmed: "ready", ready: "picked_up" };
  const nextLabel: Record<string, string> = { confirmed: "אושר", ready: "מוכן", picked_up: "נאסף" };
  const nextStatus = next[order.status];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
          {STATUS_HE[order.status] ?? order.status}
        </span>
      </div>
      <p className="text-sm text-[#5C3D2E]/70">{order.bouquet.name} · ₪{order.bouquet.price}</p>
      <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
      {order.pickupDate && <p className="text-xs text-[#5C3D2E]/50 mt-1">איסוף: {new Date(order.pickupDate).toLocaleDateString("he-IL")}</p>}
      {nextStatus && (
        <div className="mt-3 flex justify-end">
          <form action={`/api/orders/${order.id}/status`} method="POST">
            <input type="hidden" name="status" value={nextStatus} />
            <button type="submit" className="text-xs px-4 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-full hover:bg-[#E8916F] hover:text-white transition-colors">
              סמן כ{nextLabel[nextStatus]}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function SpecialOrderStatusForm({ id, status }: { id: string; status: string }) {
  if (status === "completed") return null;
  const nextStatus = status === "pending" ? "completed" : null;
  if (!nextStatus) return null;
  return (
    <form action={`/api/special-orders/${id}/status`} method="POST">
      <input type="hidden" name="status" value={nextStatus} />
      <button type="submit" className="text-xs px-3 py-1.5 bg-[#F4B19B] text-[#5C3D2E] rounded-full hover:bg-[#E8916F] hover:text-white transition-colors">
        סמן כהושלם
      </button>
    </form>
  );
}
