import { ApolloError } from "apollo-server-errors";
import { compare, hash } from 'bcryptjs';
import { issueToken, serializeUser } from '../../functions';
import { UserAuthenticationRules, UserRegisterationRules } from '../../validators'


export default {
    Query: {
        authUserProfile: async (parent, args, context, info) => {
            const { user } = context;
            return user
        },
        authenticateUser: async (parent, args, context, info) => {
            const { username, password } = args;
            const { User } = context;
            await UserAuthenticationRules.validate({
                username, password
            }, { abortEarly: false });
            try {
                //Find user by username
                let user = await User.findOne({
                    username
                });
                if(!user){
                    throw new Error("Username Not Found!");
                }
                //Check for password
                let isMatch = await compare(password, user.password);
                if(!isMatch){
                    throw new Error("Invalid Password!");
                }
                //Serialize user
                user = user.toObject();
                user.id = user._id;
                user = serializeUser(user);
                //Issue the Auth token
                let token = await issueToken(user);
                return {
                    user, 
                    token
                };
            } catch (error) {
                throw new ApolloError(error.message, 403)
            }
            
        }
    },
    Mutation: {
        registerUser: async (parent, args, context, info) => {
            const { newUser } = args;
            const { User } = context;
            await UserRegisterationRules.validate(newUser, { abortEarly: false })
            try {
                let { username, email } = newUser;
                //check if the username is already taken
                let user 
                user = await User.findOne({ username });
                if(user){
                    throw new Error("Username is already taken!")
                }
                //Check If the email is already taken
                user = await User.findOne({ email });
                if(user){
                    throw new Error("Email is already registered!")
                }
                //create new user instance 
                user = new User(newUser);
                //hash the password 
                user.password = await hash(newUser.password, 10);
                //Save the user to db
                let result = await user.save();
                //Serialize user
                result = result.toObject();
                result.id = result._id;
                result = serializeUser(result);
                //Issue the Auth token
                let token = await issueToken(result);
                return {
                    token, 
                    user: result
                };
            } catch (error) {
                throw new ApolloError(error.message, 400);
            };
        }
    }
}