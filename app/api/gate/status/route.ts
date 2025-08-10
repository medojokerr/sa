import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  const unlocked = (await cookieStore).get("dash_unlock")?.value === "1"
  return new Response(JSON.stringify({ unlocked }), { status: 200 })
}
