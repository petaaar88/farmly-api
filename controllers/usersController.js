import ValidationError from "../errors/validationError.js";
import { createUser, getUserProfile, updateUserProfile } from "../services/userService.js";

const registerUser = async (req, res, next) => {

    if(!req.body) throw new ValidationError("Body is not provided!");

    const token = await createUser(req.body);

    res.status(201).json({ accessToken: token });
}


const getUserProfileHandler = async (req, res, next) => {
    const user = await getUserProfile(parseInt(req.params.userId));
    res.status(200).json(user);
};

const updateUserProfileHandler = async (req, res, next) => {
    const updateData = {};
    if (req.body.fullName !== undefined) updateData.fullName = req.body.fullName;
    if (req.body.email !== undefined) updateData.email = req.body.email;
    if (req.body.password !== undefined) updateData.password = req.body.password;
    if (req.body.phoneNumber !== undefined) updateData.phoneNumber = req.body.phoneNumber;
    if (req.body.city !== undefined) updateData.city = req.body.city;
    if (req.body.description !== undefined) updateData.description = req.body.description;

    const user = await updateUserProfile(req.user.id, updateData, req.file);

    res.status(200).json(user);
};

export { registerUser, getUserProfileHandler, updateUserProfileHandler };
