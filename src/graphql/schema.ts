import { gql } from "apollo-server";

export const typeDefs = gql`

    enum LevelSession {
        Beginner
        Intermediate
        Advanced
    }

    type User {
        _id: ID!,
        name: String!,
        email: String!,
        age: Int!,
        preferences: [String],
        reservations: [Reservation],
        typeUser: String
    }

    type Reservation {
        _id: ID!,
        session: Session!,
        date: String!,
        status: String!,
    }

    type Session {
        _id: ID!,
        title: String!,
        type: String!,
        level: LevelSession!,
        duration: Int!,
        instructor: String!,
        capacity: Int!,
        reserved: Int!,
        tags: [String]!,
    }

    type AuthPayload {
        token: String!,
        user: User!,
    }

    input RegisterUserInput {
        name: String!,
        email: String!,
        password: String!,
        age: Int!,
        preferences: [String],
    }

    input LoginUserInput {
        email: String!,
        password: String!,
    }

    input CreateSessionInput {
        title: String!,
        type: String!,
        level: LevelSession!,
        duration: Int!,
        instructor: String!,
        capacity: Int!,
        tags: [String]!,
    }

    input ReserveSessionInput {
        sessionId: String!,
        date: String!,
    }
    input CancelledReservationInput {
        sessionId: String!,
    }

    type Query {
        users: [User]!,
        sessions: [Session]!,
        session(id: ID!): Session,
    }

    type Mutation {
        registerUser(input: RegisterUserInput!): AuthPayload!,
        loginUser(input: LoginUserInput!): String!,
        registerSessionCreator(input: RegisterUserInput!): AuthPayload!,
        createSession(input: CreateSessionInput!): Session!,
        createReservation(input: ReserveSessionInput!): Reservation!,
        cancelledReservation(input: CancelledReservationInput!): Reservation!
    }

`;
