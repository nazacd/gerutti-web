"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { nav, site } from "@/data/site";
import { useUI } from "./Providers";
import { BagIcon, BookmarkIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";

/* ---- Промо-полоса: закрывается до конца сессии ---- */

const PROMO_KEY = "gerutti-promo-closed";
const promoListeners = new Set<() => void>();

function promoVisible(): boolean {
  try {
    return window.sessionStorage.getItem(PROMO_KEY) !== "1";
  } catch {
    return true;
  }
}

function subscribePromo(l: () => void) {
  promoListeners.add(l);
  return () => {
    promoListeners.delete(l);
  };
}

function closePromo() {
  try {
    window.sessionStorage.setItem(PROMO_KEY, "1");
  } catch {
    /* ignore */
  }
  promoListeners.forEach((l) => l());
}

export function Header() {
  const pathname = usePathname();
  const { open, favorites } = useUI();
  const showPromo = useSyncExternalStore(subscribePromo, promoVisible, () => true);
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("has-promo", showPromo);
  }, [showPromo]);

  // Над первым экраном главной шапка прозрачная, дальше — плотная
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      setOverHero(!!hero && window.scrollY < 12);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  const favCount = favorites.length;

  return (
    <>
      {showPromo && (
        <div className="fixed inset-x-0 top-0 z-50 flex h-[38px] items-center justify-center bg-navy-deep px-10 text-center text-[12px] text-cream/90">
          <Link href="/contacts/" className="truncate tracking-wide hover:text-white">
            <span className="sm:hidden">Онлайн-заказ скоро · коллекция уже в магазине</span>
            <span className="hidden sm:inline">Онлайн-заказ скоро откроется — коллекция уже доступна в магазине</span>
          </Link>
          <button
            type="button"
            aria-label="Закрыть баннер"
            onClick={closePromo}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-cream/70 hover:text-white"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      )}

      <header
        className={`site-header fixed inset-x-0 z-40 h-[var(--header-h)] text-navy transition-[background-color,border-color,color] duration-500 ${
          overHero
            ? "is-over-hero border-b border-transparent bg-transparent"
            : "border-b border-line/80 bg-paper/90 backdrop-blur-md"
        }`}
        style={{ top: "var(--promo-h)" }}
      >
        <div className="relative flex h-full items-center justify-between px-2 md:px-5">
          <div className="flex items-center gap-1 md:gap-4">
            <button type="button" aria-label="Меню" className="icon-btn" onClick={() => open("menu")}>
              <MenuIcon />
            </button>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Основная навигация">
              {nav.map((item) => {
                const active = pathname.startsWith(item.href.replace(/\/$/, ""));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`caps relative py-1 transition-opacity hover:opacity-60 ${
                      active ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href="/"
            aria-label={`${site.name} — на главную`}
            className="wordmark absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[21px] md:text-[23px]"
          >
            {site.wordmark}
          </Link>

          <div className="flex items-center">
            <button type="button" aria-label="Поиск" className="icon-btn" onClick={() => open("search")}>
              <SearchIcon />
            </button>
            <Link href="/favorites/" aria-label="Избранное" className="icon-btn relative">
              <BookmarkIcon />
              {favCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-navy px-1 text-[9px] font-semibold leading-none text-white">
                  {favCount}
                </span>
              )}
            </Link>
            <button type="button" aria-label="Корзина" className="icon-btn" onClick={() => open("cart")}>
              <BagIcon />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
