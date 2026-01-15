//Imports basics
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

//Import rutas
import { getDB } from "../db/mongo";
import { tokenPayload } from "../types/auth";
import { secret } from "../utils/utils";

export const signToken = (userId : string) => jwt.sign({ userId }, secret as string, { expiresIn: "1h" });

export const verifyToken = (token : string) : tokenPayload | null => {
    try {
        return jwt.verify(token as string, secret as string) as tokenPayload;
    } catch (err) {
        return null;
    }
}

export const getUserToken = async (token : string) => {
    try {
        const payload = verifyToken(token);
        if(!payload) return null;
        const db = getDB();
        return await db.collection(process.env.COLLECTION_NAME_U!).findOne({ _id: new ObjectId(payload.userId) });

    } catch (err) {
        return null;
    }
}