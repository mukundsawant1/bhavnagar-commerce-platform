"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type HeroCarouselSlide = {
  remoteSrc: string;
  localSrc: string;
  label: string;
  headline: string;
  subtext: string;
};

type HeroCarouselProps = {
  dictionary: {
    heroSlide1Headline: string;
    heroSlide1Subtext: string;
    heroSlide2Headline: string;
    heroSlide2Subtext: string;
    heroSlide3Headline: string;
    heroSlide3Subtext: string;
  };
};

const defaultSlides: HeroCarouselSlide[] = [
  {
    remoteSrc: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80",
    localSrc: "/img/slide-farm-1.svg",
    label: "Indian farm field and workers",
    headline: "Farm + Admin + Buyer: Real-time link",
    subtext: "Verified farm harvest, quality checks, and bulk flow",
  },
  {
    remoteSrc: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=1600&q=80",
    localSrc: "/img/slide-veg-2.svg",
    label: "Farm vegetables for bulk buyers",
    headline: "Vegetables from verified farms",
    subtext: "Bulk supply, stock availabilities, and dispatch clarity",
  },
  {
    remoteSrc: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1600&q=80",
    localSrc: "/img/slide-fruit-3.svg",
    label: "Indian fruit crate, quality selected",
    headline: "Fresh Indian fruits for bulk orders",
    subtext: "Seasonal, safe, and admin-approved delivery",
  },
];

export default function HeroCarousel({ dictionary }: HeroCarouselProps) {
  const slides = useMemo<HeroCarouselSlide[]>(
    () => [
      {
        ...defaultSlides[0],
        headline: dictionary.heroSlide1Headline,
        subtext: dictionary.heroSlide1Subtext,
      },
      {
        ...defaultSlides[1],
        headline: dictionary.heroSlide2Headline,
        subtext: dictionary.heroSlide2Subtext,
      },
      {
        ...defaultSlides[2],
        headline: dictionary.heroSlide3Headline,
        subtext: dictionary.heroSlide3Subtext,
      },
    ],
    [dictionary]
  );

  const [active, setActive] = useState(0);
  const [useLocal, setUseLocal] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((idx) => (idx + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleImageError = (index: number) => {
    setUseLocal((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-lg lg:h-[480px]">
      {slides.map((slide, idx) => (
        <div
          key={`${slide.remoteSrc}-${idx}`}
          className={`absolute inset-0 transition-opacity duration-1200 ${idx === active ? "opacity-100" : "opacity-0"}`}
          aria-hidden={idx !== active}
        >
          <Image
            src={useLocal[idx] ? slide.localSrc : slide.remoteSrc}
            alt={slide.label}
            fill
            className="object-cover"
            onError={() => handleImageError(idx)}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

          <div className="absolute left-4 top-1/4 max-w-xl space-y-3 p-3 text-white sm:left-8 sm:p-6">
            <span className="rounded-full bg-emerald-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              Bulk Fruits & Vegetables Platform
            </span>
            <h1 className="text-2xl font-black sm:text-4xl">{slide.headline}</h1>
            <p className="max-w-lg text-sm sm:text-base text-slate-100">{slide.subtext}</p>
          </div>
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-4 z-20 mx-auto flex max-w-lg justify-center gap-3 rounded-full bg-black/40 p-2 backdrop-blur-md">
        <a href="/shop" className="rounded-md bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-900 transition hover:bg-emerald-300 sm:px-5 sm:text-sm">
          Place Bulk Order
        </a>
        <a href="/farm" className="rounded-md border border-white/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm">
          Farm Owner Desk
        </a>
        <a href="/admin" className="rounded-md border border-white/80 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20 sm:px-5 sm:text-sm">
          Open Admin Queue
        </a>
      </div>

      <div className="absolute bottom-14 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, dot) => (
          <button
            key={`dot-${dot}`}
            onClick={() => setActive(dot)}
            className={`h-2.5 w-2.5 rounded-full transition-all ${active === dot ? "bg-emerald-300" : "bg-white/60 hover:bg-white"}`}
            aria-label={`Slide ${dot + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
