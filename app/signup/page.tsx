"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { AuthShell, Field } from "@/components/auth-shell"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const { signup } = useAuth()
  const router = useRouter()
  const [asCreator, setAsCreator] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", age: "", preferences: "" })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function update(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signup(
        {
          name: form.name,
          email: form.email,
          password: form.password,
          age: Number(form.age),
          preferences: form.preferences
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean),
        },
        asCreator,
      )
      router.push(asCreator ? "/creator" : "/sessions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Únete a SportsAndChill y empieza a entrenar."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      {/* Selector de tipo de cuenta */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-lg border border-border bg-secondary p-1">
        <button
          type="button"
          onClick={() => setAsCreator(false)}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            !asCreator ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Soy deportista
        </button>
        <button
          type="button"
          onClick={() => setAsCreator(true)}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            asCreator ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Soy entrenador
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}
        <Field
          label="Nombre de usuario"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="tu_nombre"
        />
        <Field
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="tu@email.com"
        />
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Contraseña"
            type="password"
            required
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
          />
          <Field
            label="Edad"
            type="number"
            min={1}
            required
            value={form.age}
            onChange={(e) => update("age", e.target.value)}
            placeholder="25"
          />
        </div>
        <Field
          label="Preferencias (separadas por comas)"
          value={form.preferences}
          onChange={(e) => update("preferences", e.target.value)}
          placeholder="yoga, running, fuerza"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {asCreator ? "Crear cuenta de entrenador" : "Crear cuenta"}
        </button>
      </form>
    </AuthShell>
  )
}
