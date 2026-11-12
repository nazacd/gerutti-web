/**
 * Все данные о магазине — в одном месте.
 * Контакты — реальные. Цены в products.ts пока демо-значения.
 * Пустая строка у соцсети/мессенджера = ссылка на сайте не показывается.
 */
type Contacts = {
  city: string;
  address: string;
  hours: string;
  phone: string;
  /** tel:+998... */
  phoneHref: string;
  /** Telegram администратора — сюда ведут кнопки «Написать в Telegram» */
  telegram: string;
  /** Telegram-канал магазина */
  telegramChannel: string;
  instagram: string;
  email: string;
  /** Ссылка на точку в Яндекс Картах */
  mapUrl: string;
};

const contacts: Contacts = {
  city: "Ташкент",
  address: "Яккасарай, ул. Бабура, 13",
  hours: "Ежедневно, 10:00 – 23:00",
  phone: "+998 77 705 00 33",
  phoneHref: "tel:+998777050033",
  telegram: "https://t.me/Gerutti_uz",
  telegramChannel: "https://t.me/gerutti_men",
  instagram: "https://www.instagram.com/gerutti_men",
  email: "",
  mapUrl:
    "https://yandex.uz/maps/10335/tashkent/?ll=69.250848%2C41.296017&mode=poi&poi%5Bpoint%5D=69.250722%2C41.295982&poi%5Buri%5D=ymapsbm1%3A%2F%2Forg%3Foid%3D5703112591&z=19",
};

export const site = {
  name: "Gerutti",
  wordmark: "GERUTTI",
  established: "EST. 2020",
  tagline: "Casual & Classic",
  description:
    "Gerutti — повседневная и классическая мужская одежда в Ташкенте. Коллекция осень–зима 2026.",
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
