import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { Reservation, ReservationStatus } from "../types/reservation";
import { reservationCollection, userCollection } from "../utils/utils";
import { sessionCollection } from "../utils/utils";

export const createReservation = async (userId: ObjectId, sessionId: ObjectId, date: string) => {
    const db = getDB(); 

    //To check if user has a reservation done for the same session
    await checkExistingReservation (userId, sessionId);

    const newReservation = await db.collection<Reservation>(reservationCollection).insertOne({
        _id : new ObjectId(),
        userId,
        session: sessionId,
        date,
        status: ReservationStatus.CONFIRMED
    });
    
    //Add the reservation to the user
    await addReservationUser(userId, newReservation.insertedId);

    const reservationCreated = await db.collection<Reservation>(reservationCollection).findOne({_id: newReservation.insertedId});

    return reservationCreated;
}

export const changeStatusReservation = async (userId : ObjectId ,sessionId: ObjectId, status: ReservationStatus) => {
    const db = getDB();

    const changeReservation = await db.collection(reservationCollection).findOneAndUpdate(
        {userId: userId, session: sessionId},
        {$set: {status: status}},
        {returnDocument: 'after'} // To return the updated document
    );

    return changeReservation;
}

const checkExistingReservation = async (userId: ObjectId, sessionId: ObjectId) => {
    const db = getDB();
    const existingReservation = await db.collection<Reservation>(reservationCollection).findOne({userId: userId, session: sessionId});
    if(existingReservation) throw new Error("You have already reserved this session");

    return existingReservation;
}

const addReservationUser = async (userId: ObjectId, reservationId: ObjectId) => {
    const db = getDB();
    const addedReservation = await db.collection(userCollection).updateOne(
        {_id : userId},
        {$push : {reservations : reservationId} as any});
        
    return addedReservation;
}

// Field Resolvers

export const getReservationSession = async (parent : Reservation) => {
    const db = getDB();
    const session = parent.session;
    if(!session) return null;

    const objectId = new ObjectId(session);
    return db.collection(sessionCollection).findOne({_id : objectId}); 
}
