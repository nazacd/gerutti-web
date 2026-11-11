import Link from "next/link";
import { products, productHref } from "@/data/products";
import { site } from "@/data/site";
import { photo } from "@/lib/asset";
import { Hero, type HeroSlide } from "@/components/Hero";
import { ProductCarousel } from "@/components/Carousel";
import { Reveal } from "@/components/Reveal";
import { ArrowRight } from "@/components/Icons";

const slides: HeroSlide[] = [
  {
    kicker: "Новая коллекция",
    title: "Четыре оттенка осени",
    offer: site.season,
    cta: "Смотреть коллекцию",
    href: "/catalog/",
    images: ["tabak-2", "palisandr-2", "oliva-2"],
  },
  {
    kicker: "Lookbook",
    title: "Внимание к деталям",
    offer: "Фактура · Фурнитура · Посадка",
    cta: "Открыть lookbook",
    href: "/lookbook/",
    images: ["pesok-3", "tabak-3", "palisandr-3"],
  },
];

export default function HomePage() {
  return (
    <>
      <Hero slides={slides} />

      {/* Мозаика оттенков */}
      <section aria-label="Оттенки коллекции" className="grid grid-cols-2 md:grid-cols-3">
        {products.map((p, i) => {
          const img = photo(p.images[0]);
          return (
            <Link key={p.id} href={productHref(p)} className="tile group relative block">
              <div className="photo-stage aspect-[2/3]">
                <img
                  src={img.small}
                  srcSet={img.srcSet}
                  sizes="(min-width: 768px) 34vw, 50vw"
                  alt={p.name}
                  loading="lazy"
                  className="photo"
                />
                <div className="tile-veil" />
              </div>
              <div className="absolute inset-x-4 bottom-4 text-white md:inset-x-7 md:bottom-7">
                <div className="kicker text-white/70">
                  0{i + 1}
                  <span className="hidden md:inline"> · Куртка на кнопках</span>
                </div>
                <div className="mt-1.5 font-serif text-[26px] leading-none md:text-[34px]">{p.colorName}</div>
              </div>
            </Link>
          );
        })}

        <Link
          href="/lookbook/"
          className="group relative flex aspect-[2/3] flex-col justify-between bg-navy p-4 text-cream md:p-7"
        >
          <div className="kicker text-cream/60">Lookbook</div>
          <div>
            <div className="font-serif text-[26px] leading-[1.05] md:text-[40px]">
              Осень
              <br />
              Зима 2026
            </div>
            <ArrowRight className="mt-5 transition-transform duration-500 group-hover:translate-x-2" />
          </div>
        </Link>

        <Link
          href="/catalog/"
          className="group relative flex aspect-[2/3] flex-col justify-between bg-paper p-4 text-navy md:p-7"
        >
          <div className="kicker text-muted">Каталог</div>
          <div>
            <div className="font-serif text-[26px] leading-[1.05] md:text-[40px]">
              Весь
              <br />
              каталог
            </div>
            <p className="mt-3 hidden max-w-[240px] text-[13px] leading-relaxed text-muted md:block">
              Все оттенки и размеры новой коллекции {site.name}
            </p>
            <ArrowRight className="mt-5 transition-transform duration-500 group-hover:translate-x-2" />
          </div>
        </Link>
      </section>

      {/* О бренде */}
      <section className="bg-navy-deep">
        <div className="container-x mx-auto grid max-w-[1440px] items-center gap-10 py-16 md:grid-cols-12 md:gap-8 md:py-28">
          <Reveal className="md:col-span-5 md:col-start-2">
            <div className="photo-stage aspect-[4/5]">
              <img
                src={photo("palisandr-3").src}
                alt="Фактура и фурнитура куртки Gerutti крупным планом"
                loading="lazy"
                className="photo"
              />
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5 md:col-start-8">
            <div className="kicker text-cream/50">
              {site.wordmark} · {site.established}
            </div>
            <h2 className="mt-5 font-serif text-[38px] leading-[1.06] text-cream md:text-[56px]">
              Спокойная одежда, <em className="font-normal italic">к которой</em> хочется прикоснуться
            </h2>
            <p className="mt-6 max-w-[440px] text-[15px] leading-[1.75] text-cream/65">
              Мы делаем вещи без лишнего: чистая линия плеча, отложной воротник, матовая фурнитура и мягкая
              бархатистая фактура. Четыре оттенка осени подобраны так, чтобы сочетаться между собой и с тем, что
              уже есть в гардеробе.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/lookbook/" className="btn btn-light">
                Смотреть lookbook
              </Link>
              <Link href="/contacts/" className="btn btn-outline-light">
                Наш магазин
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <ProductCarousel title="Новинки" products={products} moreHref="/catalog/" />
    </>
  );
}
