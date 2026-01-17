import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { Reservation, ReservationStatus } from "../types/reservation";
import { reservationCollection } from "../utils/utils";
import { sessionCollection } from "../utils/utils";

export const createReservation = async (userId: string, sessionId: string, date: string) => {
    const db = getDB(); 
    const newReservation = await db.collection<Reservation>(reservationCollection).insertOne({
        _id : new ObjectId(),
        userId,
        session: sessionId,
        date,
        status: ReservationStatus.CONFIRMED
    });
    
    const reservationCreated = await db.collection<Reservation>(reservationCollection).findOne({_id: newReservation.insertedId});

    return reservationCreated;
}

export const changeStatusReservation = async (userId : string ,sessionId: string, status: ReservationStatus) => {
    const db = getDB();

    const changeReservation = await db.collection(reservationCollection).findOneAndUpdate(
        {userId: userId, session: sessionId},
        {$set: {status: status}},
        {returnDocument: 'after'} // To return the updated document
    );

    return changeReservation;
}



// Field Resolvers

export const getReservationSession = async (parent : Reservation) => {
    const db = getDB();
    const session = parent.session;
    if(!session) return null;

    const objectId = new ObjectId(session);
    return db.collection(sessionCollection).findOne({_id : objectId}); 
}
