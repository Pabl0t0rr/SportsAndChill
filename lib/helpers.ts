import type { LevelSession } from "./types"

export function levelLabel(level: LevelSession): string {
  switch (level) {
    case "Beginner":
      return "Principiante"
    case "Intermediate":
      return "Intermedio"
    case "Advanced":
      return "Avanzado"
    default:
      return level
  }
}

export function levelClasses(level: LevelSession): string {
  switch (level) {
    case "Beginner":
      return "bg-accent/15 text-accent-foreground border-accent/30"
    case "Intermediate":
      return "bg-primary/15 text-primary border-primary/30"
    case "Advanced":
      return "bg-destructive/15 text-destructive border-destructive/30"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function spotsLeft(session: { capacity: number; reserved: number }): number {
  return Math.max(0, session.capacity - session.reserved)
}

export const LEVELS: { value: LevelSession; label: string }[] = [
  { value: "Beginner", label: "Principiante" },
  { value: "Intermediate", label: "Intermedio" },
  { value: "Advanced", label: "Avanzado" },
]
