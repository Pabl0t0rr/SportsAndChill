import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDB } from "../db/mongo";
import { reservationCollection, userCollection } from "../utils/utils";
import { User } from "../types/user";
import { get } from "node:http";

export const createUser = async (name: string, email: string, age: number, preferences: string[], reservations: string[], typeUser: string, password: string) => {
    const db = getDB();
    const passEncript = await bcrypt.hash(password, 10);

    const newUser = await db.collection<User>(userCollection).insertOne({
        _id: new ObjectId(),
        name,
        password: passEncript,
        email,
        age,
        preferences,
        reservations,
        typeUser : "User"
    });

    const user = await db.collection(userCollection).findOne({ _id: newUser.insertedId });

    return user;
};

export const loginUser = async(name: string , password: string) => {
    const db = getDB();
    const user = await db.collection(userCollection).findOne({name});
    
     if( !user ) return null;

    const samePass = await bcrypt.compare(password, user.password);
    if(!samePass) return null;

    return user;
};

export const duplicatedName = async (name : string) => {
    const db = getDB();
    const userName = await db.collection(userCollection).findOne({name});

    return userName;
}

export const showAllUsers = async () => {
    const db = getDB();
    const users = await db.collection(userCollection).find().toArray();
    return users;
}

// Field Resolvers
export const getUserReservations = async (parent : User) => {
    const db = getDB();
    const listIdsReservations = parent.reservations;
    if(!listIdsReservations) return [];
    
    const objectIds = listIdsReservations.map((id) => new ObjectId(id));
    return db.collection(reservationCollection).find({_id : {$in : objectIds}}).toArray();
}   