import { IResolvers } from "@graphql-tools/utils"
import { signToken } from "../controllers/auth.controllers";
import { createUser, duplicatedName, getUserReservations, loginUser, showAllUsers } from "../controllers/user.controllers";
import { allSessions, sessionById, createSession } from "../controllers/sessions.controllers";
import { LevelSession } from "../types/session";
import { createReservation, changeStatusReservation, getReservationSession } from "../controllers/reservation.controllers";
import { ReservationStatus } from "../types/reservation";

export const resolvers : IResolvers = {
    Query : {
        users : async () => {
            return await showAllUsers();
        },

        sessions : async () => {
            return allSessions();
        },

        session : async (_, {id} : {id : string}) => {
            return sessionById(id);
        },
    },

    Mutation : {
        //User
        registerUser : async (_, {input} : {input : {name: string, email: string, password: string, age: number, preferences: string[]}}) => {
            
            //Create validation for non duplicated name
            const existName = await duplicatedName(input.name); 
            if(existName) throw new Error("Username already exists");

            const newUser = await createUser(input.name, input.email, input.age, input.preferences || [], [], "user", input.password);
            
            //In case of error
            if(!newUser) throw new Error("Error creating user");
            
            return {
                token : signToken(newUser._id.toString()),
                user : newUser
            }
        },
        loginUser : async (_, {input} : {input : {email: string, password: string}}) => {
            const validUser = await loginUser(input.email, input.password);

            //In case of error
            if(!validUser) throw new Error("Invalid credentiasl");

            return signToken (validUser._id.toString())
        },

        //Session
        createSession : async (_, {input} : {input : {title: string, type: string, level: LevelSession, duration: number, instructor: string, capacity: number, tags: string[]}}) => {
            const newSession = await createSession(input.title, input.type, input.level, input.duration, input.instructor, input.capacity, input.tags);
            
            if(!newSession) throw new Error("Error creating session");
            
            return newSession;
        },

        //Reservation
        createReservation : async (_, {input} : {input : {sessionId: string, date: string}}, ctx ) => {
            const userId = ctx.user;
            if(!userId) throw new Error("Unauthorized");

            const newReservation = await createReservation(userId, input.sessionId, input.date);

            if(!newReservation) throw new Error("Error creating reservation");

            return newReservation;
        },
        //Not working yet
        cancelledReservation : async (_, {input} : {input : {sessionId: string}}, ctx) => {
            const userId = ctx.user;
            if(!userId) throw new Error("Unauthorized");

            const cancelledReservation = await changeStatusReservation(userId, input.sessionId, ReservationStatus.CANCELLED);
            if(!cancelledReservation) throw new Error("Error cancelling reservation");

            return cancelledReservation;
        }
    },

    User : {
        reservations : getUserReservations
    },

    Reservation : {
        session : getReservationSession
    },
}