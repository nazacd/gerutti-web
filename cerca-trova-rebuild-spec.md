# Rebuild Spec — Premium Menswear E‑commerce (modeled on cerca-trova.ru)

> **Purpose of this document.** This is a complete, implementation-level description of the website `cerca-trova.ru` (Russian premium classic menswear brand: suits, shirts, trousers, knitwear, shoes). It was produced by walking through every page, menu, drawer, filter and flow on desktop (1384px viewport) and mobile (~316–400px viewport) on 11 Nov 2026.
> The goal is to let a developer/AI build a **structurally and functionally equivalent store for a different brand** without ever seeing the original.
> **Replace** the brand name, logo, photography, copy, phone numbers, store addresses and legal texts with the new store's own. Keep the architecture, layout, interaction patterns and design tokens.
> UI labels are given in the original Russian (with English meaning) because the site is Russian-language; translate if the new store uses another language.

---

## 0. One-paragraph summary

A dark/editorial, image-led luxury storefront. Full-screen hero (video + photo slider), category mosaic, a "new arrivals" carousel, and a black footer. The header is **fixed and transparent**, and its text/icons flip between white and black depending on what's behind it. Typography pairs a **serif display face (Cormorant)** for big titles with a **clean grotesk (Suisse Intl)** for all UI. The accent is a **deep bottle green `#386E44`** used for primary actions (add to cart, apply, checkout), badges and links. Commerce runs through **right-side slide-in drawers** (cart, size table, store availability, delivery, alterations, login, gift-card summary) with a blurred/dimmed backdrop. The catalog has dropdown filters (size, color, style, price, sort), a 4/3/2-column density switch, infinite scroll, and product cards whose image **scrubs between photos as the mouse moves horizontally**. The product page is a 50/50 split: left = vertically scrolling full-height photo stack with a thumbnail rail; right = sticky info column with accordions. Extra marketing pages: Made-to-Measure landing, Loyalty club (dark), Lookbook editorials, Gift cards configurator, Boutiques map.

---

## 1. Technology (observed) and recommended stack

| Area | Observed on original | Recommendation for rebuild |
|---|---|---|
| Framework | **Nuxt 3** (Vue 3, SSR; `/_nuxt/` chunks, `#__nuxt`, `#teleports`, `__NUXT_DATA__`) | Nuxt 3 (or Next.js if team prefers React) with SSR for SEO |
| Styling | **Tailwind CSS** utility classes + scoped component CSS + CSS custom properties on `:root` | Tailwind + the CSS variables in §2 |
| Images | CDN `cdn.<domain>/storage/media/catalog/<productGuid>_<imageGuid>.jpg.w720.webp` (server-side resized WebP, width suffix) | Image CDN with on-the-fly resize: widths ~360/720/1080/1600, WebP/AVIF, `srcset` |
| Hero media | `<picture>` with separate mobile (`max-width:767px`) / desktop sources; MP4 hero video `autoplay muted playsinline`, `object-fit:cover` | Same |
| Maps | **Yandex Maps** JS API with custom round green markers | Yandex Maps (RU) / Google Maps / Mapbox elsewhere |
| Captcha | **Yandex SmartCaptcha** on login | Any invisible/checkbox captcha |
| Auth | Phone number + **flash-call** ("Войти по звонку") OR email+password | Phone OTP (SMS/call) + email/password |
| Loyalty SDK | `s.maxma.com/js/sdk.js` (Maxma loyalty platform, cart events) | Your loyalty/CRM provider |
| Analytics | Yandex Metrika (with e‑commerce + call tracking), turbotargeting pixel, bumlam retargeting | GA4/Metrika + e‑commerce dataLayer events (view_item, add_to_cart, begin_checkout, purchase) |
| Delivery | CDEK pickup points (Russia) | Your carrier/PVZ integration |
| SEO | `<title>` pattern `"{Name} — {BRAND} | {Brand}"`, meta description, keywords, OpenGraph (`og:image` per page, dynamic product OG image), Twitter `summary_large_image`, `robots: index, follow, max-image-preview:large` | Same + JSON-LD Product/BreadcrumbList/Organization/Store |
| Meta | `color-scheme: dark`, `theme-color` near-transparent, `apple-mobile-web-app-capable=yes`, `viewport-fit=cover` | Same |

Smooth scrolling: `html { scroll-behavior: smooth }`. Home page adds a class `home-dark` to `<html>`.

---

## 2. Design system

### 2.1 Color tokens (copy these as CSS variables)

```css
:root{
  /* Brand / action */
  --primary-color:#386e44;        /* bottle green – primary buttons, active states, badges */
  --primary-hover:#2d5a37;
  --menu-active-bg:rgba(56,110,68,.08);
  --menu-active-color:#386e44;
  --accent-color:#f59e0b;          /* amber – "busy" load indicator, warnings */
  --accent-color-black:#030303;    /* promo bar background */

  /* Surfaces */
  --bg-primary:#fff;
  --bg-secondary:#f8fafc;
  --bg-card:#fff;
  --bg-modal:rgba(0,0,0,.5);
  --page-dark:#0a0a0a;             /* body background (home is dark) */
  --footer-bg:#000;

  /* Text */
  --text-primary:#1e293b;          /* slate-800 – default UI text */
  --text-secondary:#64748b;
  --text-muted:#94a3b8;
  --text-white:#fff;
  --ink:#1a1a1a;                   /* product titles/prices */

  /* Lines */
  --border-color:#e2e8f0;
  --border-hover:#cbd5e1;

  /* Status */
  --success-color:#10b981;
  --error-color:#ef4444;
  --warning-color:#f59e0b;
  --info-color:#3b82f6;
  --closed-color:#8b4513;          /* store "closed" state */

  /* Editorial palette (MTM landing, loyalty) */
  --brand-primary:#8b6a3f;         /* bronze */
  --brand-ink:#1a1a1a;
  --brand-cream:#f5f1ea;
  --brand-line:#e5dfd4;
  --mtm-section-bg:#f5f3ef;        /* warm off-white sections */
  --mtm-cta-bg:#f5d7a5;            /* champagne/sand CTA on MTM page */
  --mtm-dark:#0f0f0f;

  /* Shadows */
  --shadow-sm:0 1px 2px 0 rgba(0,0,0,.05);
  --shadow-md:0 4px 6px -1px rgba(0,0,0,.1),0 2px 4px -2px rgba(0,0,0,.1);
  --shadow-lg:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1);

  /* Radii */
  --radius-sm:.25rem; --radius-md:.5rem; --radius-lg:.75rem; --radius-xl:1rem;

  /* Spacing */
  --space-xs:.25rem; --space-sm:.5rem; --space-md:1rem; --space-lg:1.5rem; --space-xl:2rem; --space-2xl:3rem;
  --layout-padding-x:12px; --layout-padding-y:24px;
  --content-max-width:1200px; --container-max-width:1200px;

  /* Sizes */
  --header-height:54px;
  --sidebar-width:240px;
  --button-height:52px; --button-padding-y:16px; --button-padding-x:24px;

  /* Motion */
  --transition-fast:.15s ease; --transition-normal:.3s ease; --transition-slow:.5s ease;
  --blur-overlay:blur(2px);
}
```

