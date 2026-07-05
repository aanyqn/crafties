"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  { id: "slide-1", src: "/assets/img/hero-image1.png", alt: "Hero slide 1", title: "Decoration", subtitle: "Hiasan untuk mempercantik rumah anda", href: "/products?category=decorations" },
  { id: "slide-2", src: "/assets/img/hero-image2.jpg", alt: "Hero slide 2", title: "Accessories", subtitle: "Aksesoris lucu yang menawan", href: "/products?category=accessories" },
  { id: "slide-3", src: "/assets/img/hero-image3.jpg", alt: "Hero slide 3", title: "Stuffed Toys", subtitle: "Boneka rajut yang imut", href: "/products?category=toys" },
];

const DELAY = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) =>
    setCurrent(((index % slides.length) + slides.length) % slides.length);

  useEffect(() => {
    if (!isAutoplay) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, DELAY);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isAutoplay]);

  const handleNavigation = (newIndex: number) => {
    goTo(newIndex);
    setIsAutoplay(false);
    setTimeout(() => setIsAutoplay(true), 500);
  };

  return (
    <section
      /* FIX: aspect ratio dinamis. Layar HP pakai aspect-[4/3] atau [1/1], layar komputer pakai md:aspect-[16/6] */
      className="w-full relative overflow-hidden bg-neutral-200 aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/6]"
      aria-label="Hero banner"
    >
      <div
        className="absolute inset-0 w-full h-full"
        aria-live="polite"
        onMouseEnter={() => setIsAutoplay(false)}
        onMouseLeave={() => setIsAutoplay(true)}
      >
        {/* Slides */}
        {slides.map((slide, i) => (
          <Link
            key={slide.id}
            href={slide.href}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === current ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              aria-hidden={i !== current}
            >
              <div className="relative w-full h-full">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              </div>
              <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-30 text-center text-white w-full px-6 pointer-events-none">
                <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl md:text-[2.5rem] lg:text-5xl font-bold leading-tight tracking-[-0.01em] text-white drop-shadow-lg mb-2">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm tracking-wide text-white/90 drop-shadow max-w-xs sm:max-w-md mx-auto">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/30 via-black/10 to-black/60"
          aria-hidden="true"
        />

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => handleNavigation(i)}
              className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 ${i === current ? "bg-white w-5 sm:w-7" : "bg-white/50 w-1.5 sm:w-2 hover:bg-white/75"
                }`}
            />
          ))}
        </div>

        <button
          aria-label="Previous slide"
          onClick={() => handleNavigation(current - 1)}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/20 dark:border-neutral-950/35 dark:bg-neutral-950/20 text-white dark:text-neutral-950 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-neutral-950/30 backdrop-blur-sm"
        >
          <ChevronLeft className="dark:text-neutral-950" />
        </button>

        {/* Next Arrow */}
        {/* FIX: Ukuran tombol panah mengecil di mobile (w-8 h-8) dan posisi lebih rapat ke tepi (right-3) */}
        <button
          aria-label="Next slide"
          onClick={() => handleNavigation(current + 1)}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/20 text-white dark:border-neutral-950/35 dark:bg-neutral-950/20 dark:text-neutral-950 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 dark:hover:bg-neutral-950/30 cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 backdrop-blur-sm"
        >
          <ChevronRight className="dark:text-neutral-950" />
        </button>
      </div>
    </section>
  );
}