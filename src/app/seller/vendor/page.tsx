import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import VendorOrderForm from "./VendorOrderForm";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  ordered: "bg-blue-100 text-blue-800",
  received: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

async function getAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("seller_auth")?.value === "1";
}

export default async function VendorPage() {
  const isAuth = await getAuth();
  if (!isAuth) redirect("/seller/login");

  const orders = await prisma.vendorOrder.findMany({
    orderBy: { createdAt: "desc" },
  });

  const open = orders.filter((o) => o.status !== "received" && o.status !== "cancelled");
  const closed = orders.filter((o) => o.status === "received" || o.status === "cancelled");

  return (
    <div className="min-h-screen bg-[#FDF6F0]">
      <nav className="bg-[#5C3D2E] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={32} height={32} className="rounded-full" />
          <span className="font-serif text-lg">Tamashi — Seller</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/seller" className="hover:text-[#F4B19B] transition-colors">Dashboard</Link>
          <Link href="/seller/bouquets" className="hover:text-[#F4B19B] transition-colors">Bouquets</Link>
          <form action="/api/seller/logout" method="POST">
            <button className="hover:text-[#F4B19B] transition-colors">Logout</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl text-[#5C3D2E] mb-8">Vendor Orders</h1>

        {/* New order form */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F4B19B]/20 mb-8">
          <h2 className="font-serif text-xl text-[#5C3D2E] mb-4">New Vendor Order</h2>
          <VendorOrderForm />
        </div>

        {/* Open orders */}
        <section className="mb-8">
          <h2 className="font-serif text-xl text-[#5C3D2E] mb-3">Open Orders ({open.length})</h2>
          {open.length === 0 ? (
            <p className="text-[#5C3D2E]/40 py-4 text-center">No open vendor orders.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {open.map((order) => (
                <VendorOrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>

        {/* Closed orders */}
        {closed.length > 0 && (
          <section>
            <h2 className="font-serif text-xl text-[#5C3D2E] mb-3">Completed / Cancelled</h2>
            <div className="flex flex-col gap-3 opacity-60">
              {closed.map((order) => (
                <VendorOrderRow key={order.id} order={order} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function VendorOrderRow({ order }: { order: { id: string; vendorName: string; items: string; totalAmount: number | null; status: string; expectedDate: Date | null; createdAt: Date; notes: string | null } }) {
  const next: Record<string, string> = {
    pending: "ordered",
    ordered: "received",
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-[#F4B19B]/20">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-medium text-[#5C3D2E]">{order.vendorName}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? "bg-gray-100"}`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-[#5C3D2E]/70 whitespace-pre-wrap">{order.items}</p>
          {order.totalAmount && (
            <p className="text-sm text-[#5C3D2E]/60 mt-1">Total: ₪{order.totalAmount}</p>
          )}
          {order.expectedDate && (
            <p className="text-xs text-[#5C3D2E]/50 mt-1">
              Expected: {new Date(order.expectedDate).toLocaleDateString("he-IL")}
            </p>
          )}
          {order.notes && <p className="text-xs text-[#5C3D2E]/50 italic mt-1">{order.notes}</p>}
        </div>
        {next[order.status] && (
          <form action={`/api/vendor-orders/${order.id}/status`} method="POST">
            <input type="hidden" name="status" value={next[order.status]} />
            <button
              type="submit"
              className="text-xs px-3 py-2 bg-[#F4B19B] text-[#5C3D2E] rounded-full hover:bg-[#E8916F] hover:text-white transition-colors whitespace-nowrap"
            >
              Mark {next[order.status]}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