**Usage rules**
- Green `#386E44` = the ONLY colored action color: "В корзину" (Add to cart), "Оформить заказ" (Checkout), "Применить" (Apply), "Найти" (Search), "Перейти в каталог", active filter dot, selected chip, badge counters on header icons, selected size labels in size table, "читать далее" link, info boxes (light green tint background `rgba(56,110,68,.08)` with green text).
- Black `#1a1a1a`/`#000` = secondary solid buttons ("Выбрать размер", "Войти", "Адреса магазинов", "Перейти к оформлению", selected nominal chip, sticky "NEW" badge text).
- Disabled buttons: grey `#9e9e9e`-ish fill with white text (e.g., checkout "Далее" before form valid), or pale green (`#a5bfa9`-ish) for disabled primary green ("Войти по звонку").
- Color swatches (filter + PDP): beige `#d4b896`, white `#fff`, burgundy `#800020`, light-blue `#64b5f6`, green `#388e3c`, brown `#795548`, milk `#f3ead7`, multi (transparent/gradient), grey `#9e9e9e`, blue `#1565c0`, dark-green `#1b5e20`, dark-grey `#555`, navy `#1a2a5a`, black `#1a1a1a`.

### 2.2 Typography

| Role | Font | Size / weight / tracking | Notes |
|---|---|---|---|
| Body/UI | **Suisse Intl** (weights 100,200,300,400,450,600,700,900) fallback `system-ui,-apple-system,sans-serif` | 15px / 400 / line-height 24px | Main sans everywhere |
| Display/serif | **Cormorant** 600 (also 300) fallback `ui-serif, Georgia` | Hero title 48px/600 uppercase, lh 1.06 | Hero, section titles ("Новинки"), category tile labels, MTM/lookbook headings, newsletter heading |
| Header nav | Suisse Intl | 12px / 600 / letter-spacing .24px / UPPERCASE | |
| Hero kicker & offer | Suisse Intl | 10px / 450 / letter-spacing 3px / UPPERCASE; kicker opacity .6 | e.g. "НОВАЯ КОЛЛЕКЦИЯ", "100% ШЕРСТИ" |
| Hero CTA | Suisse Intl | 10–12px / 450 underlined text link "Перейти" | |
| Category tile label (desktop) | Cormorant | ~26px / 300 / white, sentence case | Mobile: Suisse, uppercase, bold-ish, letter-spaced |
| Section title "Новинки" | Cormorant | ~26px | Left aligned |
| Catalog H1 | Suisse | ~23px (var `--font-size-catalog-title`) / 600 | Followed by "\| 568 товаров" in muted grey |
| Product card name | Suisse | 14px / 500 / slate-800, single line ellipsis | |
| Product card price | Suisse | 15px / 400 / letter-spacing .7px | |
| Card badge "NEW" | Suisse | 10px / 500 / .8px tracking / UPPERCASE, black text on `rgba(255,255,255,.1)` with thin dark border, radius 2px, padding 4px 10px | |
| Season tag | Suisse | 11.2px / 400 / .3px / UPPERCASE, `#555` on `rgba(255,255,255,.7)`, radius 3px, padding 3px 8px | "ОСЕНЬ-ЗИМА", "ВЕСНА-ЛЕТО", "ВСЕСЕЗОН" |
| PDP collection | Suisse | 14px / 600 / `#666` UPPERCASE | |
| PDP title (H1) | Suisse | 28px / 500 / lh 1.2 / `#1a1a1a` | |
| PDP price | Suisse | 24px / 400 | |
| PDP accordion headers | Suisse | 16px / 400 / `#333` | |
| Footer column heads | Suisse | 13px / 600 / UPPERCASE, grey-white | |
| Footer links | Suisse | 15px / 400 / `#9a9a9a` → white on hover | |
| Loyalty page | Suisse **heavy (700–900)**, tight tracking; italic grey second line "Privato" | 48–56px | |

Font files are self-hosted (`@font-face`). If Suisse Intl isn't licensed, substitute **Inter / Manrope / Neue Haas Grotesk**; for Cormorant use **Cormorant Garamond** (Google Fonts, free).

### 2.3 Icons
Thin outline line icons (~1.5px stroke, 20–24px), monochrome, inheriting `currentColor`:
- Header: **grid of 9 dots** (menu, desktop), **two horizontal lines** (menu, mobile), magnifier (search), person (account), **bookmark ribbon** (favorites — NOT a heart), shopping bag (cart).
- Chevron down/up for dropdowns, chevron right for drawer rows, `+`/`−` for accordions, `×` close, arrows `←` `→` (long thin arrow "⟶" on "Весь каталог" tile), check `✓` for selected sort, info-circle in info boxes, question-circle `?` (green) for size help, clock & phone icons in store cards, envelope (subscribe), tag (promo code), truck (delivery), scissors (alterations), gift, Telegram plane, "MAX" text badge (messenger), email.
- Use **Lucide** or **Phosphor (thin)** to reproduce.
- Favicon/marker: brand emblem (on original: a horse-and-rider knight) in a green circle used as map marker.

### 2.4 Imagery & art direction
- Warm, cinematic, low-key interiors (wood panelling, damask wallpaper, gilded frames, vintage cars) — "old-money" tailoring mood.
- Product photography: 3+ images per product: (1) model in interior, (2) close-up detail, (3) flat/ghost on light grey `#e9e9e9` background. Aspect ratio **0.64 (≈ 16:25, 640×1000)** for cards; PDP images 2:3.
- Classic paintings are used as backgrounds for gift cards, loyalty tier cards and newsletter modal.

### 2.5 Motion
- Drawers: slide in from right (`slide-in`), ~300ms ease, backdrop `rgba(0,0,0,.5)` + `backdrop-filter: blur(2px)` (page behind is visibly blurred).
- Menu drawer slides from left, same backdrop.
- Dropdowns: fade/scale in ~150ms.
- Toast: top-right card, auto-dismiss with a shrinking progress bar (~3s).
- Hero slides crossfade; arrows fade in on hero hover.
- Footer section on home fades/slides in when visible (`is-visible` class via IntersectionObserver).
- Product card image scrubs (instant swap, no slide).

---

## 3. Global layout & shell

### 3.1 Promo / announcement bar
- Fixed at very top, full width, height **41px**, background `#030303`, white 15px text centered, `×` close button on the right.
- Whole bar is a link (original: "Проблема с доступностью сайта" → `/service/site-access`).
- Closing hides it (persist dismissal in localStorage/cookie). Pushes header down via CSS var `--promo-offset`.
- Admin-editable text + link.

