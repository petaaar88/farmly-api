import jwt from "jsonwebtoken";

const verifyJwt = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new AuthenticationError("Invalid or expired token!");
    }
};

const createJwt = (data, exp = "1h") => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: exp });
};

export { verifyJwt, createJwt };
