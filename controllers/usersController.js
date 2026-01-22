import ValidationError from "../errors/validationError.js";
import { createUser } from "../services/userService.js";

const registerUser = async (req, res, next) => {

    if(!req.body) throw new ValidationError("Body is not provided!");

    const token = await createUser(req.body);

    res.status(201).json({ accessToken: token });
}


export { registerUser };