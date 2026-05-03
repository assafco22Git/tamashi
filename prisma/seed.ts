import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const prisma = createPrisma();

const BOUQUETS = [
  {
    name: "אנטוריום טרופי",
    description: "עיצוב טרופי נועז עם אנטוריום צהוב, עלי דקל ופרחי בר בצבעים עזים",
    price: 220,
    imageUrl: "/bouquets/b1.jpg",
    featured: true,
    available: true,
  },
  {
    name: "זר הורטנזיה מיקס",
    description: "הורטנזיות בסגול ורוד עם דליות ופרחי בר, מושלם לאירועים",
    price: 195,
    imageUrl: "/bouquets/b2.jpg",
    featured: true,
    available: true,
  },
  {
    name: "אנטוריום כהה",
    description: "עיצוב דרמטי עם אנטוריום כהה, גבעולים טרופיים ועלווה ירוקה עשירה",
    price: 240,
    imageUrl: "/bouquets/b3.jpg",
    featured: false,
    available: true,
  },
  {
    name: "אורכידאה ואנטוריום",
    description: "שילוב יוקרתי של אורכידאות, אנטוריום אדום וליליות בעיצוב גבוה",
    price: 250,
    imageUrl: "/bouquets/b4.jpg",
    featured: true,
    available: true,
  },
  {
    name: "גן צבעוני",
    description: "זר מרהיב ומלא חיים עם מגוון פרחי גן בצבעים חיים ועלווה ירוקה",
    price: 180,
    imageUrl: "/bouquets/b5.jpg",
    featured: false,
    available: true,
  },
  {
    name: "דליה ואנטוריום",
    description: "זר ייחודי עם דליות אדומות, אנטוריום ופרחי גן מיוחדים ביד",
    price: 200,
    imageUrl: "/bouquets/b6.jpg",
    featured: false,
    available: true,
  },
  {
    name: "קרנציה ופירות",
    description: "עיצוב מיוחד עם קרנציות בורדו, אנטוריום ועלי פרי, בצנצנת לבנה",
    price: 175,
    imageUrl: "/bouquets/b7.jpg",
    featured: false,
    available: true,
  },
  {
    name: "ליליות ואורכידאות",
    description: "זר אלגנטי עם ליליות ורודות, אורכידאות לבנות וגבעולים ירוקים עדינים",
    price: 210,
    imageUrl: "/bouquets/b8.jpg",
    featured: true,
    available: true,
  },
  {
    name: "הורטנזיה ופרחי בר",
    description: "זר כלות אינטימי עם הורטנזיות סגולות, ורדים ופרחי בר עדינים",
    price: 230,
    imageUrl: "/bouquets/b9.jpg",
    featured: false,
    available: true,
  },
  {
    name: "הורטנזיה וכתמים",
    description: "זר עגול ושופע עם הורטנזיות בגוונים סגולים, ורדים כתומים וזרדים",
    price: 215,
    imageUrl: "/bouquets/b10.jpg",
    featured: false,
    available: true,
  },
];

async function main() {
  // Always re-seed bouquets so images stay up to date
  const existing = await prisma.bouquet.findMany({ select: { imageUrl: true }, take: 1 });
  const alreadyLocal = existing[0]?.imageUrl?.startsWith("/bouquets/");

  if (alreadyLocal) {
    console.log("Bouquets already seeded with local images, skipping.");
    return;
  }

  await prisma.bouquet.deleteMany();
  await prisma.bouquet.createMany({ data: BOUQUETS });
  console.log(`Seeded ${BOUQUETS.length} bouquets with Instagram photos.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
