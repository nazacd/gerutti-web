import type { Metadata } from "next";
import Link from "next/link";
import { products, productHref } from "@/data/products";
import { site } from "@/data/site";
import { photo } from "@/lib/asset";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Lookbook",
  description: `Lookbook Gerutti. ${site.season}: четыре оттенка осени.`,
};

const notes: Record<string, string> = {
  "gr-101": "Тёплый табак с шоколадным трикотажем и брюками в тон — образ в одной гамме.",
  "gr-102": "Светлый песок рядом с глубоким тёмно-синим. Контраст, который всегда работает.",
  "gr-103": "Приглушённая олива и коричневый: спокойное сочетание для города.",
  "gr-104": "Палисандр со светлым трикотажем — самый выразительный оттенок коллекции.",
};

export default function LookbookPage() {
  return (
    <div className="page bg-paper">
      <header className="container-x pb-10 pt-14 text-center md:pb-16 md:pt-24">
        <div className="kicker text-muted">Lookbook · {site.season}</div>
        <h1 className="mx-auto mt-5 max-w-[900px] font-serif text-[46px] uppercase leading-[1] tracking-[0.02em] text-navy md:text-[92px]">
          Четыре оттенка осени
        </h1>
        <p className="mx-auto mt-7 max-w-[520px] text-[15px] leading-[1.75] text-muted">
          Одна куртка, четыре характера. Мы сняли каждый оттенок в трёх планах, чтобы показать силуэт, посадку и
          фактуру так, как вы увидите их в магазине.
        </p>
      </header>

      <div className="space-y-20 pb-20 md:space-y-36 md:pb-36">
        {products.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={p.id} className="container-x mx-auto max-w-[1360px]">
              <div className="grid items-end gap-4 md:grid-cols-12 md:gap-8">
                <Reveal className={`md:col-span-7 ${flip ? "md:order-2" : ""}`}>
                  <Link href={productHref(p)} className="tile block">
                    <div className="photo-stage aspect-[2/3]">
                      <img src={photo(p.images[1]).src} alt={p.name} loading="lazy" className="photo" />
                    </div>
                  </Link>
                </Reveal>

                <div className={`md:col-span-4 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-9"}`}>
                  <Reveal delay={100}>
                    <div className="mb-6 hidden md:block">
                      <div className="font-serif text-[120px] leading-[0.8] text-navy/10">0{i + 1}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:block md:space-y-6">
                      <Link href={productHref(p)} className="tile block">
                        <div className="photo-stage aspect-[2/3]">
                          <img src={photo(p.images[2]).src} alt="" loading="lazy" className="photo" />
                        </div>
                      </Link>
                      <div className="self-end md:self-auto">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.colorHex }} />
                          <span className="kicker text-muted">Куртка на кнопках</span>
                        </div>
                        <h2 className="mt-3 font-serif text-[36px] leading-none text-navy md:text-[52px]">
                          {p.colorName}
                        </h2>
                        <p className="mt-3 text-[14px] leading-relaxed text-muted md:max-w-[320px]">{notes[p.id]}</p>
                        <Link href={productHref(p)} className="caps link-underline mt-4 inline-block text-navy">
                          Смотреть
                        </Link>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="bg-cream">
        <div className="container-x flex flex-col items-center py-20 text-center md:py-28">
          <div className="kicker text-muted">{site.wordmark}</div>
          <h2 className="mt-5 max-w-[640px] font-serif text-[36px] leading-[1.08] text-navy md:text-[52px]">
            Выберите свой оттенок
          </h2>
          <Link href="/catalog/" className="btn btn-primary mt-8">
            Перейти в каталог
          </Link>
        </div>
      </section>
    </div>
  );
}
