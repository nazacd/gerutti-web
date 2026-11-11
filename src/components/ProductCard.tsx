"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { type Product, productHref } from "@/data/products";
import { formatPrice } from "@/data/site";
import { photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { BookmarkIcon } from "./Icons";

/**
 * Карточка товара. На десктопе фото переключаются при движении курсора
 * по горизонтали, на телефоне — свайпом. Внизу — полоски-индикаторы.
 */
export function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw" }: { product: Product; sizes?: string }) {
  const { isFavorite, toggleFavorite } = useUI();
  const [index, setIndex] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = product.images.length;
  const fav = isFavorite(product.id);

  return (
    <article className="group relative">
      <Link href={productHref(product)} className="block" aria-label={product.name}>
        <div
          className="photo-stage aspect-[2/3]"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const zone = Math.floor(((e.clientX - rect.left) / rect.width) * count);
            setIndex(Math.max(0, Math.min(count - 1, zone)));
          }}
          onMouseLeave={() => setIndex(0)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 30) return;
            setIndex((i) => (dx < 0 ? Math.min(count - 1, i + 1) : Math.max(0, i - 1)));
          }}
        >
          {product.images.map((name, i) => {
            const img = photo(name);
            return (
              <img
                key={name}
                src={img.small}
                srcSet={img.srcSet}
                sizes={sizes}
                alt={i === 0 ? product.name : ""}
                loading="lazy"
                className={`photo absolute inset-0 transition-opacity duration-300 ${
                  i === index ? "opacity-100" : "opacity-0"
                }`}
              />
            );
          })}

          {product.isNew && (
            <span className="absolute left-3 top-3 border border-navy/70 px-2.5 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.1em] text-navy">
              New
            </span>
          )}

          <div className="absolute inset-x-3 bottom-3 flex gap-1 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
            {product.images.map((name, i) => (
              <span
                key={name}
                className={`h-[2px] flex-1 transition-colors duration-300 ${i === index ? "bg-navy" : "bg-navy/20"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink md:text-[14px]">{product.name}</h3>
            <div className="mt-1 text-[13px] tracking-wide text-muted md:text-[14px]">{formatPrice(product.price)}</div>
          </div>
          <span
            className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: product.colorHex }}
            title={product.colorName}
          />
        </div>
      </Link>

      <button
        type="button"
        aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
        aria-pressed={fav}
        onClick={() => toggleFavorite(product.id)}
        className={`absolute right-2.5 top-2.5 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          fav ? "bg-navy text-white" : "bg-white/85 text-navy hover:bg-white"
        }`}
      >
        <BookmarkIcon width={16} height={16} filled={fav} />
      </button>
    </article>
  );
}
