import AuthenticationError from "../errors/authenticationError.js";
import { verifyJwt } from "../utils/jwtUtils.js";


const authenticationMiddleware = (req, res, next) => {

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new AuthenticationError("Unauthenticated!");

        const token = authHeader.split(" ")[1];
        if (!token) throw new AuthenticationError("Unauthenticated!");
        
        const payload = verifyJwt(token);
        req.user = payload;

        next();
    } catch (err) {
       throw new AuthenticationError("Invalid or expired token!");
    }

};

export { authenticationMiddleware };