import Link from "next/link";
import { nav, site } from "@/data/site";
import { products, productHref } from "@/data/products";

export function Footer() {
  const c = site.contacts;
  const socials = [
    c.instagram && { label: "Instagram", href: c.instagram },
    c.telegramChannel && { label: "Telegram-канал", href: c.telegramChannel },
    c.telegram && { label: "Написать в Telegram", href: c.telegram },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="bg-navy-deep text-cream/60">
      <div className="container-x border-b border-white/10 py-14 md:py-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="kicker text-cream/50">{site.wordmark}</div>
            <h2 className="mt-4 max-w-[560px] font-serif text-[34px] leading-[1.1] text-cream md:text-[44px]">
              Приходите на примерку — коллекция уже в магазине
            </h2>
          </div>
          <Link href="/contacts/" className="btn btn-light shrink-0">
            Как нас найти
          </Link>
        </div>
      </div>

      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4 md:py-16">
        <div className="col-span-2 md:col-span-1">
          <div className="wordmark text-[26px] text-cream">{site.wordmark}</div>
          <div className="kicker mt-2 text-cream/50">{site.established}</div>
          <p className="mt-5 max-w-[260px] text-[13px] leading-relaxed">
            {site.tagline}. Повседневная и классическая мужская одежда.
          </p>
        </div>

        <div>
          <div className="caps mb-4 text-cream/80">Навигация</div>
          <ul className="space-y-2.5 text-[14px]">
            {[...nav, { label: "Избранное", href: "/favorites/" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="caps mb-4 text-cream/80">Коллекция</div>
          <ul className="space-y-2.5 text-[14px]">
            {products.map((p) => (
              <li key={p.id}>
                <Link href={productHref(p)} className="transition-colors hover:text-white">
                  {p.colorName}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <div className="caps mb-4 text-cream/80">Магазин</div>
          <ul className="space-y-2.5 text-[14px]">
            <li>
              {c.city}, {c.address}
            </li>
            <li>{c.hours}</li>
            <li className="pt-1 font-serif text-[24px] leading-none text-cream">
              {c.phoneHref ? <a href={c.phoneHref}>{c.phone}</a> : c.phone}
            </li>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] md:flex-row md:items-center md:justify-between">
        <div>
          © {new Date().getFullYear()} {site.name}. Все права защищены.
        </div>
        <div className="text-cream/40">{site.season}</div>
      </div>
    </footer>
  );
}
