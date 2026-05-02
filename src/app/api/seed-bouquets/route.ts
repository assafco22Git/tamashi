import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

const BOUQUETS = [
  {
    name: "ורדים וורודים",
    description: "זר ורדים וורודים עדין, מושלם לאירועים רומנטיים ולמתנה מהלב",
    price: 180,
    imageUrl: "https://images.unsplash.com/photo-1487530811576-3780be1f8e4b?w=800&q=80",
    featured: true,
    available: true,
  },
  {
    name: "זר בר פראי",
    description: "זר בר עשיר ומלא חיים עם פרחי שדה צבעוניים ועלווה ירוקה",
    price: 160,
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88df5691a4a7?w=800&q=80",
    featured: true,
    available: true,
  },
  {
    name: "אדמוניות לבנות",
    description: "זר אדמוניות לבנות מרשים, מלא נפח ועדינות, לאירועים מיוחדים",
    price: 220,
    imageUrl: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&q=80",
    featured: false,
    available: true,
  },
  {
    name: "כלניות אביב",
    description: "זר כלניות עליז בצבעים עזים, מסמל את התחדשות האביב הישראלי",
    price: 150,
    imageUrl: "https://images.unsplash.com/photo-1481344836366-71f0f86fcf42?w=800&q=80",
    featured: true,
    available: true,
  },
  {
    name: "זר לבן נקי",
    description: "זר לבן קלאסי ונקי עם ורדים, ליזיאנתוס ואקליפטוס, מושלם לחתונות",
    price: 240,
    imageUrl: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&q=80",
    featured: false,
    available: true,
  },
  {
    name: "ורדים אדומים",
    description: "זר ורדים אדומים קלאסי ויוקרתי – מסר אהבה בשפה הכי ישנה שיש",
    price: 200,
    imageUrl: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80",
    featured: true,
    available: true,
  },
  {
    name: "בוהו דרייד",
    description: "זר פרחים מיובשים בסגנון בוהו, לנצח יפה ולא דורש טיפול",
    price: 175,
    imageUrl: "https://images.unsplash.com/photo-1501003878151-d3cb87799705?w=800&q=80",
    featured: false,
    available: true,
  },
  {
    name: "גן קיץ",
    description: "זר קיצי ססגוני עם חמניות, ציניות ופרחי גן בצבעים חמים",
    price: 165,
    imageUrl: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&q=80",
    featured: false,
    available: true,
  },
  {
    name: "אקליפטוס ופרחים",
    description: "שילוב מודרני של ענפי אקליפטוס ירוק עם פרחים עדינים בגוונים רכים",
    price: 190,
    imageUrl: "https://images.unsplash.com/photo-1422207049116-cfaf69531072?w=800&q=80",
    featured: false,
    available: true,
  },
  {
    name: "זר עדין מיקס",
    description: "זר מיקס עדין ורומנטי בגוונים פסטליים, מושלם לכל אירוע",
    price: 210,
    imageUrl: "https://images.unsplash.com/photo-1444021465936-c6ca81d39b84?w=800&q=80",
    featured: false,
    available: true,
  },
];

export async function POST() {
  const cookieStore = await cookies();
  if (cookieStore.get("seller_auth")?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.bouquet.count();
  if (existing > 0) {
    return NextResponse.json({ message: `Already has ${existing} bouquets, skipping.` });
  }

  await prisma.bouquet.createMany({ data: BOUQUETS });

  return NextResponse.json({ message: `Inserted ${BOUQUETS.length} bouquets.` });
}
