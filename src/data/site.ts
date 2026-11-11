/**
 * Все данные о магазине — в одном месте.
 * ВНИМАНИЕ: контакты, адрес и цены ниже — демо-значения, их нужно заменить реальными.
 * Пустая строка у соцсети/мессенджера = ссылка на сайте не показывается.
 */
type Contacts = {
  city: string;
  address: string;
  hours: string;
  phone: string;
  /** tel:+998... */
  phoneHref: string;
  /** https://t.me/... */
  telegram: string;
  /** https://instagram.com/... */
  instagram: string;
  email: string;
  /** Ссылка на точку в Яндекс/Google Картах */
  mapUrl: string;
};

const contacts: Contacts = {
  city: "Ташкент",
  address: "Адрес магазина",
  hours: "Ежедневно, 10:00 – 21:00",
  phone: "+998 00 000 00 00",
  phoneHref: "",
  telegram: "",
  instagram: "",
  email: "",
  mapUrl: "",
};

export const site = {
  name: "Gerutti",
  wordmark: "GERUTTI",
  established: "EST. 2020",
  tagline: "Мужская одежда",
  description:
    "Gerutti — мужская одежда спокойных оттенков и чистых линий. Коллекция осень–зима 2026.",
  season: "Осень–Зима 2026",

  /** false — корзина и оформление заказа временно недоступны */
  checkoutEnabled: false,

  currency: "сум",

  contacts,
};

export const nav = [
  { label: "Каталог", href: "/catalog/" },
  { label: "Lookbook", href: "/lookbook/" },
  { label: "Контакты", href: "/contacts/" },
] as const;

export function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU").replace(/,/g, " ")} ${site.currency}`;
}
