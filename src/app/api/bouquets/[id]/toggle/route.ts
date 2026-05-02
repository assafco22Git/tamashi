import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const bouquet = await prisma.bouquet.findUnique({ where: { id } });
  if (!bouquet) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.bouquet.update({
    where: { id },
    data: { available: !bouquet.available },
  });
  redirect("/seller/bouquets");
}
