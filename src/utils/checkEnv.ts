//Import variables Utils
import {port_g, urlMongo, dbName, userCollection, sessionCollection, reservationCollection, secret} from "./utils";

export const checkEnvVars = () => {
  const requiredEnvs = {
    port: port_g,
    urlMongo: urlMongo,
    dbName: dbName,
    userCollection: userCollection,
    sessionCollection: sessionCollection,
    reservationCollection: reservationCollection,
    secret: secret,


  };

  const missingVars = Object.entries(requiredEnvs)
    .filter(([_, value]) => !value || value.toString().trim() === "")
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error("Missing environment variables:");
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1); //1 is for errors and 0 for success
  }

  console.log(" All environment variables loaded successfully");
};