### 3.2 Header (desktop ≥768px)
- `position: fixed; top: var(--promo-offset); height: 54px; width:100%; z-index` above content. Background **transparent**.
- **Adaptive color**: when over dark media (hero, dark images, black footer) nav text/icons are **white**; over light sections they're **black**. Implement with IntersectionObserver on sections tagged `data-header-theme="dark|light"` (or sample background). On non-home pages (white body) the header gets a **solid white background** and black text.
- Layout: three absolute zones:
  - **Left** (`header-left`): menu button (9-dot grid icon, aria-label "Меню") at 24px from left, then text nav: `КАТАЛОГ` (/catalog) · `НОВИНКИ` (/catalog/new) · `LOOKBOOK` (/lookbook) · `БУТИКИ` (/shops) · `ПОДАРОЧНЫЕ КАРТЫ` (/gift-cards). Gap ~14px.
  - **Center**: SVG wordmark logo, 171×12px, links to `/`.
  - **Right**: 4 icon buttons ~42px apart: Search ("Поиск"), Account ("Войти в личный кабинет"), Favorites ("Избранное"), Cart ("Корзина").
- **Counters**: small green circle (≈14px, white 9px number) at top-right of favorites and cart icons when count > 0.

### 3.3 Header (mobile <768px)
- Left: hamburger (2 lines) + wordmark logo immediately right of it.
- Right: search, account, favorites, cart icons (with green counters).
- Same transparent/adaptive behavior.

### 3.4 Menu drawer ("burger")
- Slides from **left**, width **320px** desktop (`w-80`), full height, white, `shadow-lg`; rest of page blurred + dimmed. Close `×` top-left.
- Mobile: full-screen, with `×` + logo + search icon in its own top bar.
- Content (top to bottom), 16–17px Suisse, generous 32px row height:
  1. **Новые поступления** (bold) – New arrivals
  2. Индивидуальный пошив – Made-to-measure (/mtm)
  3. **Скоро в продаже** (bold) – Coming soon
  4. Category rows with chevron (desktop: small `⌄` right after the text; mobile: `+` aligned right). Clicking the **name** navigates to the category; clicking the **chevron/+** toggles an accordion of subcategories (small 13px grey-blue links, indented). Multiple accordions can be open at once; the current category is auto-expanded and the active sub-item is bold.
  5. **Особые условия** (bold) – Special offers/sale
  6. Памятки по уходу ⌄ – Care guides (accordion of guides)
  7. LOOKBOOK
  8. Подарочные карты
  9. (pinned bottom) **Покупателям ⌄** (larger, grey) → Клиентам, Контакты, Доставка и оплата, Возврат товара, Бутики, Программа лояльности
  10. "Мы в соцсетях" + inline links: Вконтакте · Ютуб · Телеграм · Max

**Full category taxonomy** (use as seed data):
- Верхняя одежда (Outerwear): Все товары, Бомберы, Жилеты пуховые, Пальто двубортное, Пальто однобортное, Пуховики, Тренчи
- Костюмы (Suits): Все товары, Костюмы-двойки (2-piece), Костюмы-тройки (3-piece)
- Брюки (Trousers): Все товары, Джинсы, Слаксы
- Пиджаки (Jackets): Все товары, Блейзеры, Пиджаки вечерние
- Сорочки (Shirts): Все товары, Сорочки длинный рукав, Сорочки короткий рукав
- Трикотаж (Knitwear): Все товары, Водолазки, Джемперы, Жилеты трикотажные, Кардиганы, Поло с длинным рукавом, Поло с коротким рукавом, Свитеры, Футболки
- Нижнее белье (Underwear): Все товары, Боксеры
- Аксессуары: Все товары, Галстуки, Головные уборы, Кошельки, Носки, Перчатки, Платки, Подтяжки, Пояса, Сумки, Шарфы
- Обувь: Все товары, Полуботинки, Спортивная обувь
- Спортивные костюмы (Tracksuits) – appears in catalog category strip
- Памятки по уходу (Care guides): Все памятки, Верхняя одежда, Костюмы/брюки/блейзеры, Слаксы, Брюки на кулиске, Джинсы, Сорочки, Трикотаж зимний, Трикотаж летний, Обувь, Галстуки/платки-паше/носки/боксеры/палантины, Перчатки/ремни/подтяжки

URL slugs are transliterated: `/catalog/trikotaz`, `/catalog/sorocki/`, `/catalog/briuki/`, `/catalog/kostiumy`, `/catalog/obuv`, `/catalog/kostiumy-dvoiki`, …

### 3.5 Search overlay
- Clicking search opens a **full-width white panel from the top** (covers header).
- Row: large input (rounded 6px, 1px dark border, placeholder "Поиск", magnifier icon inside right) · green button **"Найти"** · text button **"Закрыть"**.
- **Empty state** below input: two columns – "Часто ищут" (frequent queries, e.g. Пиджаки/Брюки/Костюмы) and "Популярные товары" (popular product queries). Plain links.
- **Live results as you type** (debounced ~300ms): heading "Найдено 13 товаров"; left area = 4-column grid of compact cards (white, 1px border, radius 8px, image, 2-line name with ellipsis, bold price, bookmark button); right sidebar (~230px) "Популярные запросы" → "Часто ищут" list + "Популярные товары" list.
- Enter / "Найти" keeps overlay with full results.

### 3.6 Account / Login drawer
Right drawer ~420px:
- Title **"Вход или регистрация"**, subtitle "Введите номер телефона".
- Phone field with **country-code selector** (flag + code, auto-detected by IP, e.g. 🇺🇿 +998; default 🇷🇺 +7) and masked input "(999) 123-45-67".
- Captcha widget.
- Primary green button **"Войти по звонку"** (Log in via call; disabled until valid).
- 3 checkboxes (11px grey text with green underlined links): (1) consent to personal data processing + privacy policy + user agreement (required), (2) "Согласен на участие в программе лояльности", (3) consent to advertising messages.
- Divider "или" → text button **"Войти через Email"** → switches to: "Вход по Email", note that email login works only for registered users who linked an email, Email + Password fields (underline style inputs), captcha, same consents, button "Подтвердите капчу"/"Войти", link "Забыли пароль?", link "← Вернуться к входу по телефону".
- Registration is implicit (phone login creates account).

### 3.7 Favorites
- Guest favorites stored in `localStorage['cerca-favorites']` (array of product IDs); sync to account after login.
- Header icon behaviour: **0 items** → small popover under icon: bookmark icon, "Тут пока ничего нет", "Добавьте товар в избранное", green button "Перейти в каталог". **≥1 item** → navigates to `/favorites`.
- `/favorites` page: breadcrumb (Главная / Избранное), H1 "Избранное | 1 товар", product grid (same cards; bookmark filled white-on-green). Empty state: big outline bookmark, "Ваша коллекция желаний пуста" style text, green "Перейти в каталог".

