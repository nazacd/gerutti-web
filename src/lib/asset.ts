const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к файлу из /public с учётом basePath (нужно для GitHub Pages). */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Интерьерные кадры (имя заканчивается на -int) сохранены шире студийных. */
function fullWidth(name: string): number {
  return name.endsWith("-int") ? 1200 : 853;
}

/** Фото из /public/media: полный размер и уменьшенная версия для карточек. */
export function photo(name: string) {
  const src = asset(`/media/${name}.webp`);
  const small = asset(`/media/${name}-480.webp`);
  return { src, small, srcSet: `${small} 480w, ${src} ${fullWidth(name)}w` };
}
