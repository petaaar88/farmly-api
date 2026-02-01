import express from "express";
import { registerUser, getUserProfileHandler, updateUserProfileHandler } from "../controllers/usersController.js";
import { getUserProductsHandler, getUserProductDetailsHandler } from "../controllers/productController.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.patch("/profile", authenticationMiddleware, upload.single("image"), updateUserProfileHandler);
router.get("/:userId/profile", getUserProfileHandler);
router.get("/:userid/products", getUserProductsHandler);
router.get("/:userid/products/:productId", getUserProductDetailsHandler);


export default router;
