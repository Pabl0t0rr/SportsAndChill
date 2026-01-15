import { IResolvers } from "@graphql-tools/utils"
import { signToken } from "../controllers/auth.controllers";
import { createUser, duplicatedName, loginUser, showAllUsers } from "../controllers/user.controllers";

export const resolvers : IResolvers = {
    Query : {
        users : async () => {
            return await showAllUsers();
        }

    },

    Mutation : {
        registerUser : async (_, {input} : {input : {name: string, email: string, password: string, age: number, preferences: string[]}}) => {
            
            //Create validation for non duplicated name
            const existName = await duplicatedName(input.name); 
            if(existName) throw new Error("Username already exists");

            const newUser = await createUser(input.name, input.email, input.age, input.preferences || [], [], "user", input.password);
            
            //In case of error
            if(!newUser) throw new Error("Error creating user");
            
            return {
                token : signToken(newUser._id.toString()),
                user : newUser
            }
        },
        loginUser : async (_, {input} : {input : {email: string, password: string}}) => {
            const validUser = await loginUser(input.email, input.password);

            //In case of error
            if(!validUser) throw new Error("Invalid credentiasl");

            return signToken (validUser._id.toString())
        },
    }
}
