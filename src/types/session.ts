import { ObjectId } from "mongodb";

export type Session = {
    _id: ObjectId,
    title: string,
    type: string,
    level: LevelSession,
    duration: number,
    instructor: string,
    capacity: number,
    reserved: number,
    tags: string[], //For saving the key words of each session
}

 export enum LevelSession {
      Beginner = "Beginner",
      Intermediate = "Intermediate",
      Advanced = "Advanced"
    }