import { gql } from "apollo-server";

export const typeDefs = gql`

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
        level: String!,
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
        level: String!,
        duration: Int!,
        instructor: String!,
        capacity: Int!,
        tags: [String]!,
    }

    input ReserveSessionInput {
        userId: ID!,
        sessionId: ID!,
        date: String!,
    }

    type Query {
        users: [User]!,
        sessions: [Session]!,
        session(id: ID!): Session,
    }

    type Mutation {
        registerUser(input: RegisterUserInput!): AuthPayload!,
        loginUser(input: LoginUserInput!): AuthPayload!,
        createSession(input: CreateSessionInput!): Session!,
        reserveSession(input: ReserveSessionInput!): Reservation!,
    }

`;
