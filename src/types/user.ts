import { ObjectId } from "mongodb"

export type User = {
    _id : ObjectId,
    name : string,
    password : string,
    email : string,
    age : number,
    preferences ?: string[],
    reservations ?: string[],
    typeUser ?: TypeUser
}

export enum TypeUser {
    Admin = "Admin",
    User = "User",
    SessionCreator = "sessionCreator"
}