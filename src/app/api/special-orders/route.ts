import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { customerName, customerPhone, customerEmail, size, budget, notes, flowerIds } =
    await req.json();

  if (!customerName || !customerPhone || !size) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const order = await prisma.specialOrder.create({
    data: {
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      size,
      budget: budget ?? null,
      notes: notes || null,
      flowers: {
        create: (flowerIds ?? []).map((flowerId: string) => ({ flowerId })),
      },
    },
  });
  return NextResponse.json(order, { status: 201 });
}
