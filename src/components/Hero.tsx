"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset, photo } from "@/lib/asset";
import { ChevronLeft, ChevronRight } from "./Icons";

export type HeroVideo = {
  /** Файлы из /public/media */
  src: string;
  poster: string;
  /** Вертикальная версия для телефонов */
  mobileSrc?: string;
  mobilePoster?: string;
  /** Длительность ролика в миллисекундах — после неё слайд сменяется */
  duration: number;
};

export type HeroSlide = {
  kicker: string;
  title: string;
  offer: string;
  cta: string;
  href: string;
  /** Три кадра: на десктопе стоят рядом, на телефоне сменяют друг друга */
  images?: [string, string, string];
  /** Видео на весь экран вместо кадров; шапка над ним становится белой */
  video?: HeroVideo;
};

const DURATION = 8000;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const total = slides.length;
  const current = slides[active];
  const duration = current.video ? current.video.duration + 400 : DURATION;

  const go = useCallback((dir: 1 | -1) => setActive((i) => (i + dir + total) % total), [total]);

  useEffect(() => {
    if (paused || total < 2) return;
    const t = window.setTimeout(() => go(1), duration);
    return () => window.clearTimeout(t);
  }, [active, paused, go, total, duration]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Ролик стартует с начала каждый раз, когда его слайд становится активным
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    videos.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && !reduceMotion) {
        video.currentTime = 0;
        video.play().catch(() => {
          /* автозапуск запрещён (режим экономии) — остаётся постер */
        });
      } else {
        video.pause();
      }
    });
  }, [active]);

  // Над тёмным видео шапка сайта становится белой
  const dark = !!current.video;
  useEffect(() => {
    document.documentElement.classList.toggle("hero-dark", dark);
    return () => document.documentElement.classList.remove("hero-dark");
  }, [dark]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section
      data-hero
      className="hero group/hero"
      aria-roledescription="carousel"
      aria-label="Главные истории коллекции"
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {slides.map((slide, i) => {
        const Title = i === 0 ? "h1" : "p";
        const video = slide.video;
        return (
          <div
            key={slide.title}
            className={`hero-slide ${i === active ? "is-active" : ""} ${video ? "is-dark" : ""}`}
            aria-hidden={i !== active}
            inert={i !== active}
          >
            <div className="hero-panels">
              {video && (
                <>
                  <picture>
                    {video.mobilePoster && (
                      <source media="(max-width: 767px)" srcSet={asset(`/media/${video.mobilePoster}`)} />
                    )}
                    <img
                      className="hero-media"
                      src={asset(`/media/${video.poster}`)}
                      alt=""
                      fetchPriority={i === 0 ? "high" : "auto"}
                    />
                  </picture>
                  <video
                    ref={(el) => {
                      videos.current[i] = el;
                    }}
                    className="hero-media"
                    muted
                    playsInline
                    preload={i === 0 ? "auto" : "metadata"}
                    onEnded={() => {
                      if (i === active && total > 1) go(1);
                    }}
                  >
                    {video.mobileSrc && (
                      <source media="(max-width: 767px)" src={asset(`/media/${video.mobileSrc}`)} type="video/mp4" />
                    )}
                    <source src={asset(`/media/${video.src}`)} type="video/mp4" />
                  </video>
                </>
              )}
              {!video &&
                slide.images?.map((name, j) => (
                  <div key={name} className="hero-panel">
                    <img
                      src={photo(name).src}
                      alt=""
                      fetchPriority={i === 0 && j === 0 ? "high" : "auto"}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
            </div>
            <div className="hero-veil" />

            <div className="hero-copy absolute inset-x-0 bottom-[11%] flex flex-col items-center px-6 text-center text-white md:bottom-[13%]">
              <div className="kicker text-white/75">{slide.kicker}</div>
              <Title className="mt-4 max-w-[900px] font-serif text-[42px] font-medium uppercase leading-[1.02] tracking-[0.02em] md:text-[64px]">
                {slide.title}
              </Title>
              <div className="kicker mt-5">{slide.offer}</div>
              <Link href={slide.href} className="btn btn-outline-light mt-7 h-[46px] px-8">
                {slide.cta}
              </Link>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Предыдущий слайд"
            onClick={() => go(-1)}
            className="absolute left-6 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-navy/25 bg-paper/60 text-navy opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-paper group-hover/hero:opacity-100 md:flex"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Следующий слайд"
            onClick={() => go(1)}
            className="absolute right-6 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-navy/25 bg-paper/60 text-navy opacity-0 backdrop-blur transition-opacity duration-300 hover:bg-paper group-hover/hero:opacity-100 md:flex"
          >
            <ChevronRight />
          </button>

          <div className="absolute inset-x-6 bottom-6 z-10 flex items-center justify-center gap-4 text-white md:inset-x-auto md:right-10 md:bottom-9 md:justify-end">
            <span className="text-[11px] tracking-[0.2em]">{pad(active + 1)}</span>
            <span className="relative h-px w-16 overflow-hidden bg-white/30">
              <span
                key={`${active}-${paused}`}
                className={`hero-progress absolute inset-0 bg-white ${paused ? "" : "is-running"}`}
                style={{ animationDuration: `${duration}ms` }}
              />
            </span>
            <span className="text-[11px] tracking-[0.2em] text-white/50">{pad(total)}</span>
          </div>
        </>
      )}
    </section>
  );
}