### 3.8 Cart drawer (mini-cart)
- Opens when clicking cart icon or "В корзине" button. Right drawer **384px**.
- Header: "Товаров в корзине 1" + `×`.
- Line item card (light border, radius 8): thumbnail (~60×80), name (2 lines, bold 14px), size/color "50 / серый", qty stepper `– 1 +` (minus disabled at 1), price right-aligned bold, small `×` remove ("Удалить из корзины").
- Sticky bottom: full-width green button **"Оформить заказ  80 000 ₽  ›"** → `/checkout/step1`.
- Empty state: cart icon, "Корзина пуста", "Добавьте товары из каталога, чтобы они появились здесь", green pill "‹ Перейти в каталог".
- Add-to-cart toast: top-right white card with shadow "Товар добавлен в корзину" + green progress bar (auto-close).

### 3.9 Generic right drawer pattern (reuse everywhere)
Width 384–480px, white, full height, header row (title 16px/600 left, `×` right), scrollable body, optional sticky footer button. Backdrop dims & blurs page. Closes on `Esc`, backdrop click, `×`. Used for: Size table, Store availability, Delivery, Alterations, Login, Cart, Gift-card summary.

### 3.10 Footer (black)
Background `#000`, text `#9a9a9a`, headings light grey. Two-tier:

**Tier 1 – link columns** (6 columns separated by 1px `#222` vertical lines):
1. Contact column: "Подписаться на рассылку" (link opening newsletter modal), small label "Многоканальный", large phone **+7 (495) …** (22px), three 32px round outlined icon buttons (Telegram, MAX, Email), "Режим работы ежедневно с 11:00 до 21:00" (11px).
2. **ПОМОЩЬ**: Контакты, Часто задаваемые вопросы, Адреса бутиков, Сотрудничество (/influencers), Кабинет партнёра (/auth)
3. **СОЦИАЛЬНЫЕ СЕТИ**: Вконтакте, Ютуб, Телеграм
4. **УСЛУГИ**: Индивидуальный пошив (/mtm), Подарочные карты, Информация о доставке, Программа лояльности
5. **ПРАВОВАЯ ИНФОРМАЦИЯ**: Пользовательское соглашение (/static/user-agreement), Политика конфиденциальности (/static/personal-data-policy), Согласие на обработку при регистрации (/static/pd-consent-registration), … для партнёров (/static/pd-consent-partners), … для рассылки (/static/pd-consent-mailing), … для обратной связи, Информация о cookies, Настройки cookies (opens consent settings), Согласие на получение рекламных сообщений, Отписаться от рассылки
6. **КОМПАНИЯ**: Найти магазин, Вакансии

**Tier 2 – newsletter band**: small spaced caps "CERCA TROVA" (brand), serif 36px heading "Подписка на рассылку" (home) / sans 28px "Получайте новости о новинках и стиле" (inner pages), subline "Новинки и закрытые распродажи — первыми на почту", and on the right a white rectangular button with envelope icon **"ПОДПИСАТЬСЯ"** (letter-spaced).

**Tier 3 – bottom bar** (top border `#222`): left "Россия | Русский" (region/language selector), right inline legal links separated by `|`; second row social text links "Ютуб  Вконтакте  Телеграм".

### 3.11 Newsletter modal
Centered modal ~860×520: left half = painting image with brand caption at bottom; right half white: small caps brand, serif title "Подписка на рассылку", subtitle, fields Имя, Email (underline inputs), two consent checkboxes (personal data – required; advertising), full-width grey disabled → active button "ПОДПИСАТЬСЯ". Inline validation "Введите корректный email".

### 3.12 Cookie consent
Banner on first visit (choices stored in `localStorage['cerca_cookie_consent']`); "Настройки cookies" link in footer reopens settings (categories: necessary, analytics, marketing).

---

## 4. Sitemap / routes

| Route | Page |
|---|---|
| `/` | Home |
| `/catalog` | All products (with "Категории" visual strip) |
| `/catalog/new` | New arrivals |
| `/catalog/{category}` and `/catalog/{subcategory}` | Category listing |
| `/catalog/{subcategory}/{product-slug}-{id}` | Product detail (e.g. `/catalog/kostiumy-dvoiki/kostium-dvoika-iz-flaneli-serogo-ottenka-1790754730`) |
| `/favorites` | Wishlist |
| `/checkout/step1` … `step4` | Checkout: 1 Контакты, 2 Доставка, 3 Оплата, 4 Заказ оформлен |
| `/shops` | Boutiques list + map |
| `/lookbook`, `/lookbook/{slug}` | Editorial lookbooks (e.g. underwear, fathers-day, power-suit) |
| `/gift-cards` | Gift card configurator |
| `/mtm` | Made-to-measure landing |
| `/loyalty-program` | Loyalty club |
| `/influencers` | Partnership / collaboration |
| `/auth` | Partner cabinet login |
| `/service/contacts`, `/service/delivery`, `/service/returns`, `/service/warranty`, `/service/faq`, `/service/order-tracking`, `/service/certificates`, `/service/site-access` | Service & support pages |
| `/static/{legal-slug}` | Legal documents |
| Account area (after login) | Profile, orders, loyalty level, saved measurements (not observed—build standard) |

Catalog query params: `sort_by` (`price`, `created_at`, `name`) + `sort_order` (`asc`/`desc`); filters similarly in query (`size`, `color`, `style`, `price_from`, `price_to`) so filtered views are shareable/SEO-safe.

---

## 5. Pages in detail

### 5.1 Home `/`
Body background `#0a0a0a`. Sections (each roughly one viewport, some tagged `home-snap`):

1. **Hero slider** — `height: 100svh; min-height: 520px`.
   - Slides: (01) photo "НОВАЯ КОЛЛЕКЦИЯ / ПАЛЬТО / 100% ШЕРСТИ"; (02) **video** "MADE-TO-MEASURE / ИНДИВИДУАЛЬНЫЙ ПОШИВ / УЖЕ ДОСТУПЕН". Each slide: kicker (tiny caps, 60% opacity) → serif title (48px, uppercase, can wrap to 2 lines) → offer line (tiny caps) → underlined text link "Перейти" (→ slide URL, e.g. /catalog/new, /mtm). Text block centered horizontally, positioned ~15% from bottom.
   - Bottom gradient veil: `linear-gradient(rgba(0,0,0,0) 55%, rgba(0,0,0,.35))`.
   - Counter bottom-right: **"01 — 02"** (current bright, total dim, letter-spaced 12px).
   - Prev/next thin chevrons at vertical center, ~120px from edges, visible on hover.
   - Autoplay; video slide advances on `ended`.
   - Separate mobile/desktop media sources.
2. **Category mosaic** (`mango-cats`) — white bg, CSS grid **3 equal columns, 0 gap**, tiles full-viewport tall on desktop.
   - Tiles: Трикотаж, Сорочки, Костюмы (row 1); Брюки, Обувь, and a **white text tile "Весь каталог"** (serif 26px title, grey subline "Все коллекции и новинки сезона …", long thin arrow `⟶`) (row 2).
   - Image tiles: full-bleed photo, label bottom-left 24px inset in white Cormorant ~26px/300.
   - Mobile: 2 columns, shorter tiles, labels in uppercase sans.
