import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { bouquetId, customerName, customerPhone, customerEmail, pickupDate, notes } =
    await req.json();

  if (!bouquetId || !customerName || !customerPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      bouquetId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      pickupDate: pickupDate ? new Date(pickupDate) : null,
      notes: notes || null,
    },
  });
  return NextResponse.json(order, { status: 201 });
}
