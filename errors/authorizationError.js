import BaseError from "./baseError.js";

class AuthorizationError extends BaseError{
    constructor(error){
        super(403, "Authorization failed!", error);
    }
} 

export default AuthorizationError;
