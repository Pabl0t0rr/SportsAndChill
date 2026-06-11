import { NextRequest, NextResponse } from "next/server"

// URL del backend Apollo Server. Por defecto apunta a localhost:4000.
// Configurable con la variable de entorno BACKEND_GRAPHQL_URL.
const BACKEND_URL = process.env.BACKEND_GRAPHQL_URL || "http://localhost:4000/"

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    // El backend lee el token directamente desde el header "authorization" (sin prefijo Bearer)
    const authorization = req.headers.get("authorization") || ""

    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authorization ? { authorization } : {}),
      },
      body,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err) {
    return NextResponse.json(
      {
        errors: [
          {
            message:
              "No se pudo conectar con el servidor GraphQL. Asegúrate de que el backend esté corriendo (npm run backend) y de configurar BACKEND_GRAPHQL_URL.",
          },
        ],
      },
      { status: 502 },
    )
  }
}
