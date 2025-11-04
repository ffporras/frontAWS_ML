import { NextRequest, NextResponse } from "next/server"

// Duplicate constant to avoid importing client helpers into the route bundle
const MOVIES_API = "https://cq6rnraumra73ggndaubv4mslu0uzasy.lambda-url.us-east-1.on.aws"

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.toString()
  const url = `${MOVIES_API}/movies${search ? `?${search}` : ""}`
  try {
    const resp = await fetch(url, { cache: "no-store" })
    const text = await resp.text()
    const data = text ? JSON.parse(text) : null
    if (!resp.ok) {
      return NextResponse.json({ error: data || "Upstream error" }, { status: resp.status })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const resp = await fetch(`${MOVIES_API}/movies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const text = await resp.text()
    const data = text ? JSON.parse(text) : null
    if (!resp.ok) {
      return NextResponse.json({ error: data || "Upstream error" }, { status: resp.status })
    }
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 })
  }
}


