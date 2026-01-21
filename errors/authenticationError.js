import BaseError from "./baseError.js";

class AuthenticationError extends BaseError{
    constructor(error){
        super(401, "Authentication failed!", error);
    }
} 

export default AuthenticationError;