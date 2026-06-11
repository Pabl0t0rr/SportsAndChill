import { gqlRequest } from "./graphql-client"
import type { AuthPayload, Reservation, Session, User } from "./types"

// ---- Fragmentos reutilizables ----
const SESSION_FIELDS = `
  _id
  title
  type
  level
  duration
  instructor
  capacity
  reserved
  tags
`

// =====================  QUERIES  =====================

// Query: sessions  -> [Session]!
export async function fetchSessions(): Promise<Session[]> {
  const data = await gqlRequest<{ sessions: Session[] }>(
    `query Sessions { sessions { ${SESSION_FIELDS} } }`,
  )
  return data.sessions
}

// Query: session(id) -> Session
export async function fetchSession(id: string): Promise<Session> {
  const data = await gqlRequest<{ session: Session }>(
    `query Session($id: ID!) { session(id: $id) { ${SESSION_FIELDS} } }`,
    { id },
  )
  return data.session
}

// Query: users -> [User]!  (incluye reservaciones de cada usuario)
export async function fetchUsers(): Promise<User[]> {
  const data = await gqlRequest<{ users: User[] }>(
    `query Users {
      users {
        _id
        name
        email
        age
        preferences
        typeUser
        reservations {
          _id
          date
          status
          session { ${SESSION_FIELDS} }
        }
      }
    }`,
  )
  return data.users
}

// =====================  MUTATIONS · AUTH  =====================

// Mutation: registerUser -> AuthPayload!
export async function registerUser(input: {
  name: string
  email: string
  password: string
  age: number
  preferences?: string[]
}): Promise<AuthPayload> {
  const data = await gqlRequest<{ registerUser: AuthPayload }>(
    `mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) {
        token
        user { _id name email age preferences typeUser }
      }
    }`,
    { input },
  )
  return data.registerUser
}

// Mutation: registerSessionCreator -> AuthPayload!
export async function registerSessionCreator(input: {
  name: string
  email: string
  password: string
  age: number
  preferences?: string[]
}): Promise<AuthPayload> {
  const data = await gqlRequest<{ registerSessionCreator: AuthPayload }>(
    `mutation RegisterSessionCreator($input: RegisterUserInput!) {
      registerSessionCreator(input: $input) {
        token
        user { _id name email age preferences typeUser }
      }
    }`,
    { input },
  )
  return data.registerSessionCreator
}

// Mutation: loginUser -> String!  (devuelve solo el token)
export async function loginUser(input: {
  email: string
  password: string
}): Promise<string> {
  const data = await gqlRequest<{ loginUser: string }>(
    `mutation LoginUser($input: LoginUserInput!) { loginUser(input: $input) }`,
    { input },
  )
  return data.loginUser
}

// =====================  MUTATIONS · SESSIONS  =====================

// Mutation: createSession -> Session!  (solo sessionCreator)
export async function createSession(input: {
  title: string
  type: string
  level: string
  duration: number
  capacity: number
  tags: string[]
}): Promise<Session> {
  const data = await gqlRequest<{ createSession: Session }>(
    `mutation CreateSession($input: CreateSessionInput!) {
      createSession(input: $input) { ${SESSION_FIELDS} }
    }`,
    { input },
  )
  return data.createSession
}

// Mutation: modifySession -> Session!  (solo el creador de la sesión)
export async function modifySession(
  sessionId: string,
  input: {
    title?: string
    type?: string
    level?: string
    duration?: number
    capacity?: number
    tags?: string[]
  },
): Promise<Session> {
  const data = await gqlRequest<{ modifySession: Session }>(
    `mutation ModifySession($sessionId: ID!, $input: ModifySessionInput!) {
      modifySession(sessionId: $sessionId, input: $input) { ${SESSION_FIELDS} }
    }`,
    { sessionId, input },
  )
  return data.modifySession
}

// =====================  MUTATIONS · RESERVATIONS  =====================

// Mutation: createReservation -> Reservation!
export async function createReservation(input: {
  sessionId: string
  date: string
}): Promise<Reservation> {
  const data = await gqlRequest<{ createReservation: Reservation }>(
    `mutation CreateReservation($input: ReserveSessionInput!) {
      createReservation(input: $input) {
        _id
        date
        status
        session { ${SESSION_FIELDS} }
      }
    }`,
    { input },
  )
  return data.createReservation
}

// Mutation: cancelledReservation -> Reservation!
export async function cancelReservation(input: {
  sessionId: string
}): Promise<Reservation> {
  const data = await gqlRequest<{ cancelledReservation: Reservation }>(
    `mutation CancelledReservation($input: CancelledReservationInput!) {
      cancelledReservation(input: $input) {
        _id
        date
        status
        session { ${SESSION_FIELDS} }
      }
    }`,
    { input },
  )
  return data.cancelledReservation
}
