"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, CalendarPlus, CheckCircle2, Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createReservation } from "@/lib/api"
import { spotsLeft } from "@/lib/helpers"
import type { Session } from "@/lib/types"
import { mutate } from "swr"

export function ReserveBox({ session }: { session: Session }) {
  const { isAuthenticated, isCreator } = useAuth()
  const router = useRouter()
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const left = spotsLeft(session)
  const full = left === 0

  async function handleReserve(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await createReservation({ sessionId: session._id, date })
      setSuccess(true)
      // Revalida sesiones y reservas
      mutate("sessions")
      mutate("session-" + session._id)
      mutate("my-reservations")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al reservar")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-card-foreground">Reserva tu plaza</h3>
        <p className="mt-1 text-sm text-muted-foreground">Inicia sesión para poder reservar esta sesión.</p>
        <Link
          href="/login"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <LogIn className="h-4 w-4" /> Iniciar sesión
        </Link>
      </div>
    )
  }

  if (isCreator) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Las cuentas de entrenador no pueden reservar sesiones. Usa una cuenta de deportista para reservar.
      </div>
    )
  }

  if (success) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6">
        <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
        <h3 className="mt-2 text-lg font-bold text-card-foreground">¡Reserva confirmada!</h3>
        <p className="mt-1 text-sm text-muted-foreground">Tu plaza está asegurada.</p>
        <Link
          href="/reservations"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ver mis reservas
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleReserve} className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-bold text-card-foreground">Reserva tu plaza</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {full ? "Esta sesión está completa." : `Quedan ${left} plaza${left === 1 ? "" : "s"} disponibles.`}
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-card-foreground">Fecha de la sesión</span>
        <input
          type="datetime-local"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </label>

      <button
        type="submit"
        disabled={loading || full}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
        {full ? "Sesión completa" : "Reservar ahora"}
      </button>
    </form>
  )
}
