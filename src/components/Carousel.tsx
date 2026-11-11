"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "./Icons";

export function ProductCarousel({
  title,
  products,
  moreHref,
  moreLabel = "Смотреть все",
}: {
  title: string;
  products: Product[];
  moreHref?: string;
  moreLabel?: string;
}) {
  const track = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 16), behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container-x flex items-end justify-between gap-4">
        <h2 className="font-serif text-[34px] leading-none text-navy md:text-[44px]">{title}</h2>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            aria-label="Назад"
            onClick={() => scroll(-1)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition-colors hover:border-navy md:flex"
          >
            <ChevronLeft width={16} height={16} />
          </button>
          <button
            type="button"
            aria-label="Вперёд"
            onClick={() => scroll(1)}
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-line text-navy transition-colors hover:border-navy md:flex"
          >
            <ChevronRight width={16} height={16} />
          </button>
          {moreHref && (
            <Link href={moreHref} className="caps link-underline ml-2 text-navy">
              {moreLabel}
            </Link>
          )}
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-2 md:mt-10"
        style={{ scrollPaddingLeft: "var(--gutter)" }}
      >
        {products.map((p) => (
          <div key={p.id} data-card className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[23.5vw]">
            <ProductCard product={p} sizes="(min-width: 1024px) 24vw, 68vw" />
          </div>
        ))}
        {moreHref && (
          <Link
            href={moreHref}
            data-card
            className="group flex aspect-[2/3] w-[68vw] shrink-0 snap-start flex-col items-center justify-center bg-navy text-cream sm:w-[42vw] lg:w-[23.5vw]"
          >
            <span className="kicker text-cream/60">Каталог</span>
            <span className="mt-4 font-serif text-[32px] leading-none">Вся коллекция</span>
            <ArrowRight className="mt-6 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        )}
      </div>
    </section>
  );
}
