//Imports basics
import { Db, MongoClient } from "mongodb";

//Import rutas
import { urlMongo, dbName } from "../utils/utils";

let client: MongoClient;
let dB: Db;

export const connectMongoDB = async (): Promise<void> => {
  try {
    client = new MongoClient(urlMongo);
    await client.connect();
    dB = client.db(dbName);
    console.log("Connected to mongodb at db " + dbName);
  } catch (error) {
    console.log("Error mongo: ", error);
  }
};

export const getDB = ():Db => dB;

//Cerrar las llamadas a mongo
export const closeMongoDB = async() => {
  try {
    
    client && await client.close();

  } catch (error) {

    console.log("Error closing mongo: ", error); 
  }
};