import { newUserSchema, updateUserSchema } from "../validators/userValidator.js";
import ValidationError from "../errors/validationError.js";
import { BaseError } from "sequelize";
import { createJwt } from "../utils/jwtUtils.js";
import { hashPassword } from "../utils/hashingUtils.js";
import { uploadImage, deleteImage } from "./storageService.js";
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

const updateUserProfile = async (userId, updateDto, imageFile) => {
    try {
        const user = await UserRepository.findUserById(userId);
        if (!user)
            throw new ValidationError(["User not found"]);

        const hasFields = Object.keys(updateDto).length > 0;
        if (!hasFields && !imageFile)
            throw new ValidationError(["At least one field is required"]);

        let validatedData = {};
        if (hasFields) {
            validatedData = await updateUserSchema.validateAsync(updateDto, {
                abortEarly: false,
                stripUnknown: true
            });
        }

        if (validatedData.password)
            validatedData.password = await hashPassword(validatedData.password);

        if (imageFile) {
            validatedData.imageUrl = await uploadImage(imageFile, "users");

            if (user.imageUrl)
                await deleteImage(user.imageUrl);
        }

        await UserRepository.updateUser(userId, validatedData);

        return UserRepository.findUserProfileById(userId);
    } catch (err) {
        if (err instanceof ValidationError)
            throw err;

        if (err instanceof BaseError) {
            let message = "";

            if (err.parent.code === "23505")
                message = "Email or phone number already exists!";
            else
                message = err.parent.detail;

            throw new ValidationError([message]);
        }

        if (err.isJoi)
            throw new ValidationError(err.details.map(e => e.message));

        throw err;
    }
};

export { createUser, getUserProfile, updateUserProfile };