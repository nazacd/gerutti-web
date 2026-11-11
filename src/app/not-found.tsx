import Link from "next/link";

export default function NotFound() {
  return (
    <div className="page flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="kicker text-muted">Ошибка 404</div>
      <h1 className="mt-5 font-serif text-[44px] leading-none text-navy md:text-[64px]">Страница не найдена</h1>
      <p className="mt-4 max-w-[360px] text-[15px] text-muted">
        Возможно, ссылка устарела. Загляните в каталог — вся коллекция там.
      </p>
      <Link href="/catalog/" className="btn btn-primary mt-8">
        Перейти в каталог
      </Link>
    </div>
  );
}
