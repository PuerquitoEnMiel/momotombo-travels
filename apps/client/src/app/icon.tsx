import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          // Gran Fusión brand palette (volcanic terracotta → canopy emerald)
          background: "linear-gradient(135deg, #8a3824 0%, #1e3b2f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c49a45",
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
