"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const slides = [
  { id: "slide-1", src: "/assets/img/hero-image1.png", alt: "Hero slide 1", title: "Decoration", subtitle: "Hiasan untuk mempercantik rumah anda" },
  { id: "slide-2", src: "/assets/img/hero-image2.jpg", alt: "Hero slide 2", title: "Accessories", subtitle: "Aksesoris lucu yang menawan" },
  { id: "slide-3", src: "/assets/img/hero-image3.jpg", alt: "Hero slide 3", title: "Stuffed Toys", subtitle: "Boneka rajut yang imut" },
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
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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

            {/* Content */}
            {/* FIX: Padding bottom diatur dinamis (bottom-10 di mobile, bottom-16 di desktop) */}
            <div className="absolute bottom-10 md:bottom-16 left-1/2 -translate-x-1/2 z-30 text-center text-white w-full px-6 pointer-events-none">
              {/* FIX: Ukuran teks adaptif menggunakan text-2xl di mobile hingga text-5xl di layar besar */}
              <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl md:text-[2.5rem] lg:text-5xl font-bold leading-tight tracking-[-0.01em] text-white drop-shadow-lg mb-2">
                {slide.title}
              </h1>
              {/* FIX: Teks deskripsi mengecil di mobile (text-xs) agar tidak memakan tempat */}
              <p className="text-xs sm:text-sm tracking-wide text-white/90 drop-shadow max-w-xs sm:max-w-md mx-auto">
                {slide.subtitle}
              </p>
            </div>
          </div>
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
              className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 ${
                i === current ? "bg-white w-5 sm:w-7" : "bg-white/50 w-1.5 sm:w-2 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Prev Arrow */}
        {/* FIX: Ukuran tombol panah mengecil di mobile (w-8 h-8) dan posisi lebih rapat ke tepi (left-3) */}
        <button
          aria-label="Previous slide"
          onClick={() => handleNavigation(current - 1)}
          className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/20 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next Arrow */}
        {/* FIX: Ukuran tombol panah mengecil di mobile (w-8 h-8) dan posisi lebih rapat ke tepi (right-3) */}
        <button
          aria-label="Next slide"
          onClick={() => handleNavigation(current + 1)}
          className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border border-white/35 bg-white/20 text-white cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-white/30 backdrop-blur-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}