3. **Feature banner** (`section-four`) — full-width product still life (pocket squares) on light grey, centered serif title "ПЛАТКИ-ПАШЕ" + spaced caps subline "100% ШЕРСТЬ". Links to the category.
4. **New arrivals carousel** (`new-arrivals`) — white bg, container padding 58px.
   - Header row: serif "Новинки" left; right: two 40px circular outlined arrow buttons (‹ ›) + underlined spaced caps link **"СМОТРЕТЬ ВСЕ"** (→ /catalog/new).
   - Track: ~4 cards visible (≈332px wide, 20px gap), last one cut off to hint scroll; draggable/swipeable. Card = image (0.75 aspect, rounded 4px), "NEW" black badge top-left, name, bold price. ~10 items. Ends with "ВСЕ НОВИНКИ" card/link.
5. **Footer** (as §3.10), animates in.

### 5.2 Catalog / Category listing
Container ~1268px, white background, header solid.
- **Breadcrumbs**: "Главная / Каталог / Костюмы" (13px grey, current dark).
- **Title row**: H1 "Каталог" (23px/600) + "| 568 товаров" (muted). On `/catalog` only: a toggle **"Категории ⌄"** (18px grey) that expands a horizontal strip of **category cards** (≈145×215 image on light grey bg, radius 4px, label below in 14px): Верхняя одежда, Костюмы, Пиджаки, Брюки, Трикотаж, Сорочки, Спортивные костюмы, Обувь (scrollable horizontally if more).
- **Filter bar** (row of dropdown triggers, 16px text + chevron; active trigger gets light grey bg `#f3f4f6` radius 4px and a **green dot** before the label when a value is applied):
  - **Размер одежды** — dropdown ~275px wide, max-height ~290px scroll, grouped: "ТРИКОТАЖ" (L, M, S, XL, XXL) and "ПИДЖАКИ, БРЮКИ, РУБАШКИ" (30–68 numeric). Each group header has a green `?` icon opening the **Size table drawer**. Sizes are 40×32 outlined square chips, multi-select (selected = dark fill).
  - **Цвет** — list of colors, each with a **20×3px horizontal color bar** swatch + name; multi-select.
  - **По стилю** — Классика, Кэжуал, Смарт Кэжуал.
  - **Цена** — "ДИАПАЗОН ЦЕН": two inputs ОТ / ДО prefilled with catalog min/max (2 500 – 500 000), thousands separated, full-width green **"Применить"**.
  - **Sort** (label shows current: "По умолчанию") — По умолчанию ✓, Сначала новые, Сначала дешевле, Сначала дороже, По алфавиту. Single select, checkmark on active.
  - Right side: **density toggle** – 3 icon buttons: ▢ (4 columns, "large"/compact), ||| (3 columns, "Стандартный вид" – default), || (2 columns, big images). Persist in `localStorage['catalog_view_mode']`.
- **Sticky mini-bar**: after scrolling past the title, a white sticky bar under the header shows "{Current section/category name} | 568 товаров" left + the same filter triggers + density toggle right, 1px bottom border.
- **Grid**: CSS grid, gap ~12px (2-col: 16px), cards from §6.1. 24 products per page, **infinite scroll** (load next 24 when near bottom; show skeletons). No visible pagination (but implement `?page=` for SEO / crawlable links).
- **Mobile**: title + count + **sliders icon** opens full-screen **"Фильтры" sheet**: "Вид отображения" (3 big toggle buttons), accordions for each filter, sticky bottom "Сбросить" (outlined) + "Применить" (green). Grid becomes 1 column by default.

### 5.3 Product detail page (PDP)
Desktop: **two halves**, full viewport height, page itself barely scrolls while the gallery scrolls.

**Left half (≈50% width) — gallery**
- Inner scroll container (`overflow-y:auto`, height 100vh) containing all product images stacked vertically, each full-width (≈708×1063).
- **Thumbnail rail** fixed at left edge (≈42×62 thumbs, 8px gap, x=10px), active thumb has 1px dark outline; clicking a thumb scrolls the stack to that image; scrolling updates active thumb.
- Click on image → **Fullscreen lightbox**: light grey bg, centered image, round black ‹ › buttons at sides, top-right pill **"🔖 В избранное"** (black) and round black `×`, zoom control pill at bottom (`⊕ 100% ⊖`), thumbnail strip in a translucent rounded tray at the bottom. Esc closes.

**Right half — info (sticky, max-width ~415px, left-aligned at ~130px from center)**
1. Collection/season: "ОСЕНЬ-ЗИМА" (14px/600 grey caps)
2. H1 name (28px/500)
3. Price 24px (sale: new price + struck-through old price grey)
4. Description, 16px/1.5 grey `#555`, clamped to ~5 lines + inline green underlined **"читать далее"** to expand.
5. Row: **color swatch** (40px circle, selected has 2px green ring) with color name below ("серый"); other colorways of same model shown as additional swatches linking to sibling products. On the right: black button **"Выбрать размер ⌄"** (≈195×46, radius 4) + square outlined **bookmark** button (46×46). Under them: small underlined link "Как узнать свой размер?" (opens size table drawer).
6. Size dropdown: list of sizes (46…58), 37px rows separated by hairlines; unavailable sizes greyed/disabled. After choosing, the button shows the size ("50 ⌄") and a full-width green **"В корзину"** button (56px tall) appears below. After adding → button text becomes **"В корзине"** (click opens cart drawer), toast shown, cart counter increments.
7. Accordion/rows (each 44px, 1px dividers, label 16px left, icon right):
   - **Детали** `+` → key/value table (label bold 13px left, value right grey): Артикул, Материал, Состав (e.g. "Верх: 100% шерсть; подкладка: 100% купро"), Вид ткани, Цвет, Орнамент (value is underlined link to filtered catalog), Полупрошивная конструкция (HALF CANVAS), Страна производства, Разрешительная документация ("Декларация ↗" external PDF).
   - **Посадка и особенности** `+` → key/values (Модель костюма, Тип лацкана, Fit, etc.).
   - **Наличие в магазинах** `›` → drawer (§5.3.1)
   - **Задать вопрос** `+` → rows: Телефон – "Позвонить" (tel:), Telegram – "Написать", MAX – "Написать".
   - **Доставка** `›` → drawer (§5.3.2)
   - **Корректировки изделия** `›` → drawer (§5.3.3)
   - (variant) "Узнать свой размер" row
8. Below the fold (full width): **"Вы недавно смотрели"** (H2 24px/600) + subtitle "Товары, которые вы просматривали ранее" + row of product cards (≈257px wide). Stored in `localStorage['viewed_products']`. (Optionally add "Complete the look"/"Similar" carousel.)

