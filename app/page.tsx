"use client"

import Link from "next/link"
import useSWR from "swr"
import { ArrowRight, CalendarCheck, Dumbbell, Search, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SessionCard } from "@/components/session-card"
import { fetchSessions } from "@/lib/api"

export default function HomePage() {
  const { data: sessions, isLoading } = useSWR("sessions", fetchSessions)
  const featured = sessions?.slice(0, 6) ?? []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src="/hero-training.png"
            alt="Grupo entrenando al aire libre"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <span className="flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" /> Tu energía, tu horario
          </span>
          <h1 className="max-w-2xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Reserva sesiones deportivas y entrena a tu ritmo
          </h1>
          <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Yoga, crossfit, running y mucho más. Descubre sesiones cerca de ti, reserva tu plaza en segundos y conecta
            con los mejores entrenadores.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sessions"
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Explorar sesiones <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signup"
              className="rounded-lg border border-border bg-card px-6 py-3 font-semibold text-card-foreground transition-colors hover:bg-secondary"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          {
            icon: Search,
            title: "Descubre",
            text: "Filtra por tipo, nivel y etiquetas para encontrar la sesión perfecta para ti.",
          },
          {
            icon: CalendarCheck,
            title: "Reserva",
            text: "Asegura tu plaza al instante y gestiona todas tus reservas en un solo lugar.",
          },
          {
            icon: Dumbbell,
            title: "Entrena",
            text: "¿Eres entrenador? Crea y gestiona tus propias sesiones desde tu panel.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-card p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <f.icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-card-foreground">{f.title}</h3>
            <p className="mt-1 leading-relaxed text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Featured sessions */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Sesiones destacadas</h2>
            <p className="mt-1 text-muted-foreground">Las últimas sesiones disponibles en la plataforma.</p>
          </div>
          <Link href="/sessions" className="shrink-0 text-sm font-semibold text-primary hover:underline">
            Ver todas →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <SessionCard key={s._id} session={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            Aún no hay sesiones disponibles. Si eres entrenador,{" "}
            <Link href="/creator" className="font-semibold text-primary hover:underline">
              crea la primera
            </Link>
            .
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
