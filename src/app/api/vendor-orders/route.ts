import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { vendorName, items, totalAmount, expectedDate, notes } = await req.json();
  if (!vendorName || !items) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const order = await prisma.vendorOrder.create({
    data: {
      vendorName,
      items,
      totalAmount: totalAmount ?? null,
      expectedDate: expectedDate ? new Date(expectedDate) : null,
      notes: notes || null,
    },
  });
  return NextResponse.json(order, { status: 201 });
}
