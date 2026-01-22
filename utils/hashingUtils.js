import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    if (!password) return false;

    return await bcrypt.hash(password, SALT_ROUNDS);
};

const validatePassword = async (password, hashedPassword) => {
    if (!password || !hashedPassword) return false;

    return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, validatePassword };