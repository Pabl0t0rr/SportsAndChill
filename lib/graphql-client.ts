const TOKEN_KEY = "sportsandchill_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

export class GraphQLError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "GraphQLError"
  }
}

/**
 * Ejecuta una operación GraphQL a través del proxy interno de Next.js (/api/graphql),
 * que reenvía la petición al backend Apollo Server.
 */
export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = getToken()

  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // El backend espera el token directamente en "authorization" (sin "Bearer ")
      ...(token ? { authorization: token } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })

  const json = await res.json()

  if (json.errors && json.errors.length > 0) {
    throw new GraphQLError(json.errors[0].message || "Error en la petición")
  }

  if (!res.ok) {
    throw new GraphQLError("Error de red al contactar el servidor")
  }

  return json.data as T
}
