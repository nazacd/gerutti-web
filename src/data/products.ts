export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Короткое имя оттенка — используется в плитках и подписях */
  colorName: string;
  colorHex: string;
  category: string;
  season: string;
  price: number;
  isNew: boolean;
  description: string;
  /** Кадр в интерьере — для главной и lookbook */
  lifestyle: string;
  /** Крупный план фактуры */
  closeUp: string;
  /** Галерея товара: имена файлов в /public/media без расширения. Первый кадр — обложка карточки */
  images: string[];
  sizes: { value: string; available: boolean }[];
  details: { label: string; value: string }[];
  order: number;
};

const sizes = ["46", "48", "50", "52", "54", "56"].map((value) => ({
  value,
  available: true,
}));

const baseDetails = (color: string, sku: string) => [
  { label: "Артикул", value: sku },
  { label: "Цвет", value: color },
  { label: "Воротник", value: "Отложной" },
  { label: "Застёжка", value: "Кнопки" },
  { label: "Карманы", value: "Два боковых прорезных" },
  { label: "Манжеты", value: "На кнопке" },
  { label: "Сезон", value: "Осень–зима" },
];

// Цена — демо-значение, одинаковое для всех оттенков. Заменить на реальные.
const PRICE = 1_490_000;

export const products: Product[] = [
  {
    id: "gr-101",
    slug: "kurtka-na-knopkah-tabak",
    name: "Куртка на кнопках, табак",
    colorName: "Табак",
    colorHex: "#7b4f32",
    category: "Куртки",
    season: "Осень–зима",
    price: PRICE,
    isNew: true,
    description:
      "Лаконичная куртка прямого кроя с отложным воротником и застёжкой на кнопки. Мягкая бархатистая фактура и тёплый табачный оттенок легко сочетаются с тёмным трикотажем и классическими брюками. Длина до линии бедра, два боковых прорезных кармана, манжеты на кнопке.",
    lifestyle: "tabak-int",
    closeUp: "tabak-3",
    images: ["tabak-1", "tabak-int", "tabak-2", "tabak-3"],
    sizes,
    details: baseDetails("Табак", "GR-101"),
    order: 1,
  },
  {
    id: "gr-102",
    slug: "kurtka-na-knopkah-pesok",
    name: "Куртка на кнопках, песок",
    colorName: "Песок",
    colorHex: "#b9a590",
    category: "Куртки",
    season: "Осень–зима",
    price: PRICE,
    isNew: true,
    description:
      "Светлая куртка прямого кроя с отложным воротником и застёжкой на кнопки. Песочный оттенок освежает тёмный гардероб и особенно выразительно смотрится с тёмно-синим. Длина до линии бедра, два боковых прорезных кармана, манжеты на кнопке.",
    lifestyle: "pesok-int",
    closeUp: "pesok-3",
    images: ["pesok-1", "pesok-int", "pesok-2", "pesok-3"],
    sizes,
    details: baseDetails("Песок", "GR-102"),
    order: 2,
  },
  {
    id: "gr-103",
    slug: "kurtka-na-knopkah-oliva",
    name: "Куртка на кнопках, олива",
    colorName: "Олива",
    colorHex: "#5e6450",
    category: "Куртки",
    season: "Осень–зима",
    price: PRICE,
    isNew: true,
    description:
      "Куртка прямого кроя в приглушённом оливковом оттенке. Отложной воротник, застёжка на кнопки и мягкая бархатистая фактура. Хорошо работает с коричневой и графитовой гаммой. Длина до линии бедра, два боковых прорезных кармана, манжеты на кнопке.",
    lifestyle: "oliva-int",
    closeUp: "oliva-3",
    images: ["oliva-1", "oliva-int", "oliva-2", "oliva-3"],
    sizes,
    details: baseDetails("Олива", "GR-103"),
    order: 3,
  },
  {
    id: "gr-104",
    slug: "kurtka-na-knopkah-palisandr",
    name: "Куртка на кнопках, палисандр",
    colorName: "Палисандр",
    colorHex: "#6d4e50",
    category: "Куртки",
    season: "Осень–зима",
    price: PRICE,
    isNew: true,
    description:
      "Куртка прямого кроя в глубоком оттенке палисандра — между шоколадом и сливой. Отложной воротник, застёжка на кнопки, мягкая бархатистая фактура. Самый выразительный цвет коллекции, лучше всего раскрывается рядом со светлым трикотажем. Длина до линии бедра, два боковых прорезных кармана.",
    lifestyle: "palisandr-int",
    closeUp: "palisandr-3",
    images: ["palisandr-1", "palisandr-int", "palisandr-2", "palisandr-3"],
    sizes,
    details: baseDetails("Палисандр", "GR-104"),
    order: 4,
  },
];

export const allSizes = sizes.map((s) => s.value);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productHref(p: Product): string {
  return `/catalog/${p.slug}/`;
}

export const sizeTable = [
  { size: "46", chest: "90–93", waist: "78–81" },
  { size: "48", chest: "94–97", waist: "82–85" },
  { size: "50", chest: "98–101", waist: "86–89" },
  { size: "52", chest: "102–105", waist: "90–93" },
  { size: "54", chest: "106–109", waist: "94–97" },
  { size: "56", chest: "110–113", waist: "98–101" },
];
