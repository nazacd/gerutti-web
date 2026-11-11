const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Путь к файлу из /public с учётом basePath (нужно для GitHub Pages). */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Фото товара: полный размер и уменьшенная версия для карточек. */
export function photo(name: string) {
  return {
    src: asset(`/media/${name}.webp`),
    small: asset(`/media/${name}-480.webp`),
    srcSet: `${asset(`/media/${name}-480.webp`)} 480w, ${asset(`/media/${name}.webp`)} 853w`,
  };
}
