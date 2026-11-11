"""Готовит фото товаров для сайта: выравнивает белый фон и сохраняет WebP в public/media.

Запуск из корня репозитория:  python3 scripts/build-media.py
Нужен Pillow:                  pip install pillow

Чтобы добавить товар, положите три кадра в images/ и допишите строку в SOURCES:
ключ — имя оттенка латиницей, значения — общий план, три четверти, крупный план.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = ROOT / "public" / "media"

SOURCES = {
    "tabak": ["photo_2026-11-11_23-25-32.jpg", "photo_2026-11-11_23-27-33.jpg", "photo_2026-11-11_23-27-29.jpg"],
    "pesok": ["photo_2026-11-11_23-27-34 (2).jpg", "photo_2026-11-11_23-27-34.jpg", "photo_2026-11-11_23-27-33 (2).jpg"],
    "oliva": ["photo_2026-11-11_23-27-36.jpg", "photo_2026-11-11_23-27-35.jpg", "photo_2026-11-11_23-27-34 (3).jpg"],
    "palisandr": ["photo_2026-11-11_23-27-37 (2).jpg", "photo_2026-11-11_23-27-36 (2).jpg", "photo_2026-11-11_23-27-37.jpg"],
}

# Точка белого по каналам: студийный фон чуть сероватый и холодный, доводим его до чистого белого,
# чтобы на сайте он ровно «красился» в кремовый цвет бренда (mix-blend-mode: multiply).
WHITE_POINT = (241, 240, 246)


def level(image: Image.Image) -> Image.Image:
    channels = image.split()
    return Image.merge(
        "RGB",
        [ch.point(lambda v, wp=wp: min(255, round(v * 255 / wp))) for ch, wp in zip(channels, WHITE_POINT)],
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, files in SOURCES.items():
        for index, filename in enumerate(files, start=1):
            image = level(Image.open(SRC / filename).convert("RGB"))
            image.save(OUT / f"{name}-{index}.webp", quality=86, method=6)
            small = image.resize((480, round(480 * image.height / image.width)), Image.LANCZOS)
            small.save(OUT / f"{name}-{index}-480.webp", quality=82, method=6)
            print(f"{name}-{index}.webp")

    logo = Image.open(SRC / "logo.jpg").convert("RGB").resize((1200, 1200))
    logo.crop((0, 285, 1200, 915)).save(OUT / "og.jpg", quality=88)


if __name__ == "__main__":
    main()
