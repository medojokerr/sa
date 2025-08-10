import { ImageResponse } from "next/og"

export const runtime = "edge"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OG() {
  const { width, height } = size
  return new ImageResponse(
    (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#0b0f19,#0b0f19 40%,#065f46)",
          color: "white",
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: -1.5,
        }}
      >
        KYCtrust
      </div>
    ),
    { ...size }
  )
}
