import { ImageResponse } from "next/og";

// 1200x630 raster OG image. Social platforms do not render SVG og:images.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Momotombo Travels — Viajes y expediciones en Nicaragua";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #8a3824 0%, #1e3b2f 100%)",
          color: "#fff8f4",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 32,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#c49a45",
          }}
        >
          Momotombo Travels
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 84, lineHeight: 1.05, maxWidth: 900 }}>
            Descubre el alma de Nicaragua
          </div>
          <div style={{ fontSize: 34, opacity: 0.9, maxWidth: 860 }}>
            Volcanes activos, islas, selva y costa pacífica. Expediciones
            diseñadas por expertos locales.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#c49a45" }}>
          momotombo.travel
        </div>
      </div>
    ),
    { ...size }
  );
}
