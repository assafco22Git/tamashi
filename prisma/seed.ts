import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

function createPrisma() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const prisma = createPrisma();

const BOUQUETS = [
  {
    name: "עיצוב גדול מיוחד",
    description: "עיצוב פרחוני מרהיב ונדיב עם הורטנזיות כחולות, ורדים כתומים, ענפים מפותלים ועלווה שופעת — מושלם לאירועים גדולים",
    price: 300,
    imageUrl: "/bouquets/b1.jpg",
    featured: true,
    available: true,
  },
  {
    name: "הורטנזיה וגרברות",
    description: "זר קיצי עליז עם הורטנזיה כחולה, גרברות צהובות, גלדיולה ופרחי עונה — עטוף בנייר קראפט חום עם חותמת טמאשי",
    price: 180,
    imageUrl: "/bouquets/b2.jpg",
    featured: true,
    available: true,
  },
  {
    name: "ליליות ואורכידאות",
    description: "עיצוב אלגנטי ונקי עם ליליות ורודות, אורכידאות לבנות ועלווה ירוקה עשירה — בצנצנת כהה על שידה",
    price: 240,
    imageUrl: "/bouquets/b3.jpg",
    featured: false,
    available: true,
  },
  {
    name: "הורטנזיה ודליות",
    description: "זר שופע ורומנטי עם הורטנזיה כחולה, דליות כתומות, ורדים ופרחי אלומה — בצנצנת ענבר כהה",
    price: 220,
    imageUrl: "/bouquets/b4.jpg",
    featured: true,
    available: true,
  },
  {
    name: "זר ליליות ורוד",
    description: "זר בוטנגרף בגוונים ורוד-לבן עם ליליות, ורדים סגולים, דלפיניום ואנטירינום — עטוף בנייר קראפט",
    price: 200,
    imageUrl: "/bouquets/b5.jpg",
    featured: false,
    available: true,
  },
];

async function main() {
  const existing = await prisma.bouquet.findMany({ select: { imageUrl: true } });
  const alreadyCorrect = existing.length === 5 && existing.some(b => b.imageUrl === "/bouquets/b1.jpg");

  if (alreadyCorrect) {
    console.log("Bouquets already seeded correctly, skipping.");
    return;
  }

  await prisma.bouquet.deleteMany();
  await prisma.bouquet.createMany({ data: BOUQUETS });
  console.log(`Seeded ${BOUQUETS.length} bouquets.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
