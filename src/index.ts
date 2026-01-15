//Imports basics
import { ApolloServer } from "apollo-server";

//Import rutas
import { connectMongoDB, closeMongoDB } from "./db/mongo"
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { getUserToken } from "./controllers/auth.controllers";
import { port_g } from "./utils/utils";
import { checkEnvVars } from "./utils/checkEnv";
const start = async () => {
    //To check variables in .env and not call them in every function
    checkEnvVars();

    await connectMongoDB();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({req})=>{
            const token = req.headers.authorization || "";
            const user = token ? await getUserToken(token as string) : null;
            return { user };
        }
    });

    await server.listen({port: port_g});
    console.log("Corriendo en el puerto",port_g);
};

start().catch(err=>console.error(err));

//Manejos para cerrar el servidor y la conexion a la base de datos
//Cerrar Ctrl+C
process.on('SIGINT', async () => {
  console.log('Apagando servidor (SIGINT)...');
  await closeMongoDB(); // Llama a la función para cerrar la conexión
  process.exit(0);
});