import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

function isAuthenticated(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return cookieStore.get("seller_auth")?.value === "1";
}

export async function GET() {
  const bouquets = await prisma.bouquet.findMany({
    where: { available: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bouquets);
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isAuthenticated(cookieStore)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, price, imageUrl, featured } = await req.json();
  if (!name || !description || !price || !imageUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const bouquet = await prisma.bouquet.create({
    data: { name, description, price, imageUrl, featured: featured ?? false },
  });
  return NextResponse.json(bouquet, { status: 201 });
}
