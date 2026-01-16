import { getDB } from "../db/mongo"
import { ObjectId } from "mongodb";
import { Session, LevelSession } from "../types/session"
import { sessionCollection } from "../utils/utils";


export const createSession = async (title : string, type: string, level: LevelSession, duration: number, instructor: string, capacity: number, tags: string[]) => {
    const db = getDB();

    const newSession = await db.collection<Session>(sessionCollection).insertOne({
        _id: new ObjectId(),
        title,
        type,
        level,
        duration,
        instructor,
        capacity,
        reserved: 0,
        tags
    });

    const session = await db.collection(sessionCollection).findOne({ _id: newSession.insertedId });

    return session;
};

export const allSessions = async() => {
    const db = getDB();
    const sessions = await db.collection<Session>(sessionCollection).find().toArray();
    return sessions;
}

export const sessionById = async (id : string) => {
    const db = getDB();
    const session = await db.collection<Session>(sessionCollection).findOne({ _id: new ObjectId(id) });
    return session;
}
