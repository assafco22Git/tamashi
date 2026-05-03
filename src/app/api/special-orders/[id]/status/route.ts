import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const formData = await req.formData();
  const status = formData.get("status") as string;
  await prisma.specialOrder.update({ where: { id }, data: { status } });
  return NextResponse.redirect(new URL("/seller/orders", req.url));
}
