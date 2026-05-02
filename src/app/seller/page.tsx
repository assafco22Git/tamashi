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

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function SellerDashboard() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const [openOrders, specialOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: { not: "picked_up" } },
      include: { bouquet: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.specialOrder.findMany({
      where: { status: { not: "completed" } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      {/* Seller nav */}
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="font-serif text-lg">Tamashi — Seller</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller/bouquets" className="hover:text-[#F4B19B] transition-colors">Bouquets</Link>
          <Link href="/seller/vendor" className="hover:text-[#F4B19B] transition-colors">Vendor</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">Logout</button>
          </form>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl text-[#5C3D2E] mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Open Orders" value={openOrders.length} color="bg-[#F4B19B]/30" />
          <StatCard label="Special Requests" value={specialOrders.length} color="bg-[#FAD9CC]" />
          <StatCard label="Pending" value={openOrders.filter((o) => o.status === "pending").length} color="bg-yellow-50" />
          <StatCard label="Ready" value={openOrders.filter((o) => o.status === "ready").length} color="bg-green-50" />
        </div>

        {/* Open Orders */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl text-[#5C3D2E] mb-4">Open Orders</h2>
          {openOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/50 py-8 text-center">No open orders right now.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {openOrders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>

        {/* Special Orders */}
        <section>
          <h2 className="font-serif text-2xl text-[#5C3D2E] mb-4">Special Requests</h2>
          {specialOrders.length === 0 ? (
            <p className="text-[#5C3D2E]/50 py-8 text-center">No special requests.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {specialOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
                  <p className="text-sm text-[#5C3D2E]/60">Size: {order.size}{order.budget ? ` · Budget: ₪${order.budget}` : ""}</p>
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
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20 flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-medium text-[#5C3D2E]">{order.customerName}</p>
          <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
            {order.status}
          </span>
        </div>
        <p className="text-sm text-[#5C3D2E]/70">{order.bouquet.name} · ₪{order.bouquet.price}</p>
        <p className="text-sm text-[#5C3D2E]/60">{order.customerPhone}</p>
        {order.pickupDate && (
          <p className="text-xs text-[#5C3D2E]/50 mt-1">
            Pickup: {new Date(order.pickupDate).toLocaleDateString("he-IL")}
          </p>
        )}
      </div>
      <StatusUpdater orderId={order.id} currentStatus={order.status} />
    </div>
  );
}

function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const next: Record<string, string> = {
    pending: "confirmed",
    confirmed: "ready",
    ready: "picked_up",
  };
  const nextStatus = next[currentStatus];
  if (!nextStatus) return null;

  return (
    <form action={`/api/orders/${orderId}/status`} method="POST">
      <input type="hidden" name="status" value={nextStatus} />
      <button
        type="submit"
        className="text-xs px-3 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-full hover:bg-[#E8916F] hover:text-white transition-colors whitespace-nowrap"
      >
        Mark {nextStatus.replace("_", " ")}
      </button>
    </form>
  );
}
