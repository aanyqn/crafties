"use client";

import Image from "next/image";
import Link from "next/link";

const footerColumns = [
  {
    id: "col-shop",
    heading: "Koleksi Produk",
    links: [
      { label: "Dekorasi Rumah", href: "#section-category" },
      { label: "Aksesoris Lucu", href: "#section-category" },
      { label: "Boneka Rajut (Amigurumi)", href: "#section-category" },
      { label: "Kado Unik & Custom", href: "#section-category" },
      { label: "Produk Populer", href: "#section-popular" },
    ],
  },
  {
    id: "col-about",
    heading: "Crafties",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Cerita Pengrajin", href: "#" },
      { label: "Artikel & Inspirasi", href: "#section-articles" },
      { label: "Karir", href: "#" },
    ],
  },
  {
    id: "col-support",
    heading: "Bantuan & Dukungan",
    links: [
      { label: "Cara Memesan", href: "#" },
      { label: "Kebijakan Pengembalian", href: "#" },
      { label: "FAQ (Tanya Jawab)", href: "#" },
      { label: "Estimasi Pengiriman", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-950 py-16 text-white" role="contentinfo">
      <div className="max-w-[1200px] mx-auto px-6">

        {/* Top/Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Column (Mengambil 2 Slot Kolom di Layar Lebar) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" aria-label="Crafties home" className="w-fit">
              <Image
                src="/assets/img/LOGO-2.png"
                alt="Crafties Logo"
                width={95}
                height={28}
                className="h-6 w-auto brightness-0 invert opacity-90" // Menjadikan logo putih bersih agar kontras dengan bg gelap
              />
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Menghadirkan kehangatan dan keindahan lewat kerajinan tangan rajut berkualitas tinggi. Setiap produk dibuat dengan penuh cinta oleh para pengrajin lokal pilihan.
            </p>
          </div>

          {/* Dynamic Link Columns */}
          {footerColumns.map((col) => (
            <div key={col.id}>
              <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-300 mb-4">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white hover:underline underline-offset-4 decoration-blue-500/50 transition-all duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
          
          {/* Copyright */}
          <p className="text-xs text-neutral-500 order-2 sm:order-1">
            © {new Date().getFullYear()} Crafties. All rights reserved. Made with love for local crafters.
          </p>
          
          {/* Social Media Links / Icons Placeholder */}
          <div className="flex items-center gap-4 order-1 sm:order-2">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="WhatsApp Contact">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
}