**5.3.1 Store availability drawer** — green info box at top ("Уточняйте наличие нужного размера по телефону бутика перед посещением"); list of stores: name ("Москва, Красная Пресня", 16px/600), address (grey), phone (green link), "Размеры:" then size chips (dark green bg, white text, e.g. "50 (6)" = size + qty; the currently selected size has an extra dark outline), right-aligned grey pill with total "29 шт."; separators between stores; sticky black full-width **"Адреса магазинов"** button → /shops.

**5.3.2 Delivery drawer** — centered truck icon in a light circle, title "Доставка по всей России — бесплатно", text about carrier pickup points, a 3-row table (Стоимость: бесплатно · Сроки: 3–7 рабочих дней · Оплата: при получении), grey rounded note "Можно отказаться от товара, если он не подошёл — за отказ деньги не берём.", footnote with carrier link.

**5.3.3 Alterations drawer** — scissors icon, title "Подгоним изделие по фигуре", text, "Доступные услуги:" with sub-groups ПИДЖАК / БРЮКИ each with ✓ bullet list, grey note box, footnote link "на странице магазинов".

**5.3.4 Size table drawer** (480px) — "Таблица размеров": section "Трикотаж" (explanation + table Размер | Обхват груди | Обхват талии for XS–XXL), section "Пиджаки, брюки, рубашки, жилеты" (46–58 with cm), sizes rendered in green bold; tip "Если сомневаетесь в размере, свяжитесь с нами…". Tables in bordered rounded containers with zebra-free hairlines.

**Mobile PDP**
- Full-screen vertical image pager (swipe/scroll), **vertical dash progress indicator** on the left edge (one dash per image, active brighter).
- Floating bottom bar: round dark translucent **back** button (‹) left, center dark pill **"Выбрать размер  80 000 ₽"**, round **↓** button right (scrolls to info; turns to ↑), and a round **bookmark** button floating above the ↓.
- "Выбрать размер" opens a **bottom sheet** (rounded top 16px, grabber): "Выберите размер" + `×`, 3-column grid of size buttons (outlined, radius 6), bottom button "Добавить в корзину" (disabled grey until a size is picked, then green).
- Info section below images: title, full description, swatch + price in one row (price 28px right), then same accordions.

### 5.4 Checkout `/checkout/step1..4`
Background light grey `#f7f7f7`; header solid.
- Top row: pill button "‹ В каталог" (white, border, radius 20) + H1 "Оформление заказа"; **stepper** on the right inside a light rounded track: numbered circles `1 Контакты` (active = black pill with white text) · `2 Доставка` · `3 Оплата` · `4 Заказ оформлен`.
- Left card (white, radius 16, padding 32): grey inner banner "Есть личный кабинет?" + black "Войти" (opens login drawer). "Контактная информация": Имя*, Фамилия* (2-col), Email*, Телефон* (masked +7). Inputs: 44px, light grey fill `#f5f5f5`, 1px border, radius 6. Divider, right-aligned **"Далее"** button (grey disabled → enabled when valid).
- Right card "Ваш заказ" with count badge (black circle): line items (thumb with qty badge, name, "50 · серый", price, `×`), totals "Товары (1)", "Доставка — Бесплатно" (green) "Не выбрано", **promo/certificate box** (tag icon, "Промокод или сертификат", green underlined "Войти" — requires login), "Итого 80 000 ₽" (24px bold).
- Step 2 Доставка: choose courier / pickup point (map of carrier PVZ) / boutique pickup; Step 3 Оплата: card online, SBP, pay on delivery, gift certificate; Step 4: confirmation with order number. *(Steps 2–4 were not opened during analysis to avoid submitting data — build per this standard flow.)*

### 5.5 Boutiques `/shops`
- Split: left column (~620px, scrollable list) / right side **sticky full-height map**.
- H1 "Наши бутики" (32px/600), subtitle "Приходите к нам, мы будем рады видеть вас".
- City filter chips: "Все города" (green filled active), "Москва", "Санкт-Петербург" (outlined).
- "5 бутиков найдено".
- Store card (padding 16, hover/selected = light grey bg `#f4f4f4` radius 8): name 16px/600, address grey, clock + hours, phone icon + phone; top-right: green **"Открыт"** badge (or brown "Закрыт" using `--closed-color`) + outlined green **"Построить маршрут →"** (opens Yandex/Google route). Bottom row with hairline above: live **crowd indicator** — colored dot + text ("Сейчас спокойная загрузка" green / "Сейчас стандартная популярность" amber) + small progress bar + "2/5".
- Clicking a card zooms the map to that store; clicking a marker highlights the card. Markers = 44px green circles with white brand emblem.

### 5.6 Lookbook
- `/lookbook`: white, centered 2-column grid (~425px tiles, 16px gap), tall cover images with title centered near bottom in white (e.g. "Men's underwear", "Father's Day", "POWER SUIT").
- `/lookbook/{slug}`: **no site header** — immersive. Floating white pill buttons top-left "‹ НАЗАД" and top-right "СЛЕД ›" (prev/next lookbook). Content blocks: intro image + centered spaced-caps paragraph; full-width video/photo with big white serif wordmark overlay; then **asymmetric 2-column pairs** (left image larger, right image smaller & vertically offset), each with a small spaced-caps caption under it (e.g. "КОСТЮМ ОДНОБОРТНЫЙ", "ТРЕНЧ КЛАССИЧЕСКИЙ"). Ideally make captions link to products ("shop the look").

### 5.7 Gift cards `/gift-cards`
- Centered column (~760px) over a white page with huge faint watermark text ("5 ЛЕТ" left, "GIFT CARD" right) and faint gift icons.
- Breadcrumbs, H1 "Подарочная карта", subtitle.
- "Выберите тип": two toggle chips — "✉ Электронная подарочная карта" (selected: green border + light green bg) / "🎁 Бумажный носитель".
- Feature line with icons: "Срок действия 5 лет" · "Отправка на email" · "Любой номинал от 5 000 ₽".
- Left: **live card preview** (~350×225, radius 12, shadow) showing chosen design (painting) + brand + amount bottom-right.
- Right: "ВЫБЕРИТЕ ДИЗАЙН" — 3 thumbnail swatches (selected green border); "ВЫБЕРИТЕ НОМИНАЛ" — chips 5 000 / 10 000 / 20 000 / 30 000 / 50 000 / 100 000 ₽ (selected = black fill). Green full-width "Оформить подарочную карту" → right drawer "Оформление подарочной карты" (preview, Тип, Дизайн name, Номинал, Итого, black "Перейти к оформлению"). Link "Частые вопросы о подарочных сертификатах →".

