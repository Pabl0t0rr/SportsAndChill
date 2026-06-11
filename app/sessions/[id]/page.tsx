"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { ArrowLeft, Clock, Tag, Users, User as UserIcon } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReserveBox } from "@/components/reserve-box"
import { fetchSession } from "@/lib/api"
import { levelClasses, levelLabel } from "@/lib/helpers"

export default function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, isLoading, error } = useSWR("session-" + id, () => fetchSession(id))

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/sessions"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a explorar
        </Link>

        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
            No se pudo cargar la sesión.
          </div>
        ) : isLoading ? (
          <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
        ) : !session ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            Sesión no encontrada.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Info principal */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">{session.type}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${levelClasses(session.level)}`}
                >
                  {levelLabel(session.level)}
                </span>
              </div>
              <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                {session.title}
              </h1>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat icon={UserIcon} label="Instructor" value={session.instructor} />
                <Stat icon={Clock} label="Duración" value={`${session.duration} min`} />
                <Stat
                  icon={Users}
                  label="Plazas"
                  value={`${session.reserved}/${session.capacity}`}
                />
              </div>

              {session.tags?.length > 0 && (
                <div className="mt-8">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Tag className="h-4 w-4" /> Etiquetas
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar reserva */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ReserveBox session={session} />
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <p className="mt-1 font-bold text-card-foreground">{value}</p>
    </div>
  )
}
