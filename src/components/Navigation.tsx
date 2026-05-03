"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  function toggle() {
    if (open) {
      setAnimating(true);
      setTimeout(() => { setOpen(false); setAnimating(false); }, 350);
    } else {
      setOpen(true);
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#FDF6F0]/90 backdrop-blur-sm border-b border-[#F4B19B]/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-semibold text-[#5C3D2E] tracking-wide">Tamashi</span>
        </Link>

        {/* Desktop — photo links only */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/catalog" className="group relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#F4B19B] transition-all" title="קטלוג">
            <Image src="/bouquets/b4.jpg" alt="קטלוג" fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="40px" />
          </Link>
          <Link href="/special-order" className="group relative w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-[#F4B19B] transition-all" title="הזמנה מיוחדת">
            <Image src="/bouquets/b1.jpg" alt="הזמנה מיוחדת" fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="40px" />
          </Link>
          <a
            href="https://www.instagram.com/tamashi.tlv/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5C3D2E] hover:text-[#E8916F] transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <Link href="/seller/login" className="text-[#5C3D2E]/25 hover:text-[#5C3D2E]/50 transition-colors text-xs">מוכר</Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-[#5C3D2E] p-1" onClick={toggle} aria-label="תפריט">
          {open && !animating ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown — photos only */}
      {(open || animating) && (
        <div className={`md:hidden bg-[#FDF6F0] border-t border-[#F4B19B]/30 px-4 py-4 ${animating ? "nav-close" : "nav-open"}`}>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/catalog" onClick={toggle} className="group relative aspect-square rounded-2xl overflow-hidden">
              <Image src="/bouquets/b4.jpg" alt="קטלוג" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-3 right-3 text-white text-sm font-semibold">קטלוג</p>
            </Link>
            <Link href="/special-order" onClick={toggle} className="group relative aspect-square rounded-2xl overflow-hidden">
              <Image src="/bouquets/b1.jpg" alt="הזמנה מיוחדת" fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-3 right-3 text-white text-sm font-semibold">הזמנה מיוחדת</p>
            </Link>
          </div>
          <a
            href="https://www.instagram.com/tamashi.tlv/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#5C3D2E] mt-4 text-sm"
          >
            <InstagramIcon /> @tamashi.tlv
          </a>
          <Link href="/seller/login" className="block text-[#5C3D2E]/30 text-xs mt-3" onClick={toggle}>כניסה למוכר</Link>
        </div>
      )}
    </nav>
  );
}

function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
