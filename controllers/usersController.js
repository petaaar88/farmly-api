import ValidationError from "../errors/validationError.js";
import { createUser, getUserProfile } from "../services/userService.js";

const registerUser = async (req, res, next) => {

    if(!req.body) throw new ValidationError("Body is not provided!");

    const token = await createUser(req.body);

    res.status(201).json({ accessToken: token });
}


const getUserProfileHandler = async (req, res, next) => {
    const user = await getUserProfile(parseInt(req.params.userId));
    res.status(200).json(user);
};

export { registerUser, getUserProfileHandler };
