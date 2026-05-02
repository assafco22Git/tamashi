import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { name, description, price, imageUrl, featured, available } = await req.json();
  const bouquet = await prisma.bouquet.update({
    where: { id },
    data: { name, description, price: parseFloat(price), imageUrl, featured, available },
  });
  return NextResponse.json(bouquet);
}
