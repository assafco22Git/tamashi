"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#FDF6F0]/90 backdrop-blur-sm border-b border-[#F4B19B]/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="Tamashi" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-serif text-[#5C3D2E] tracking-wide">Tamashi</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/catalog" className="text-[#5C3D2E] hover:text-[#E8916F] transition-colors">
            Catalog
          </Link>
          <Link
            href="/special-order"
            className="text-[#5C3D2E] hover:text-[#E8916F] transition-colors"
          >
            Special Order
          </Link>
          <a
            href="https://www.instagram.com/tamashi.tlv/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#5C3D2E] hover:text-[#E8916F] transition-colors"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-[#5C3D2E] p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-[#FDF6F0] border-t border-[#F4B19B]/30 px-4 py-4 flex flex-col gap-4">
          <Link
            href="/catalog"
            className="text-[#5C3D2E] text-lg"
            onClick={() => setOpen(false)}
          >
            Catalog
          </Link>
          <Link
            href="/special-order"
            className="text-[#5C3D2E] text-lg"
            onClick={() => setOpen(false)}
          >
            Special Order
          </Link>
          <a
            href="https://www.instagram.com/tamashi.tlv/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#5C3D2E] text-lg"
          >
            <InstagramIcon /> @tamashi.tlv
          </a>
        </div>
      )}
    </nav>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
