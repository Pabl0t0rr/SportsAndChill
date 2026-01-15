type User = {
    _id : string,
    name : string,
    email : string,
    age : number,
    preferences ?: string[],
    reservations ?: string[],
    typeUser ?: string
}