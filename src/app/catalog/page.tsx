import type { Metadata } from "next";
import { CatalogView } from "@/components/CatalogView";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог Gerutti: куртки на кнопках в четырёх оттенках осени.",
};

export default function CatalogPage() {
  return <CatalogView />;
}
