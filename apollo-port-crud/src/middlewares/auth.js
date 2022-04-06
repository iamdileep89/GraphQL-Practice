import { decode, verify } from "jsonwebtoken";
import { SECRET } from "../config";
import { User } from "../models";

const AuthMiddleware = async (req, res, next) => {
    const AuthHeader = req.get("Authorization");
    if(!AuthHeader){
        req.isAuth = false;
        return next();
    }
    //Extract token 
    let token = AuthHeader.split(' ')[1];
    if(!token || token===''){
        req.isAuth = false
        return next();
    }
    //Decode token using verify
    let decodedToken
    try {
        decodedToken = verify(token, SECRET)
    } catch (error) {
        req.isAuth = false
        return next();
    }
    if(!decodedToken){
        req.isAuth = false
        return next();
    }
    //Find user from dbl
    let authUser = await User.findById(decodedToken.id);
    if(!authUser){
        req.isAuth = false
        return next();
    } 
    req.user = authUser;
    req.isAuth = true;
    return next();
};

export default AuthMiddleware;