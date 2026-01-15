import { IResolvers } from "@graphql-tools/utils"
import { signToken } from "../controllers/auth.controllers";
import { createUser, loginUser } from "../controllers/user.controllers";

export const resolvers : IResolvers = {
    Query : {

    },

    Mutation : {
        registerUser : async (_, {input} : {input : {name: string, email: string, password: string, age: number, preferences: string[]}}) => {
            
            //Create valodation for non duplicated name

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
