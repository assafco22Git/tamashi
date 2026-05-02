import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

// Only runs in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
  }

  const password = await bcrypt.hash("tamashi2024", 10);

  await prisma.user.upsert({
    where: { email: "seller@tamashi.co" },
    update: {},
    create: { email: "seller@tamashi.co", password, name: "Tamashi Seller", role: "seller" },
  });

  const flowers = ["Rose", "Tulip", "Peony", "Ranunculus", "Anemone", "Lisianthus", "Gypsophila", "Eucalyptus"];
  for (const name of flowers) {
    await prisma.flower.upsert({
      where: { id: name.toLowerCase() },
      update: {},
      create: { id: name.toLowerCase(), name },
    });
  }

  return NextResponse.json({
    ok: true,
    seller: { email: "seller@tamashi.co", password: "tamashi2024" },
    flowersAdded: flowers.length,
  });
}
