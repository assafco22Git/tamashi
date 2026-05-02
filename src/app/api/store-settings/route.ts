import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

export async function GET() {
  const settings = await prisma.storeSetting.findMany();
  return NextResponse.json(Object.fromEntries(settings.map(s => [s.key, s.value])));
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data: Record<string, string> = await req.json();
  for (const [key, value] of Object.entries(data)) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  return NextResponse.json({ ok: true });
}
