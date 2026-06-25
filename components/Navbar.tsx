"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

const crafters = [
  { id: "cra-1", label: "Crafties", src: "/assets/img/LOGO-2.png", href: "#", alt: "crafters-brand-logo" },
  { id: "cra-2", label: "Crafties", src: "/assets/img/LOGO-2.png", href: "#", alt: "crafters-brand-logo" },
  { id: "cra-3", label: "Crafties", src: "/assets/img/LOGO-2.png", href: "#", alt: "crafters-brand-logo" },
  { id: "cra-4", label: "Crafties", src: "/assets/img/LOGO-2.png", href: "#", alt: "crafters-brand-logo" },
];

const categories = [
  { id: "cat-1", label: "Decorations", src: "/assets/img/category-1.png", href: "/products?category=decorations", alt: "category-image" },
  { id: "cat-2", label: "Accessories", src: "/assets/img/category-2.png", href: "/products?category=accessories", alt: "category-image" },
  { id: "cat-3", label: "Toys", src: "/assets/img/category-3-v2.png", href: "/products?category=toys", alt: "category-image" },
  { id: "cat-4", label: "Gifts", src: "/assets/img/category-4.png", href: "/products?category=gifts", alt: "category-image" },
];

const menuItems = [
  { id: "crafters", label: "Crafters", href: "#", hasDropdown: true, subItems: crafters },
  { id: "category", label: "Category", href: "#section-category", hasDropdown: true, subItems: categories },
  { id: "about", label: "New & Popular", href: "/products", hasDropdown: false },
  { id: "article", label: "Articles", href: "#", hasDropdown: false },
];

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [openSub, setOpenSub] = useState<string | null>(null);

  const toggleSub = (id: string) => setOpenSub((prev) => (prev === id ? null : id));
  const closeMobile = () => { setMobileOpen(false); setOpenSub(null); };

  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(search)}`
      );
    }
  };

  return (
    <header>
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-[100] h-14 bg-white border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/assets/img/LOGO-2.png" alt="Crafties"
              width={80} height={20} className="h-5 w-auto" />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-[360px] relative hidden sm:block">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              aria-label="Search products"
              className="w-full h-9 px-4 bg-neutral-100 border border-neutral-200 rounded-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#0022FF] focus:bg-white transition-colors"
            />
            <button
              onClick={() => {
                if (search.trim()) {
                  router.push(
                    `/products?search=${encodeURIComponent(search)}`
                  );
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#0022FF]"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Account / Login */}
            {isLandingPage ? (
              <Link
                href="/register"
                className="px-4 h-9 flex items-center justify-center rounded-full bg-[#0022ff] text-white text-sm font-medium hover:bg-[#001de0] transition-colors"
              >
                Register
              </Link>
            ) : (
              <Link
                href="/profile"
                aria-label="Account"
                className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <Link href={`/cart`} aria-label="Shopping cart"
              className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </Link>

            {/* Hamburger — mobile only */}
            <button aria-label="Toggle menu" onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] p-1 cursor-pointer">
              <span className={`w-5 h-0.5 bg-neutral-900 rounded block transition-all duration-250 origin-center ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`w-5 h-0.5 bg-neutral-900 rounded block transition-all duration-250 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-0.5 bg-neutral-900 rounded block transition-all duration-250 origin-center ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop Nav ── */}
      <nav className="hidden md:block sticky top-14 z-[99] h-[72px] bg-white border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-center">
          <ul className="flex items-center gap-2 list-none p-0 m-0">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group pb-4 -mb-4">
                <Link href={item.href}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-neutral-600 rounded-full border border-transparent hover:text-neutral-900 hover:border-neutral-200 hover:bg-neutral-100 transition-all whitespace-nowrap">
                  {item.label}
                  {item.hasDropdown && <ChevronIcon />}
                </Link>

                {/* Desktop Dropdown */}
                {item.hasDropdown && item.subItems && (
                  <div className="hidden group-hover:flex fixed left-0 w-screen bg-white border-t border-neutral-200 shadow-lg z-[98] justify-center items-center gap-8 py-6"
                    style={{ top: "calc(56px + 72px)" }}>
                    {item.subItems.map((sub) => (
                      <a key={sub.id} href={sub.href}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-100 transition-colors">
                        <img src={sub.src} alt={sub.alt} className="w-16 h-16 object-contain" />
                        <span className="text-xs font-medium text-neutral-700">{sub.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full h-[calc(100vh-56px)] bg-white z-[200] overflow-y-auto flex flex-col p-4 gap-1">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-neutral-200 last:border-b-0">
              {item.hasDropdown ? (
                <>
                  <button onClick={() => toggleSub(item.id)}
                    className="flex items-center justify-between w-full px-2 py-4 text-base font-medium text-neutral-900 cursor-pointer">
                    {item.label}
                    <ChevronIcon className={`transition-transform duration-250 ${openSub === item.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSub === item.id && (
                    <div className="flex flex-wrap gap-4 px-2 pb-4">
                      {item.subItems?.map((sub) => (
                        <a key={sub.id} href="#" onClick={closeMobile}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                          <img src={sub.src} alt={sub.alt} className="w-12 h-12 object-contain" />
                          <span className="text-xs text-neutral-600">{sub.label}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={closeMobile}
                  className="flex items-center w-full px-2 py-4 text-base font-medium text-neutral-900">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
