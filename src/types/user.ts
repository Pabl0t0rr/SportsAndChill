import { ObjectId } from "mongodb"

export type User = {
    _id : ObjectId,
    name : string,
    password : string,
    email : string,
    age : number,
    preferences ?: string[],
    reservations ?: string[],
    typeUser ?: string
}