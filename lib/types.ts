// Niveles posibles de una sesión (coinciden con el enum LevelSession del backend)
export type LevelSession = "Beginner" | "Intermediate" | "Advanced"

export type TypeUser = "User" | "sessionCreator" | "Admin"

export interface Session {
  _id: string
  title: string
  type: string
  level: LevelSession
  duration: number
  instructor: string
  capacity: number
  reserved: number
  tags: string[]
}

export interface Reservation {
  _id: string
  session: Session
  date: string
  status: string
}

export interface User {
  _id: string
  name: string
  email: string
  age: number
  preferences?: string[]
  reservations?: Reservation[]
  typeUser?: TypeUser
}

export interface AuthPayload {
  token: string
  user: User
}
