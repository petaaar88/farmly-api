import ValidationError from "../errors/validationError.js";
import { login } from "../services/authService.js";

const loginUser = async (req, res, next) => {

    if(!req.body) throw new ValidationError("Body is not provided!");

    const token = await login(req.body);

    res.status(200).json({ accessToken: token });
}


export { loginUser };