"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { nav, site, formatPrice } from "@/data/site";
import { products, productHref, sizeTable } from "@/data/products";
import { photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { BagIcon, BookmarkIcon, CloseIcon, SearchIcon } from "./Icons";

function Drawer({
  open,
  side,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  side: "left" | "right";
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <aside
      className={`drawer drawer-${side} ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-line px-5">
        <div className="caps text-navy">{title}</div>
        <button type="button" aria-label="Закрыть" className="icon-btn -mr-2" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      {footer && <div className="shrink-0 border-t border-line p-5">{footer}</div>}
    </aside>
  );
}

/* ---------------- Меню ---------------- */

function MenuDrawer() {
  const { panel, close } = useUI();
  const c = site.contacts;
  return (
    <Drawer open={panel === "menu"} side="left" title={site.wordmark} onClose={close}>
      <nav className="px-5 py-6" aria-label="Меню">
        <ul>
          {[{ label: "Главная", href: "/" }, ...nav, { label: "Избранное", href: "/favorites/" }].map((item) => (
            <li key={item.href} className="border-b border-line/70">
              <Link
                href={item.href}
                onClick={close}
                className="flex items-center justify-between py-4 font-serif text-[26px] leading-none text-navy transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <div className="kicker mb-4 text-muted">Оттенки коллекции</div>
          <ul className="space-y-1">
            {products.map((p) => (
              <li key={p.id}>
                <Link
                  href={productHref(p)}
                  onClick={close}
                  className="flex items-center gap-3 py-2 text-[15px] text-ink transition-opacity hover:opacity-60"
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: p.colorHex }} />
                  {p.colorName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 space-y-1 text-[13px] text-muted">
          <div className="kicker mb-3">Магазин</div>
          <p>
            {c.city}, {c.address}
          </p>
          <p>{c.hours}</p>
          <p>{c.phoneHref ? <a href={c.phoneHref}>{c.phone}</a> : c.phone}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 pt-3 text-ink">
            {c.telegram && (
              <a href={c.telegram} target="_blank" rel="noreferrer" className="link-underline">
                Написать в Telegram
              </a>
            )}
            {c.instagram && (
              <a href={c.instagram} target="_blank" rel="noreferrer" className="link-underline">
                Instagram
              </a>
            )}
          </div>
        </div>
      </nav>
    </Drawer>
  );
}

/* ---------------- Корзина (временно недоступна) ---------------- */

function CartDrawer() {
  const { panel, close, cartIntent, isFavorite, toggleFavorite } = useUI();
  const product = cartIntent ? products.find((p) => p.id === cartIntent.productId) : undefined;

  return (
    <Drawer
      open={panel === "cart"}
      side="right"
      title="Корзина"
      onClose={close}
      footer={
        <div className="space-y-3">
          {site.contacts.telegram && (
            <a href={site.contacts.telegram} target="_blank" rel="noreferrer" className="btn btn-primary w-full">
              Написать в Telegram
            </a>
          )}
          <Link
            href="/contacts/"
            onClick={close}
            className={`btn w-full ${site.contacts.telegram ? "btn-outline" : "btn-primary"}`}
          >
            Как нас найти
          </Link>
          {!site.contacts.telegram && (
            <Link href="/catalog/" onClick={close} className="btn btn-outline w-full">
              Перейти в каталог
            </Link>
          )}
        </div>
      }
    >
      <div className="px-5 py-8">
        {product && cartIntent && (
          <div className="mb-8 flex gap-4 border-b border-line pb-8">
            <div className="photo-stage h-[132px] w-[88px] shrink-0">
              <img src={photo(product.images[0]).small} alt="" className="photo" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="kicker text-muted">Вы выбрали</div>
              <div className="mt-2 text-[15px] font-medium leading-snug text-ink">{product.name}</div>
              <div className="mt-1 text-[13px] text-muted">Размер {cartIntent.size}</div>
              <div className="mt-2 text-[15px] text-ink">{formatPrice(product.price)}</div>
              {!isFavorite(product.id) && (
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  className="link-underline mt-3 inline-flex items-center gap-2 text-[12px] text-navy"
                >
                  <BookmarkIcon width={14} height={14} /> Сохранить в избранное
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-line text-navy">
            <BagIcon width={24} height={24} />
          </div>
          <h2 className="mt-6 font-serif text-[30px] leading-tight text-navy">
            Онлайн-заказ
            <br />
            скоро откроется
          </h2>
          <p className="mt-4 max-w-[300px] text-[14px] leading-relaxed text-muted">
            Мы готовим оформление заказа и доставку. А пока напишите нам в Telegram или приходите на примерку в
            магазин.
          </p>
          <div className="mt-6 text-[13px] leading-relaxed text-ink">
            <div>
              {site.contacts.city}, {site.contacts.address}
            </div>
            <div className="text-muted">{site.contacts.hours}</div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

/* ---------------- Таблица размеров ---------------- */

function SizeDrawer() {
  const { panel, close } = useUI();
  return (
    <Drawer open={panel === "sizes"} side="right" title="Таблица размеров" onClose={close}>
      <div className="px-5 py-7">
        <p className="text-[14px] leading-relaxed text-muted">
          Измерьте обхват груди и талии сантиметровой лентой и сравните с таблицей. Если значения попадают между
          размерами, для свободной посадки выбирайте больший.
        </p>
        <table className="mt-6 w-full border-collapse text-[14px]">
          <thead>
            <tr className="border-b border-navy text-left">
              <th className="caps py-3 pr-3 font-semibold text-navy">Размер</th>
              <th className="caps py-3 pr-3 font-semibold text-navy">Грудь, см</th>
              <th className="caps py-3 font-semibold text-navy">Талия, см</th>
            </tr>
          </thead>
          <tbody>
            {sizeTable.map((row) => (
              <tr key={row.size} className="border-b border-line">
                <td className="py-3 pr-3 font-semibold text-navy">{row.size}</td>
                <td className="py-3 pr-3 text-ink">{row.chest}</td>
                <td className="py-3 text-ink">{row.waist}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-[13px] leading-relaxed text-muted">
          Сомневаетесь в размере? Приходите на примерку — поможем подобрать посадку.
        </p>
      </div>
    </Drawer>
  );
}

/* ---------------- Поиск ---------------- */

function SearchOverlay() {
  const { panel, close } = useUI();
  const isOpen = panel === "search";
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.name, p.colorName, p.category, p.id].some((field) => field.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[70] max-h-[100svh] overflow-y-auto bg-paper shadow-[0_20px_60px_rgba(14,24,40,0.18)] transition-[transform,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isOpen ? "visible translate-y-0" : "invisible -translate-y-full"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Поиск"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="container-x mx-auto max-w-[1200px] py-5 md:py-8">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по каталогу"
              aria-label="Поиск по каталогу"
              className="h-12 w-full border-b border-navy bg-transparent pl-9 pr-3 font-serif text-[24px] text-navy outline-none placeholder:text-faint md:text-[28px]"
            />
          </div>
          <button type="button" className="caps px-2 py-3 text-navy hover:opacity-60" onClick={close}>
            Закрыть
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="kicker mr-2 text-muted">Часто ищут</span>
          {["Куртка", ...products.map((p) => p.colorName)].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink transition-colors hover:border-navy"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="mt-7 pb-4">
          {results.length === 0 ? (
            <p className="py-10 text-center text-[15px] text-muted">
              По запросу «{query}» ничего не нашлось. Попробуйте название оттенка.
            </p>
          ) : (
            <>
              <div className="mb-4 text-[13px] text-muted">
                {query.trim() ? `Найдено: ${results.length}` : "Вся коллекция"}
              </div>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link href={productHref(p)} onClick={close} className="tile group block">
                      <div className="photo-stage aspect-[2/3]">
                        <img src={photo(p.images[0]).small} alt={p.name} className="photo" loading="lazy" />
                      </div>
                      <div className="mt-2.5 truncate text-[13px] font-medium text-ink">{p.name}</div>
                      <div className="text-[13px] text-muted">{formatPrice(p.price)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Уведомление ---------------- */

function Toast() {
  const { toast } = useUI();
  if (!toast) return null;
  return (
    <div
      key={toast}
      role="status"
      className="toast fixed right-4 z-[80] flex items-center gap-3 bg-navy px-5 py-3.5 text-[13px] text-white shadow-xl"
      style={{ top: "calc(var(--top-offset) + 12px)" }}
    >
      {toast}
      <Link href="/favorites/" className="link-underline text-cream">
        Открыть
      </Link>
    </div>
  );
}

export function Overlays() {
  const { panel, close } = useUI();
  return (
    <>
      <div className={`backdrop ${panel ? "is-open" : ""}`} onClick={close} aria-hidden="true" />
      <MenuDrawer />
      <CartDrawer />
      <SizeDrawer />
      <SearchOverlay />
      <Toast />
    </>
  );
}
