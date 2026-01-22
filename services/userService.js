import { newUserSchema } from "../validators/userValidator.js";
import ValidationError from "../errors/validationError.js";
import { BaseError } from "sequelize";
import User from "../models/user.js";
import { createJwt } from "../utils/jwtUtils.js";

const createUser = async (newUserDto) => {
    try{
        const value = await newUserSchema.validateAsync(newUserDto, {
            abortEarly: false,
            stripUnknown: true
        });

        const user =  await User.create(value);
        const token = createJwt({ id: user.dataValues.id })
        
        return token;
    }
    catch(err){
        if(err instanceof BaseError){
            let message = "";
            
            if(err.parent.code === "23505")
                message = "Email already exists!";
            else
                message = err.parent.detail;

            throw new ValidationError([message]);
        }
        
        throw new ValidationError(err.details.map(e => e.message))
    }
}


export { createUser };