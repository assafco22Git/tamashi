import Link from "next/link";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import { prisma } from "@/lib/db";

async function getData() {
  const [recent, settings] = await Promise.all([
    prisma.bouquet.findMany({ where: { available: true }, take: 9, orderBy: { createdAt: "desc" } }),
    prisma.storeSetting.findMany(),
  ]);
  const s = Object.fromEntries(settings.map((r) => [r.key, r.value]));
  return { recent, s };
}

export default async function HomePage() {
  const { recent, s } = await getData();
  const tagline = s.tagline ?? "זרים עבודת יד, עשויים באהבה בתל אביב";
  const address = s.address ?? "תל אביב";
  const hoursWeekday = s.hours_weekday ?? "א׳–ה׳, 9:00–19:00";
  const hoursFriday = s.hours_friday ?? "ו׳ 9:00–14:00";

  return (
    <div className="min-h-screen page-enter">
      <Navigation />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #F4B19B 0%, #FAD9CC 40%, #FDF6F0 100%)" }} />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#F4B19B]/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-[#E8916F]/20 blur-3xl" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <Image src="/logo.jpg" alt="Tamashi" width={100} height={100} className="mb-6 drop-shadow-lg" />
          <h1 className="font-serif text-5xl md:text-7xl text-[#5C3D2E] mb-4 tracking-wide">Tamashi</h1>
          <p className="text-[#5C3D2E]/70 text-lg md:text-xl mb-8 max-w-md">{tagline}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/catalog" className="px-8 py-3 bg-[#5C3D2E] text-white rounded-full font-medium hover:bg-[#4a3124] transition-colors text-center">
              לקטלוג
            </Link>
            <Link href="/special-order" className="px-8 py-3 border-2 border-[#5C3D2E] text-[#5C3D2E] rounded-full font-medium hover:bg-[#5C3D2E] hover:text-white transition-colors text-center">
              הזמנה מיוחדת
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-12 max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl text-[#5C3D2E] text-center mb-8">הזרים שלנו</h2>
        {recent.length === 0 ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-[#FAD9CC] to-[#F4B19B] animate-pulse" />
              ))}
            </div>
            <p className="text-center text-[#5C3D2E]/60 text-sm">הזרים יופיעו כאן לאחר שיעלו על ידי המנהל.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {recent.map((b) => (
              <Link key={b.id} href={`/bouquet/${b.id}`} className="group block">
                <div className="relative overflow-hidden rounded-2xl aspect-square bg-[#FAD9CC]">
                  <Image src={b.imageUrl} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 right-0 left-0 p-3 text-white text-right">
                    <h3 className="font-serif text-lg leading-tight">{b.name}</h3>
                    <p className="text-sm">₪{b.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link href="/catalog" className="inline-block px-10 py-3 bg-[#F4B19B] text-[#5C3D2E] rounded-full font-medium hover:bg-[#E8916F] hover:text-white transition-colors">
            כל הזרים ←
          </Link>
        </div>
      </section>

      {/* Store info */}
      <section className="py-12 px-4 text-center" style={{ background: "linear-gradient(180deg, #FDF6F0 0%, #FAD9CC 100%)" }}>
        <h2 className="font-serif text-2xl text-[#5C3D2E] mb-8">בואו לבקר</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">📍</span>
            <p className="font-medium text-[#5C3D2E]">{address}</p>
            <p className="text-[#5C3D2E]/60 text-sm">איסוף עצמי בלבד</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl">🕐</span>
            <p className="font-medium text-[#5C3D2E]">{hoursWeekday}</p>
            <p className="text-[#5C3D2E]/60 text-sm">{hoursFriday}</p>
          </div>
          <a href="https://www.instagram.com/tamashi.tlv/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:opacity-70 transition-opacity">
            <span className="text-3xl">📸</span>
            <p className="font-medium text-[#5C3D2E]">@tamashi.tlv</p>
            <p className="text-[#5C3D2E]/60 text-sm">עקבו אחרינו באינסטגרם</p>
          </a>
        </div>
      </section>

      <footer className="text-center py-6 text-[#5C3D2E]/40 text-sm">
        © {new Date().getFullYear()} Tamashi · כל הזכויות שמורות
      </footer>
    </div>
  );
}
