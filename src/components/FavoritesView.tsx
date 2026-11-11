"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { useUI } from "./Providers";
import { BookmarkIcon } from "./Icons";

export function FavoritesView() {
  const { favorites } = useUI();
  const list = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="page">
      <div className="container-x pb-20 pt-6 md:pb-28 md:pt-8">
        <nav aria-label="Хлебные крошки" className="text-[13px] text-faint">
          <Link href="/" className="hover:text-ink">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Избранное</span>
        </nav>

        <div className="mt-5 flex items-baseline gap-3">
          <h1 className="font-serif text-[40px] leading-none text-navy md:text-[52px]">Избранное</h1>
          {list.length > 0 && <span className="text-[14px] text-faint">{list.length}</span>}
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-navy">
              <BookmarkIcon width={24} height={24} />
            </div>
            <h2 className="mt-6 font-serif text-[30px] text-navy">Здесь пока ничего нет</h2>
            <p className="mt-3 max-w-[320px] text-[14px] leading-relaxed text-muted">
              Нажмите на закладку на карточке товара, чтобы сохранить понравившуюся вещь.
            </p>
            <Link href="/catalog/" className="btn btn-primary mt-7">
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 md:gap-x-4 md:gap-y-12 lg:grid-cols-4">
            {list.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
