import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Momotombo Travels",
    short_name: "Momotombo",
    description: "Descubre Nicaragua con IA: itinerarios personalizados, reservas y guías locales.",
    start_url: "/",
    display: "standalone",
    background_color: "#121212",
    theme_color: "#004f96",
    orientation: "portrait",
    lang: "es",
    categories: ["travel", "lifestyle", "productivity"],
    icons: [
      // Only reference assets that exist in /public (icon-192.png and
      // icon-512.png were never generated and broke PWA validation).
      { src: "/icons/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
