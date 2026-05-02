import Link from "next/link";
import Image from "next/image";

interface BouquetCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function BouquetCard({ id, name, price, imageUrl, description }: BouquetCardProps) {
  return (
    <Link href={`/bouquet/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <h3 className="font-serif text-lg leading-tight">{name}</h3>
            <p className="text-sm font-medium mt-0.5">₪{price}</p>
          </div>
        </div>
        {description && (
          <p className="px-3 py-2 text-sm text-[#5C3D2E]/70 line-clamp-2">{description}</p>
        )}
      </div>
    </Link>
  );
}
