import { newUserSchema } from "../validators/userValidator.js";
import ValidationError from "../errors/validationError.js";
import { BaseError } from "sequelize";
import { User } from "../models/index.js";
import { createJwt } from "../utils/jwtUtils.js";
import { hashPassword } from "../utils/hashingUtils.js";

const createUser = async (newUserDto) => {
    try{
        const newUserData = await newUserSchema.validateAsync(newUserDto, {
            abortEarly: false,
            stripUnknown: true
        });

        newUserData.password = await hashPassword(newUserData.password); 
        const user =  await User.create(newUserData);
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