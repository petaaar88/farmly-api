import AuthenticationError from "../errors/authenticationError.js";
import ValidationError from "../errors/validationError.js";
import User from "../models/user.js";
import { validatePassword } from "../utils/hashingUtils.js";
import { createJwt } from "../utils/jwtUtils.js";
import { credentialsSchema } from "../validators/credentialsValidator.js";


const login = async (credentials) => {
    try {
        const validatedData = await credentialsSchema.validateAsync(credentials, {
            abortEarly: false,
            stripUnknown: true
        });

        const user = await User.findOne({ where: { email: validatedData.email } });

        if (!user) throw new AuthenticationError("Invalid credentials");

        const isValid = await validatePassword(
            validatedData.password,
            user.password
        );

        if (!isValid) throw new AuthenticationError("Invalid credentials");
        
        return createJwt({ id: user.dataValues.id});

    } catch (err) {
        if (err instanceof AuthenticationError || err instanceof ValidationError) throw err;
        
        if (err.isJoi) throw new ValidationError("Invalid credentials!");

        throw err; 
    }
};


export { login };