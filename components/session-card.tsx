import Link from "next/link"
import { Clock, Users, User as UserIcon } from "lucide-react"
import type { Session } from "@/lib/types"
import { levelClasses, levelLabel, spotsLeft } from "@/lib/helpers"

export function SessionCard({ session }: { session: Session }) {
  const left = spotsLeft(session)
  const full = left === 0

  return (
    <Link
      href={`/sessions/${session._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{session.type}</p>
          <h3 className="mt-1 text-balance text-lg font-bold leading-tight text-card-foreground group-hover:text-primary">
            {session.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${levelClasses(session.level)}`}
        >
          {levelLabel(session.level)}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <UserIcon className="h-4 w-4" /> {session.instructor}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" /> {session.duration} min
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4" /> {session.reserved}/{session.capacity}
        </span>
      </div>

      {session.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-3">
          {session.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-3">
        <span className={`text-sm font-semibold ${full ? "text-destructive" : "text-accent-foreground"}`}>
          {full ? "Completo" : `${left} plaza${left === 1 ? "" : "s"} libre${left === 1 ? "" : "s"}`}
        </span>
        <span className="text-sm font-semibold text-primary group-hover:underline">Ver detalle →</span>
      </div>
    </Link>
  )
}
