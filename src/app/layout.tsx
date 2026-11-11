import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "./globals.css";
import { site } from "@/data/site";
import { asset } from "@/lib/asset";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Overlays } from "@/components/Overlays";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.wordmark} — мужская одежда`,
    template: `%s — ${site.wordmark}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.wordmark} — мужская одежда`,
    description: site.description,
    images: [asset("/media/og.jpg")],
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f1e9de",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="has-promo">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <Overlays />
        </Providers>
      </body>
    </html>
  );
}
