import dotenv from 'dotenv';
dotenv.config();

//Ports
export const port_g = Number(process.env.PORT_G);

//Urls
export const urlMongo = process.env.URL_MONGO as string

//Data base
export const dbName = process.env.NAME_DB as string

//Collections
export const userCollection = process.env.COLLECTION_NAME_USER_COLLECTION as string
export const sessionCollection = process.env.COLLECTION_NAME_SESSION_COLLECTION as string
export const reservationCollection = process.env.COLLECTION_NAME_RESERVATION_COLLECTION as string


//Secrets
export const secret = process.env.SECRET as string;