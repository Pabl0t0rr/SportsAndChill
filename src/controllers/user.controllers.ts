import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDB } from "../db/mongo";
import { userCollection } from "../utils/utils";
import { User } from "../types/user";

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
}