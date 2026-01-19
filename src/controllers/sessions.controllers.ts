import { getDB } from "../db/mongo"
import { ObjectId } from "mongodb";
import { Session, LevelSession } from "../types/session"
import { sessionCollection } from "../utils/utils";
import { TypeUser } from "../types/user";

//Mutations
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

export const modifySession = async (sessionId: string, updateData: Partial<Session>) => {
    const db = getDB();

    const updatedSession = await db.collection<Session>(sessionCollection).findOneAndUpdate(
        { _id: new ObjectId(sessionId) },
        { $set: updateData },
        { returnDocument: "after" }
    );
    return updatedSession;
};

//Queries
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

//Validacions

export const validateCreatorType  = async (ctx : any) => {
    const userId = ctx.user._id.toString();
    const userType = ctx.user.typeUser;
   
    if(!userId || userType !== TypeUser.SessionCreator)throw new Error("Unauthorized");    
}

export const validateCreatorSession = async (sessionId: string, creatorId: string) => {
    const db = getDB();
    const session = await db.collection<Session>(sessionCollection).findOne({ _id: new ObjectId(sessionId) });

    if(!session) throw new Error("Session not found");
    if(session.instructor !== creatorId) throw new Error("You are not the creator of this session");
}
