import { NextRequest, NextResponse } from "next/server"

const MOVIES_API = "https://cq6rnraumra73ggndaubv4mslu0uzasy.lambda-url.us-east-1.on.aws"

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resp = await fetch(`${MOVIES_API}/movies/${params.id}`, { cache: "no-store" })
    const text = await resp.text()
    const data = text ? JSON.parse(text) : null
    if (!resp.ok) return NextResponse.json({ error: data || "Upstream error" }, { status: resp.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const resp = await fetch(`${MOVIES_API}/movies/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const text = await resp.text()
    const data = text ? JSON.parse(text) : null
    if (!resp.ok) return NextResponse.json({ error: data || "Upstream error" }, { status: resp.status })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const resp = await fetch(`${MOVIES_API}/movies/${params.id}`, { method: "DELETE" })
    if (!resp.ok) return NextResponse.json({ error: "Upstream error" }, { status: resp.status })
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 })
  }
}


