import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";
import { photo } from "@/lib/asset";
import { ClockIcon, PhoneIcon, PinIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Магазин ${site.name}: адрес, часы работы и телефон.`,
};

export default function ContactsPage() {
  const c = site.contacts;
  const links = [
    c.mapUrl && { label: "Построить маршрут", href: c.mapUrl },
    c.telegram && { label: "Написать в Telegram", href: c.telegram },
    c.telegramChannel && { label: "Telegram-канал", href: c.telegramChannel },
    c.instagram && { label: "Instagram", href: c.instagram },
  ].filter(Boolean) as { label: string; href: string }[];

  const rows = [
    { icon: <PinIcon />, label: "Адрес", value: `${c.city}, ${c.address}` },
    { icon: <ClockIcon />, label: "Часы работы", value: c.hours },
    {
      icon: <PhoneIcon />,
      label: "Телефон",
      value: c.phoneHref ? <a href={c.phoneHref}>{c.phone}</a> : c.phone,
    },
  ];

  return (
    <div className="page">
      <div className="md:grid md:min-h-[calc(100svh-var(--top-offset))] md:grid-cols-2">
        <div className="container-x flex flex-col justify-center py-12 md:px-16 md:py-20">
          <nav aria-label="Хлебные крошки" className="text-[13px] text-faint">
            <Link href="/" className="hover:text-ink">
              Главная
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Контакты</span>
          </nav>

          <div className="kicker mt-10 text-muted">
            {site.tagline} · {site.established}
          </div>
          <h1 className="mt-4 font-serif text-[46px] leading-[1.02] text-navy md:text-[68px]">Наш магазин</h1>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.75] text-muted">
            Приходите на примерку: покажем все оттенки коллекции, поможем с размером и посадкой.
          </p>

          <dl className="mt-10 max-w-[480px] border-t border-line">
            {rows.map((row) => (
              <div key={row.label} className="flex items-start gap-4 border-b border-line py-5">
                <span className="mt-0.5 text-navy">{row.icon}</span>
                <div>
                  <dt className="kicker text-muted">{row.label}</dt>
                  <dd className="mt-1.5 font-serif text-[24px] leading-tight text-navy">{row.value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            {links.map((l, i) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`btn ${i === 0 ? "btn-primary" : "btn-outline"}`}
              >
                {l.label}
              </a>
            ))}
            <Link href="/catalog/" className={`btn ${links.length === 0 ? "btn-primary" : "btn-outline"}`}>
              Смотреть каталог
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="photo-stage aspect-[2/3] md:aspect-auto">
            <img src={photo("pesok-2").src} alt="Куртка Gerutti, оттенок песок" className="photo" />
          </div>
          <div className="photo-stage aspect-[2/3] md:aspect-auto">
            <img src={photo("oliva-2").src} alt="Куртка Gerutti, оттенок олива" className="photo" />
          </div>
        </div>
      </div>
    </div>
  );
}