### 5.8 Made-to-Measure landing `/mtm`
Separate landing look (own header & footer):
- Header: hamburger + anchor links "О НАС · ТКАНИ · ПРОЦЕСС · АТЕЛЬЕ" (left), white serif logo (center), sand CTA **"Получить приглашение"** (`#f5d7a5` bg, `#0f0f0f` text, 16px/500, square corners, padding 0 20px) (right).
- Hero: full-screen video, centered: sand-colored spaced caps "КОСТЮМ ПО ВАШИМ МЕРКАМ", serif 48px "ИНЖЕНЕРНАЯ ПОСАДКА", white paragraph, sand CTA.
- Process (warm `#f5f3ef` bg): title "ЭКСКЛЮЗИВНЫЙ КОСТЮМ ЗА 5 НЕДЕЛЬ", 5 columns "01 ЗАЯВКА / 02 КОНСУЛЬТАЦИЯ / 03 ЗАМЕРЫ И ЭСКИЗ / 04 ПРИМЕРКА / 05 РЕЗУЛЬТАТ" (number, serif caps title, short text).
- Customization diagram (white): "МЫ СОБИРАЕМ КОСТЮМ ПОД ВАШ ЗАПРОС"; centered jacket cut-out image with 3 numbered features on each side (Лацканы, Пуговицы, Карманы | Подкладка, Внутренняя отделка, Шлицы) — left side right-aligned text.
- "ДЕТАЛИ ФОРМИРУЮТ ОБРАЗ" (warm bg): 3 image cards with serif caps titles.
- Fabrics: "ТКАНИ ВЕДУЩИХ ИТАЛЬЯНСКИХ И АНГЛИЙСКИХ МАНУФАКТУР" — 3×2 grid of fabric selvedge photos with mill names (Vitale Barberis Canonico, Reda, Zegna, Loro Piana, Cerruti, Holland & Sherry) + one-line description.
- Dark section "ПРИВАТНЫЙ ФОРМАТ ПОШИВА" (text left, arched-window photo right).
- "ПОСЛЕ ПЕРВОГО ЗАКАЗА ВСЁ СТАНОВИТСЯ ЕЩЁ ПРОЩЕ" — 3 numbered benefits.
- Final CTA over dark photo: "ПОЛУЧИТЕ ПРИГЛАШЕНИЕ К ПЕРСОНАЛЬНОМУ ПОРТНОМУ-СТИЛИСТУ" + sand button.
- Footer: anchor breadcrumbs "О нас / Ткани / Процесс / Ателье", two link columns (О компании / Покупателям), bottom bar "© 2026 BRAND", legal links, socials.
- **Invitation modal** (~890×640, black): left photo (tailor fitting client) with "MADE TO MEASURE" caption; right: sand caps kicker, serif "ПОЛУЧИТЬ ПРИГЛАШЕНИЕ", text, three contact rows (round outlined icon, tiny caps label "ПОЗВОНИТЬ / НАПИСАТЬ В", value "+7 … / Telegram / MAX", arrow →), hours line. (Optionally add a lead form.)

### 5.9 Loyalty `/loyalty-program`
Full dark page (`#121212` with subtle noise/vignette), sans heavy typography.
- Hero: tiny caps "ПРОГРАММА ЛОЯЛЬНОСТИ", 56px bold "BRAND" + italic grey "Privato", paragraph, white button "Вступить в клуб". Right: **stacked card carousel** of tier cards (painting image, "УРОВЕНЬ", tier name, threshold) with round ‹ › buttons.
- "УРОВНИ КЛУБА / Чем больше покупок — тем выше уровень": 5-column grid of tier cards (dark `#1a1a1a`, radius 8, border `#2a2a2a`): image top, name bold, Russian subtitle italic grey, spend range, **blurred benefit lines** (locked) + "🔒 ДОСТУПНО УЧАСТНИКАМ".
  Tiers: Registrato (0 ₽) → Conoscitore/Знаток (1–89 999) → Maestro d'Arte (90 000–129 999) → Virtuoso (130 000–199 999) → Architetto dello Stile (200 000–499 999) → Padrone di Moda (500 000+).
- "КАК ЭТО РАБОТАЕТ / Три шага до первых привилегий": 3 columns with vertical dividers (01 Зарегистрируйтесь, 02 Совершайте покупки, 03 Получайте привилегии).
- Final CTA with warm radial glow: "Станьте частью … Privato", white button "Вступить в клуб →" (opens login).

### 5.10 Service pages `/service/*`
- Two-column: left sidebar (~260px, right hairline divider): heading "Сервис и поддержка" (toggle) and list: Контакты, Доставка, Возврат и обмен, Гарантия, Часто задаваемые вопросы, Отслеживание заказа, Подарочные карты, Проблема с доступностью сайта (active = bold dark). Below: black button "Правовая информация" (switches sidebar to the legal docs list).
- Right content max ~780px: H1 28px/600, body 15px grey-blue `#64748b`, H3 subheads 16px/600.
- **Контакты**: 4 colored action buttons — "📞 Позвонить" (blue), "Telegram" (light blue), "💬 Чат на сайте" (black), "✉ Email" (grey); hours; text; bullet list with em-dash markers.
- **FAQ**: accordion list (question 15px/600, chevron right, hairlines). Questions: how to order, payment methods, tracking, returns (14 days), size, delivery to my city, contacting support, warranty…
- **Site-access** page: status card with green dot "Магазин работает в обычном режиме".
- Legal pages: same layout.

---

## 6. Reusable components

### 6.1 Product card (`a.product-card`)
- Whole card is a link to the PDP.
- Image box: aspect **0.64** (640×1000), background light grey for flat-lay shots, `object-fit: cover`, radius 4–6px.
- **Hover scrub**: card has N images (3 typical); the image area is split into N invisible vertical zones; moving the cursor across switches image. Thin **segment indicator** at bottom of image (N white 2px bars with gaps, active = solid white, others 40% white), shown on hover. On touch devices: horizontal swipe.
- Top-left badge "NEW" (if new). Top-right 32px white 90% round **bookmark button** (grey icon; filled green state when favorited) — click toggles favorite without navigation (`preventDefault`).
- Bottom-left over image: **season tag** ("ОСЕНЬ-ЗИМА").
- Below image (8px gap): name (14px/500, one line ellipsis), row: price (15px) + optional old price (12px struck grey) + **color dot(s)** (8px circles of available colors).
- Skeleton state while loading.

### 6.2 Buttons
| Variant | Style |
|---|---|
| Primary | bg `#386e44`, white text 15px/600, height 52–56px, radius 4–6px, hover `#2d5a37` |
| Dark | bg `#1a1a1a`, white, radius 4–6px |
| Outline | white bg, 1px `#e2e8f0`, dark text, radius 6px |
| Pill | radius 999px (lightbox, checkout back, lookbook nav) |
| Text link | underline, 1px offset 2–3px |
| Icon round | 40px circle, 1px border (carousel arrows) |
| Sand CTA (MTM) | `#f5d7a5` bg, black text, square |

### 6.3 Dropdown
White, 1px border `#e5e7eb`, radius 4px, shadow-md, padding 12–16px, appears under trigger; trigger gets grey bg while open; closes on outside click/Esc; only one open at a time.

