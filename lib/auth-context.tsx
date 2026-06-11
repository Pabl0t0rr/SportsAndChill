"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { clearToken, getToken, setToken } from "./graphql-client"
import { fetchUsers, loginUser, registerSessionCreator, registerUser } from "./api"
import type { User } from "./types"

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  isCreator: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (input: SignupInput, asCreator: boolean) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

interface SignupInput {
  name: string
  email: string
  password: string
  age: number
  preferences?: string[]
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const EMAIL_KEY = "sportsandchill_email"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carga el usuario actual usando la query users (no existe query "me" en el backend),
  // emparejando por el email guardado tras el login.
  const loadCurrentUser = useCallback(async () => {
    const token = getToken()
    const email = typeof window !== "undefined" ? window.localStorage.getItem(EMAIL_KEY) : null
    if (!token || !email) {
      setUser(null)
      return
    }
    try {
      const users = await fetchUsers()
      const found = users.find((u) => u.email === email) ?? null
      setUser(found)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadCurrentUser().finally(() => setLoading(false))
  }, [loadCurrentUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const token = await loginUser({ email, password })
      setToken(token)
      window.localStorage.setItem(EMAIL_KEY, email)
      await loadCurrentUser()
    },
    [loadCurrentUser],
  )

  const signup = useCallback(async (input: SignupInput, asCreator: boolean) => {
    const payload = asCreator ? await registerSessionCreator(input) : await registerUser(input)
    setToken(payload.token)
    window.localStorage.setItem(EMAIL_KEY, payload.user.email)
    setUser(payload.user)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    if (typeof window !== "undefined") window.localStorage.removeItem(EMAIL_KEY)
    setUser(null)
  }, [])

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    isCreator: user?.typeUser === "sessionCreator",
    login,
    signup,
    logout,
    refresh: loadCurrentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
