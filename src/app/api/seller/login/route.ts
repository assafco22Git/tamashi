import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SELLER_PASSWORD = "1234";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password !== SELLER_PASSWORD) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("seller_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
