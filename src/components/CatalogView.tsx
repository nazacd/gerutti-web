"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { allSizes, products } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { useUI } from "./Providers";
import { CheckIcon, ChevronDown, GridIcon } from "./Icons";

type Sort = "default" | "name" | "name-desc";

const sortLabels: Record<Sort, string> = {
  default: "По умолчанию",
  name: "По алфавиту, А–Я",
  "name-desc": "По алфавиту, Я–А",
};

const VIEW_KEY = "gerutti-catalog-view";

function Dropdown({
  label,
  active,
  align = "left",
  children,
}: {
  label: string;
  active?: boolean;
  align?: "left" | "center" | "right";
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-1.5 whitespace-nowrap rounded-[3px] px-2 text-[13px] text-ink transition-colors sm:gap-2 sm:px-3 sm:text-[14px] ${
          open ? "bg-cream" : "hover:bg-cream/60"
        }`}
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-navy" />}
        {label}
        <ChevronDown className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div
          className={`dropdown absolute top-[calc(100%+6px)] z-30 min-w-[240px] border border-line bg-paper p-4 shadow-[0_16px_40px_rgba(14,24,40,0.12)] ${
            align === "right" ? "right-0" : align === "center" ? "left-1/2 -ml-[120px] sm:left-0 sm:ml-0" : "left-0"
          }`}
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function CatalogView() {
  const { open: openPanel } = useUI();
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("default");
  const [cols, setCols] = useState<2 | 3 | 4>(4);

  useEffect(() => {
    try {
      const saved = Number(window.localStorage.getItem(VIEW_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- читаем сохранённый вид после гидратации
      if (saved === 2 || saved === 3 || saved === 4) setCols(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const changeCols = (n: 2 | 3 | 4) => {
    setCols(n);
    try {
      window.localStorage.setItem(VIEW_KEY, String(n));
    } catch {
      /* ignore */
    }
  };

  const toggle = (list: string[], value: string) =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const visible = useMemo(() => {
    let list = products.filter(
      (p) =>
        (colors.length === 0 || colors.includes(p.id)) &&
        (sizes.length === 0 || p.sizes.some((s) => s.available && sizes.includes(s.value))),
    );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "ru"));
    else if (sort === "name-desc") list = [...list].sort((a, b) => b.name.localeCompare(a.name, "ru"));
    else list = [...list].sort((a, b) => a.order - b.order);
    return list;
  }, [colors, sizes, sort]);

  const hasFilters = colors.length > 0 || sizes.length > 0;
  const reset = () => {
    setColors([]);
    setSizes([]);
  };

  const gridClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 lg:grid-cols-4";

  const plural = (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
    return "товаров";
  };

  return (
    <div className="page">
      <div className="container-x pt-6 md:pt-8">
        <nav aria-label="Хлебные крошки" className="text-[13px] text-faint">
          <Link href="/" className="hover:text-ink">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">Каталог</span>
        </nav>

        <div className="mt-5 flex items-baseline gap-3">
          <h1 className="font-serif text-[40px] leading-none text-navy md:text-[52px]">Каталог</h1>
          <span className="text-[14px] text-faint">
            {visible.length} {plural(visible.length)}
          </span>
        </div>
      </div>

      <div
        className="sticky z-20 mt-5 border-y border-line bg-paper/95 backdrop-blur"
        style={{ top: "var(--top-offset)" }}
      >
        <div className="container-x flex items-center justify-between gap-2 py-1.5">
          <div className="-ml-2 flex items-center sm:-ml-3">
            <Dropdown label="Цвет" active={colors.length > 0}>
              {() => (
                <ul className="space-y-0.5">
                  {products.map((p) => {
                    const on = colors.includes(p.id);
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => setColors((c) => toggle(c, p.id))}
                          className="flex w-full items-center gap-3 px-1 py-2 text-left text-[14px] text-ink hover:opacity-70"
                        >
                          <span className="h-[3px] w-5" style={{ background: p.colorHex }} />
                          <span className={on ? "font-semibold" : ""}>{p.colorName}</span>
                          {on && <CheckIcon className="ml-auto text-navy" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Dropdown>

            <Dropdown label="Размер" active={sizes.length > 0}>
              {(close) => (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {allSizes.map((s) => {
                      const on = sizes.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSizes((list) => toggle(list, s))}
                          className={`flex h-9 w-11 items-center justify-center border text-[13px] transition-colors ${
                            on ? "border-navy bg-navy text-white" : "border-line text-ink hover:border-navy"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      openPanel("sizes");
                    }}
                    className="link-underline mt-4 text-[12px] text-navy"
                  >
                    Таблица размеров
                  </button>
                </div>
              )}
            </Dropdown>

            <Dropdown label="Сортировка" active={sort !== "default"} align="center">
              {(close) => (
                <ul>
                  {(Object.keys(sortLabels) as Sort[]).map((key) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          setSort(key);
                          close();
                        }}
                        className="flex w-full items-center justify-between gap-6 px-1 py-2 text-left text-[14px] text-ink hover:opacity-70"
                      >
                        <span className={sort === key ? "font-semibold" : ""}>{sortLabels[key]}</span>
                        {sort === key && <CheckIcon className="text-navy" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Dropdown>

            {hasFilters && (
              <button type="button" onClick={reset} className="link-underline ml-3 hidden text-[13px] text-muted sm:block">
                Сбросить
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center" role="group" aria-label="Вид каталога">
            {([4, 3, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} в ряд`}
                aria-pressed={cols === n}
                onClick={() => changeCols(n)}
                className={`h-9 w-9 items-center justify-center transition-colors ${
                  n === 3 ? "hidden lg:flex" : "flex"
                } ${cols === n ? "text-navy" : "text-faint hover:text-ink"}`}
              >
                <GridIcon cols={n} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x pb-20 pt-6 md:pb-28 md:pt-8">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <h2 className="font-serif text-[30px] text-navy">Ничего не найдено</h2>
            <p className="mt-3 text-[14px] text-muted">Попробуйте изменить фильтры.</p>
            <button type="button" onClick={reset} className="btn btn-primary mt-7">
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className={`grid gap-x-3 gap-y-9 md:gap-x-4 md:gap-y-12 ${gridClass}`}>
            {visible.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                sizes={cols === 2 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
