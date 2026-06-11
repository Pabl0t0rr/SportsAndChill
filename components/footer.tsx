import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Dumbbell className="h-4 w-4" />
          </span>
          Sports<span className="-ml-1 text-primary">And</span>Chill
        </Link>
        <p className="text-sm text-muted-foreground">
          Entrena cuando quieras, donde quieras. Reserva tu próxima sesión.
        </p>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} SportsAndChill</p>
      </div>
    </footer>
  )
}
