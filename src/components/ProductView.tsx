"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { type Product, products, productHref } from "@/data/products";
import { formatPrice, site } from "@/data/site";
import { photo } from "@/lib/asset";
import { useUI } from "./Providers";
import { ProductCarousel } from "./Carousel";
import { BookmarkIcon, ChevronDown, ChevronLeft, ChevronRight, CloseIcon, MinusIcon, PlusIcon } from "./Icons";

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[52px] w-full items-center justify-between text-left text-[15px] text-ink"
      >
        {title}
        {open ? <MinusIcon /> : <PlusIcon />}
      </button>
      <div className={`accordion-body ${open ? "is-open" : ""}`}>
        <div>
          <div className="pb-5 text-[14px] leading-relaxed text-muted">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProductView({ product }: { product: Product }) {
  const { open, requestCart, isFavorite, toggleFavorite } = useUI();
  const [size, setSize] = useState<string | null>(null);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const swipeRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const fav = isFavorite(product.id);
  const siblings = products.filter((p) => p.id !== product.id);

  // Подсветка активной миниатюры при прокрутке галереи (десктоп)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = imageRefs.current.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveImage(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    imageRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [product.id]);

  useEffect(() => {
    if (!sizeOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!sizeRef.current?.contains(e.target as Node)) setSizeOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [sizeOpen]);

  useEffect(() => {
    if (lightbox === null) return;
    const count = product.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + count) % count));
    };
    document.body.classList.add("scroll-locked");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox, product.images.length]);

  const addToCart = (chosen: string) => {
    setSheetOpen(false);
    requestCart({ productId: product.id, size: chosen });
  };

  const sizeButtons = (onPick: (value: string) => void) =>
    product.sizes.map((s) => (
      <button
        key={s.value}
        type="button"
        disabled={!s.available}
        onClick={() => onPick(s.value)}
        className={`flex h-11 items-center justify-center border text-[14px] transition-colors ${
          size === s.value
            ? "border-navy bg-navy text-white"
            : s.available
              ? "border-line text-ink hover:border-navy"
              : "border-line text-faint line-through"
        }`}
      >
        {s.value}
      </button>
    ));

  const c = site.contacts;

  return (
    <div className="page">
      <div className="md:grid md:grid-cols-2">
        {/* ---------- Галерея ---------- */}
        <div className="relative">
          {/* Телефон: горизонтальный свайп */}
          <div className="relative md:hidden">
            <div
              ref={swipeRef}
              className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
              onScroll={(e) => {
                const el = e.currentTarget;
                setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
              }}
            >
              {product.images.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  aria-label="Открыть фото на весь экран"
                  onClick={() => setLightbox(i)}
                  className="photo-stage aspect-[4/5] w-full shrink-0 snap-center"
                >
                  <img
                    src={photo(name).src}
                    alt={i === 0 ? product.name : ""}
                    className="photo object-top"
                    fetchPriority={i === 0 ? "high" : "auto"}
                  />
                </button>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-4 bottom-4 flex gap-1.5">
              {product.images.map((name, i) => (
                <span key={name} className={`h-[2px] flex-1 ${i === activeImage ? "bg-navy" : "bg-navy/20"}`} />
              ))}
            </div>
          </div>

          {/* Десктоп: вертикальная лента с миниатюрами */}
          <div className="hidden md:block">
            <div className="sticky z-10 h-0" style={{ top: "calc(var(--top-offset) + 16px)" }}>
              <div className="absolute left-4 top-0 flex flex-col gap-2">
                {product.images.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={`Фото ${i + 1}`}
                    onClick={() => imageRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className={`photo-stage h-[66px] w-[44px] outline-offset-2 transition-[outline-color] ${
                      i === activeImage ? "outline outline-1 outline-navy" : "outline outline-1 outline-transparent"
                    }`}
                  >
                    <img src={photo(name).small} alt="" className="photo" />
                  </button>
                ))}
              </div>
            </div>
            {product.images.map((name, i) => (
              <button
                key={name}
                type="button"
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                aria-label="Открыть фото на весь экран"
                onClick={() => setLightbox(i)}
                className="photo-stage block aspect-[2/3] w-full cursor-zoom-in scroll-mt-[var(--top-offset)]"
              >
                <img
                  src={photo(name).src}
                  alt={i === 0 ? product.name : ""}
                  className="photo"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Информация ---------- */}
        <div>
          <div
            className="container-x pb-10 pt-7 md:sticky md:mx-auto md:max-w-[520px] md:px-10 md:pb-16 md:pt-12"
            style={{ top: "var(--top-offset)" }}
          >
            <nav aria-label="Хлебные крошки" className="text-[12px] text-faint">
              <Link href="/" className="hover:text-ink">
                Главная
              </Link>
              <span className="mx-2">/</span>
              <Link href="/catalog/" className="hover:text-ink">
                Каталог
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">{product.colorName}</span>
            </nav>

            <div className="caps mt-6 text-muted">{product.season}</div>
            <h1 className="mt-2 font-serif text-[36px] leading-[1.08] text-navy md:text-[44px]">{product.name}</h1>
            <div className="mt-4 text-[22px] tracking-wide text-ink">{formatPrice(product.price)}</div>

            <p className={`mt-6 text-[15px] leading-[1.7] text-muted ${expanded ? "" : "line-clamp-3"}`}>
              {product.description}
            </p>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="link-underline mt-1 text-[13px] text-navy"
            >
              {expanded ? "свернуть" : "читать далее"}
            </button>

            {/* Цвета */}
            <div className="mt-8">
              <div className="text-[13px] text-muted">
                Цвет: <span className="text-ink">{product.colorName}</span>
              </div>
              <div className="mt-3 flex gap-3">
                {products.map((p) => {
                  const current = p.id === product.id;
                  return (
                    <Link
                      key={p.id}
                      href={productHref(p)}
                      aria-label={p.colorName}
                      aria-current={current ? "true" : undefined}
                      title={p.colorName}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                        current ? "border-navy" : "border-transparent hover:border-line"
                      }`}
                    >
                      <span className="h-7 w-7 rounded-full" style={{ background: p.colorHex }} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Размер и покупка — десктоп */}
            <div className="mt-8 hidden md:block">
              <div className="flex items-stretch gap-2">
                <div ref={sizeRef} className="relative flex-1">
                  <button
                    type="button"
                    aria-expanded={sizeOpen}
                    onClick={() => setSizeOpen((v) => !v)}
                    className="flex h-[52px] w-full items-center justify-between border border-navy px-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-navy"
                  >
                    {size ? `Размер ${size}` : "Выбрать размер"}
                    <ChevronDown className={`transition-transform ${sizeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {sizeOpen && (
                    <ul className="dropdown absolute inset-x-0 top-[calc(100%+4px)] z-20 border border-line bg-paper shadow-[0_16px_40px_rgba(14,24,40,0.12)]">
                      {product.sizes.map((s) => (
                        <li key={s.value} className="border-b border-line/70 last:border-0">
                          <button
                            type="button"
                            disabled={!s.available}
                            onClick={() => {
                              setSize(s.value);
                              setSizeOpen(false);
                            }}
                            className={`flex h-10 w-full items-center justify-between px-5 text-[14px] hover:bg-cream/70 ${
                              s.available ? "text-ink" : "text-faint"
                            } ${size === s.value ? "font-semibold" : ""}`}
                          >
                            {s.value}
                            {!s.available && <span className="text-[12px]">нет в наличии</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
                  aria-pressed={fav}
                  onClick={() => toggleFavorite(product.id)}
                  className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center border transition-colors ${
                    fav ? "border-navy bg-navy text-white" : "border-line text-navy hover:border-navy"
                  }`}
                >
                  <BookmarkIcon filled={fav} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => (size ? addToCart(size) : setSizeOpen(true))}
                className="btn btn-primary mt-2 h-[56px] w-full"
              >
                В корзину
              </button>
              <button type="button" onClick={() => open("sizes")} className="link-underline mt-4 text-[12px] text-muted">
                Как узнать свой размер?
              </button>
            </div>

            <div className="mt-6 md:hidden">
              <button type="button" onClick={() => open("sizes")} className="link-underline text-[13px] text-muted">
                Как узнать свой размер?
              </button>
            </div>

            {/* Аккордеоны */}
            <div className="mt-8 border-t border-line">
              <Accordion title="Детали" defaultOpen>
                <dl className="space-y-2">
                  {product.details.map((d) => (
                    <div key={d.label} className="flex justify-between gap-6">
                      <dt className="font-medium text-ink">{d.label}</dt>
                      <dd className="text-right">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              </Accordion>
              <Accordion title="Посадка и уход">
                <p>
                  Прямой силуэт, свободная посадка, длина до линии бедра. Рекомендуем бережную сухую чистку;
                  фактуру можно освежить мягкой щёткой для одежды.
                </p>
              </Accordion>
              <Accordion title="Наличие и покупка">
                <p>
                  Онлайн-заказ скоро откроется. Сейчас куртку можно примерить и купить в магазине {site.name}:{" "}
                  {c.city}, {c.address}. {c.hours}.
                </p>
                <Link href="/contacts/" className="link-underline mt-3 inline-block text-navy">
                  Как нас найти
                </Link>
              </Accordion>
              <Accordion title="Задать вопрос">
                <p>
                  Поможем с размером и наличием: {c.phoneHref ? <a href={c.phoneHref}>{c.phone}</a> : c.phone}.
                </p>
                {c.telegram && (
                  <a href={c.telegram} target="_blank" rel="noreferrer" className="link-underline mt-3 inline-block text-navy">
                    Написать в Telegram
                  </a>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <ProductCarousel title="Другие оттенки" products={siblings} moreHref="/catalog/" moreLabel="Весь каталог" />

      {/* ---------- Телефон: нижняя панель покупки ---------- */}
      <div className="h-[76px] md:hidden" />
      <div
        className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur md:hidden"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        <button type="button" onClick={() => setSheetOpen(true)} className="btn btn-primary h-[52px] flex-1 justify-between px-5">
          <span>{size ? `В корзину · ${size}` : "Выбрать размер"}</span>
          <span className="font-medium tracking-wide">{formatPrice(product.price)}</span>
        </button>
        <button
          type="button"
          aria-label={fav ? "Убрать из избранного" : "Добавить в избранное"}
          aria-pressed={fav}
          onClick={() => toggleFavorite(product.id)}
          className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center border ${
            fav ? "border-navy bg-navy text-white" : "border-line text-navy"
          }`}
        >
          <BookmarkIcon filled={fav} />
        </button>
      </div>

      {/* Телефон: выбор размера */}
      <div
        className={`backdrop md:hidden ${sheetOpen ? "is-open" : ""}`}
        onClick={() => setSheetOpen(false)}
        aria-hidden="true"
      />
      <div className={`sheet md:hidden ${sheetOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Выбор размера" inert={!sheetOpen}>
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line" />
        <div className="flex items-center justify-between px-5 pt-3">
          <div className="font-serif text-[26px] text-navy">Выберите размер</div>
          <button type="button" aria-label="Закрыть" className="icon-btn -mr-2" onClick={() => setSheetOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 pt-4">{sizeButtons(setSize)}</div>
        <div className="px-5 pb-5 pt-5">
          <button type="button" disabled={!size} onClick={() => size && addToCart(size)} className="btn btn-primary w-full">
            Добавить в корзину
          </button>
        </div>
      </div>

      {/* ---------- Просмотр фото на весь экран ---------- */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[90] flex flex-col bg-cream" role="dialog" aria-modal="true" aria-label="Фото товара">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-[12px] tracking-[0.2em] text-navy">
              {String(lightbox + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}
            </div>
            <button
              type="button"
              aria-label="Закрыть"
              onClick={() => setLightbox(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="photo-stage relative min-h-0 flex-1">
            <img src={photo(product.images[lightbox]).src} alt={product.name} className="photo !object-contain" />
            <button
              type="button"
              aria-label="Предыдущее фото"
              onClick={() => setLightbox((lightbox - 1 + product.images.length) % product.images.length)}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white md:left-8"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Следующее фото"
              onClick={() => setLightbox((lightbox + 1) % product.images.length)}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-white md:right-8"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="flex justify-center gap-2 py-4">
            {product.images.map((name, i) => (
              <button
                key={name}
                type="button"
                aria-label={`Фото ${i + 1}`}
                onClick={() => setLightbox(i)}
                className={`photo-stage h-[60px] w-[40px] outline outline-1 outline-offset-2 ${
                  i === lightbox ? "outline-navy" : "outline-transparent"
                }`}
              >
                <img src={photo(name).small} alt="" className="photo" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
