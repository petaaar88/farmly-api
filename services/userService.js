import { newUserSchema } from "../validators/userValidator.js";
import ValidationError from "../errors/validationError.js";
import { BaseError } from "sequelize";
import { createJwt } from "../utils/jwtUtils.js";
import { hashPassword } from "../utils/hashingUtils.js";
import UserRepository from "../repositories/userRepository.js";

const createUser = async (newUserDto) => {
    try{
        const newUserData = await newUserSchema.validateAsync(newUserDto, {
            abortEarly: false,
            stripUnknown: true
        });

        newUserData.password = await hashPassword(newUserData.password); 
        const user =  await UserRepository.createUser(newUserData);
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


const getUserProfile = async (userId) => {
    const user = await UserRepository.findUserProfileById(userId);

    if (!user)
        throw new ValidationError(["User not found"]);

    return user;
};

export { createUser, getUserProfile };