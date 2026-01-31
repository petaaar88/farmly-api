import express from "express";
import { registerUser, getUserProfileHandler } from "../controllers/usersController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/:userId/profile", getUserProfileHandler);


export default router;