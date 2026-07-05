"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import { Search, User, Package, UserCog, UserCheck, Menu, X, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/contexts/CartContext";

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
  { id: "article", label: "Articles", href: "/articles", hasDropdown: false },
];

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [openSub, setOpenSub] = useState<string | null>(null);

  const toggleSub = (id: string) => setOpenSub((prev) => (prev === id ? null : id));
  const closeMobile = () => { setMobileOpen(false); setOpenSub(null); };

  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-[100] h-14
                      bg-white dark:bg-neutral-950
                      border-b border-neutral-200 dark:border-neutral-800">
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
              className="w-full h-9 px-4 rounded-full text-sm transition-colors
                         bg-neutral-100 dark:bg-neutral-800
                         border border-neutral-200 dark:border-neutral-700
                         text-neutral-900 dark:text-neutral-100
                         placeholder-neutral-400 dark:placeholder-neutral-500
                         focus:outline-none focus:border-[#0022FF]
                         focus:bg-white dark:focus:bg-neutral-900"
            />
            <button
              title="search"
              onClick={() => { if (search.trim()) router.push(`/products?search=${encodeURIComponent(search)}`); }}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-neutral-400 dark:text-neutral-500
                         hover:text-[#0022FF] dark:hover:text-[#4466FF]"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-3 flex-shrink-0">
            <ThemeToggle />
            {/* Cart */}
            <Link href="/cart" aria-label="Shopping cart"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors relative
                         text-neutral-700 dark:text-neutral-300
                         hover:bg-neutral-100 dark:hover:bg-neutral-800
                         hover:text-neutral-900 dark:hover:text-neutral-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full
                                 bg-[#0022FF] text-white text-[10px] font-bold flex items-center
                                 justify-center border-2 border-white dark:border-neutral-950 px-0.5">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {isLandingPage ? (
              <Link href="https://comfortable-biscuits-205438.framer.app/"
                className="px-4 h-9 hidden md:flex items-center justify-center rounded-full text-sm font-medium transition-colors
                           bg-[#0022ff] hover:bg-[#001de0] text-white
                           dark:bg-[#0022FF] dark:hover:bg-[#3355ee]">
                Register
              </Link>
            ) : (
              <div className="relative group" ref={dropdownRef}>
                {/* ── Trigger Button ── */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Account"
                  className="w-9 h-9 flex items-center justify-center rounded-full transition-colors cursor-pointer
                   text-neutral-700 dark:text-neutral-300
                   hover:bg-neutral-100 dark:hover:bg-neutral-800
                   hover:text-neutral-900 dark:hover:text-neutral-100"
                >
                  <User size={20} />
                </button>

                {/* ── Dropdown Menu ── */}
                <div
                  className={`absolute right-0 top-full pt-2 transition-all duration-200 z-[110]
                  md:group-hover:opacity-100 md:group-hover:visible
                  ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                >
                  <div className="w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg py-2 flex flex-col">
                    <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                      <p className="text-sm font-bold text-neutral-900 dark:text-white">My Account</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)} // Tutup menu saat link diklik
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <User size={16} />
                      My Profile
                    </Link>

                    <Link
                      href="/orders/history"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#0022ff] dark:text-[#0022ff] hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#0000ff] dark:hover:text-[#0000ff] transition-colors"
                    >
                      <UserCog size={16} />
                      Login as Admin
                    </Link>

                    <Link
                      href="/crafter"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-emerald-500 dark:text-emerald-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-emerald-700 dark:hover:text-emerald-700 transition-colors"
                    >
                      <UserCheck size={16} />
                      Login as Crafter
                    </Link>

                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 dark:text-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-red-700 dark:hover:text-red-700 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Hamburger — mobile only */}
            <button aria-label="Toggle menu" onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] p-1 cursor-pointer">
              {mobileOpen ? <X className="text-neutral-950 dark:text-neutral-100" size={20}/> : <Menu className="text-neutral-950 dark:text-neutral-100" size={20}/>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop Nav ── */}
      <nav className="hidden md:block sticky top-14 z-[99] h-[72px]
                      bg-white dark:bg-neutral-950
                      border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-center">
          <ul className="flex items-center gap-2 list-none p-0 m-0">
            {menuItems.map((item) => (
              <li key={item.id} className="relative group pb-4 -mb-4">
                <Link href={item.href}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-full border border-transparent
                             transition-all whitespace-nowrap
                             text-neutral-600 dark:text-neutral-400
                             hover:text-neutral-900 dark:hover:text-neutral-100
                             hover:border-neutral-200 dark:hover:border-neutral-700
                             hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {item.label}
                  {item.hasDropdown && <ChevronIcon />}
                </Link>

                {/* Desktop Dropdown */}
                {item.hasDropdown && item.subItems && (
                  <div className="hidden group-hover:flex fixed left-0 w-screen shadow-lg z-[98]
                                  justify-center items-center gap-8 py-6
                                  bg-white dark:bg-neutral-950
                                  border-t border-neutral-200 dark:border-neutral-800"
                    style={{ top: "calc(56px + 72px)" }}>
                    {item.subItems.map((sub) => (
                      <Link key={sub.id} href={sub.href}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors
                                   hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <img src={sub.src} alt={sub.alt} className="w-16 h-16 object-contain" />
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                          {sub.label}
                        </span>
                      </Link>
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
        <div className="md:hidden fixed top-14 left-0 w-full h-[calc(100vh-56px)] z-[200]
                        overflow-y-auto flex flex-col p-4 gap-1
                        bg-white dark:bg-neutral-950">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-neutral-200 dark:border-neutral-800 last:border-b-0">
              {item.hasDropdown ? (
                <>
                  <button onClick={() => toggleSub(item.id)}
                    className="flex items-center justify-between w-full px-2 py-4 text-base font-medium cursor-pointer
                               text-neutral-900 dark:text-neutral-100">
                    {item.label}
                    <ChevronIcon className={`transition-transform duration-250 ${openSub === item.id ? "rotate-180" : ""}`} />
                  </button>
                  {openSub === item.id && (
                    <div className="flex flex-wrap gap-4 px-2 pb-4">
                      {item.subItems?.map((sub) => (
                        <Link key={sub.id} href="#" onClick={closeMobile}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                                     hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          <img src={sub.src} alt={sub.alt} className="w-12 h-12 object-contain" />
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href} onClick={closeMobile}
                  className="flex items-center w-full px-2 py-4 text-base font-medium
                             text-neutral-900 dark:text-neutral-100">
                  {item.label}
                </Link>
              )}
            </div>
          ))}

          {isLandingPage && (
            <div className="pt-4 mt-2">
              <Link
                href="https://comfortable-biscuits-205438.framer.app/"
                onClick={closeMobile}
                className="flex items-center justify-center w-full h-12 rounded-full text-base font-semibold transition-colors text-white
                     bg-[#0022ff] hover:bg-[#001de0]
                     dark:bg-[#4466ff] dark:hover:bg-[#3355ee]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}