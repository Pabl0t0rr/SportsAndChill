"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Search, SlidersHorizontal } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionCard } from "@/components/session-card"
import { fetchSessions } from "@/lib/api"
import { LEVELS } from "@/lib/helpers"
import type { LevelSession } from "@/lib/types"

export default function SessionsPage() {
  const { data: sessions, isLoading, error } = useSWR("sessions", fetchSessions)
  const [query, setQuery] = useState("")
  const [level, setLevel] = useState<LevelSession | "all">("all")
  const [type, setType] = useState<string>("all")

  const types = useMemo(() => {
    const set = new Set<string>()
    sessions?.forEach((s) => set.add(s.type))
    return Array.from(set).sort()
  }, [sessions])

  const filtered = useMemo(() => {
    return (sessions ?? []).filter((s) => {
      const matchQuery =
        !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.instructor.toLowerCase().includes(query.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      const matchLevel = level === "all" || s.level === level
      const matchType = type === "all" || s.type === type
      return matchQuery && matchLevel && matchType
    })
  }, [sessions, query, level, type])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Explorar sesiones</h1>
          <p className="mt-1 text-muted-foreground">Encuentra la sesión perfecta y reserva tu plaza.</p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, entrenador o etiqueta…"
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as LevelSession | "all")}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            >
              <option value="all">Todos los niveles</option>
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
            >
              <option value="all">Todos los tipos</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultados */}
        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            No se pudieron cargar las sesiones. Verifica que el backend esté en marcha.
          </div>
        ) : isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {filtered.length} sesión{filtered.length === 1 ? "" : "es"} encontrada
              {filtered.length === 1 ? "" : "s"}
            </p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <SessionCard key={s._id} session={s} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No hay sesiones que coincidan con tu búsqueda.
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
