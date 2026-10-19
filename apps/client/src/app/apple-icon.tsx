import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          // Gran Fusión brand palette (volcanic terracotta → canopy emerald)
          background: "linear-gradient(135deg, #8a3824 0%, #1e3b2f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c49a45",
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