### 6.4 Accordion
Row 44px, 1px bottom border `#eee`, label left, `+`/`−` right, content animated height. PDP: single-open; menu: multi-open.

### 6.5 Inputs
- Form (checkout): 44px, `#f5f5f5` fill, 1px `#e5e7eb`, radius 6, 15px, label 13px/600 above with `*`.
- Minimal (login/newsletter): borderless with 1px bottom border, 16px.
- Phone mask + country selector.
- Checkboxes: 16px square, 1px grey border, radius 3, checked = green.

### 6.6 Toast
Fixed top-right 20px, white card radius 8, shadow-lg, 14px text, progress bar green at the bottom shrinking over 3s.

### 6.7 Carousel
Native horizontal scroll with `scroll-snap-type: x mandatory`, hidden scrollbar, arrow buttons scroll by one card, drag-to-scroll on desktop.

---

## 7. Data model (minimum)

```ts
Product {
  id: string            // e.g. "1790754730" (used in slug)
  sku: string           // "AK-453" (Артикул)
  slug: string
  name: string
  categoryId: string; subcategoryId: string
  season: "осень-зима" | "весна-лето" | "всесезон"
  style: "Классика" | "Кэжуал" | "Смарт Кэжуал"
  price: number; oldPrice?: number; currency: "RUB"
  isNew: boolean; isComingSoon: boolean; isSpecialOffer: boolean
  description: string
  color: { name: string; hex: string }
  colorSiblings: ProductRef[]            // same model other colors
  images: { url: string; alt: string; type: "model"|"detail"|"flat" }[]
  sizes: { value: string; available: boolean; stockByStore: { storeId: string; qty: number }[] }[]
  sizeSystem: "letter" | "numeric"
  attributes: { label: string; value: string; link?: string }[]  // Материал, Состав, Вид ткани, Орнамент, Конструкция, Страна…
  fitAttributes: { label: string; value: string }[]               // Посадка и особенности
  certificateUrl?: string                                         // Декларация
  alterationServices?: { group: string; items: string[] }[]
  createdAt: Date; popularity: number
}
Category { id, slug, name, parentId?, image, order, showInMenu, showInStrip }
Store { id, city, name, address, phone, hours, lat, lng, isOpenNow(), crowdLevel(1..5) }
Cart { id, items: { productId, size, qty, price }[], promoCode?, giftCertificate? }
Order { id, contacts, delivery, payment, items, totals, status }
User { id, phone, email?, name, loyaltyTier, totalSpent, favorites[], measurements?, consents{pd, loyalty, marketing} }
GiftCard { type: "electronic"|"paper", designId, amount, recipientEmail?, validityYears: 5 }
Lookbook { slug, title, cover, blocks: (image|video|text|pair)[] }
HeroSlide { kicker, title, offer, ctaLabel, url, mediaDesktop, mediaMobile, type: "image"|"video" }
Banner { text, url, active }
```

Admin/CMS must manage: hero slides, home category tiles, feature banner, promo bar, menu tree, lookbooks, stores, gift-card designs/amounts, FAQ, legal pages, loyalty tiers.

## 8. Client-side state & persistence

| Key | Purpose |
|---|---|
| `cerca-favorites` | guest wishlist IDs |
| `catalog_view_mode` | grid density (values seen: `large`, standard, …) |
| `viewed_products` | recently viewed list (PDP bottom) |
| `cerca_cookie_consent` | consent choices |
| Cart | server-side, keyed by session cookie (survives reload), merged on login |
| Promo bar dismissed | localStorage flag |

## 9. Responsive rules
- Breakpoint **768px** (`md:`) switches desktop header ↔ mobile header, PDP split ↔ fullscreen pager + bottom bar, filter dropdowns ↔ full-screen filter sheet, category mosaic 3 → 2 columns.
- Container side padding: 58px desktop, 16px mobile.
- Catalog columns: desktop 3 default (4/2 options); tablet 2; mobile 1 (2 option).
- Drawers become full-width on mobile; size picker becomes bottom sheet.
- Use `100svh` for hero/gallery so mobile browser bars don't break layout.

## 10. Analytics & integrations to replicate
- E-commerce events: `view_item_list`, `select_item`, `view_item`, `add_to_wishlist`, `add_to_cart`, `remove_from_cart`, `view_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `search`.
- Loyalty SDK cart sync on every cart change.
- Call-tracking script on phone numbers.
- Messenger deep links (Telegram, MAX bot, WhatsApp if relevant).

## 11. Accessibility & quality
- All icon buttons have `aria-label` (Меню, Поиск, Войти в личный кабинет, Избранное, Корзина, Закрыть баннер, Удалить из корзины).
- Focus trap inside drawers/modals; Esc closes; return focus to trigger.
- Hero video `muted playsinline`, provide poster; respect `prefers-reduced-motion` (no autoplay).
- Contrast: header color-flip guarantees legibility over media.
- Lazy-load images below fold; `fetchpriority="high"` on first hero image.

## 12. Build checklist (acceptance criteria)
1. Fixed transparent header that flips white/black over dark/light sections; solid white on inner pages; promo bar above it, dismissible.
2. Left burger drawer with accordion taxonomy; mobile full-screen version.
3. Top search overlay with suggestions + live results grid.
4. Home: video/photo hero slider with counter, 3-col category mosaic incl. "Весь каталог" tile, feature banner, new-arrivals carousel, black 3-tier footer.
5. Catalog: breadcrumbs, title+count, optional category strip, 5 dropdown filters (size groups w/ size-table link, color bars, style, price range, sort), green active dots, 4/3/2 density toggle (persisted), sticky filter bar, infinite scroll (24/page), URL-synced params.
6. Product card with hover image scrub, segment indicator, NEW + season badges, favorite toggle, color dots, sale price.
7. PDP: thumbnail rail + vertical image stack + lightbox with zoom; sticky info; read-more; swatches; size dropdown → green add-to-cart → "В корзине"; accordions; drawers for store stock (per-size per-store counts), delivery, alterations, size table; recently viewed.
8. Mobile PDP: vertical pager, dash indicator, floating bottom action bar, size bottom sheet.
9. Cart drawer with qty stepper, remove, total CTA, empty state; toast on add.
10. Favorites (guest + account), empty popover vs. page.
11. 4-step checkout with order summary card and promo/certificate block.
12. Login drawer: phone (country selector) + captcha + consents, email/password alternative.
13. Boutiques page with city chips, live open/closed + crowd meter, route button, synced interactive map.
14. Lookbook index + immersive story pages with prev/next pills.
15. Gift-card configurator with live preview + summary drawer.
16. MTM landing with its own header/footer and invitation modal.
17. Dark loyalty club page with tier carousel and locked tier grid.
18. Service/legal pages with sidebar navigation; FAQ accordion; contacts action buttons.
19. Newsletter modal, cookie consent, SEO meta/OG, analytics events.
