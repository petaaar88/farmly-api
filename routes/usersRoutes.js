import express from "express";
import { registerUser, getUserProfileHandler, updateUserProfileHandler } from "../controllers/usersController.js";
import { getUserProductsHandler, getUserProductDetailsHandler } from "../controllers/productController.js";
import { getUserReviewsHandler } from "../controllers/reviewController.js";
import { addFavoriteHandler, removeFavoriteHandler, getFavoritesHandler } from "../controllers/favoritesController.js";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.patch("/profile", authenticationMiddleware, upload.single("image"), updateUserProfileHandler);
router.get("/:userId/profile", getUserProfileHandler);
router.get("/:userid/products", getUserProductsHandler);
router.get("/products/:productId", getUserProductDetailsHandler);
router.get("/:userId/reviews", getUserReviewsHandler);

router.post("/favorites/:productId", authenticationMiddleware, addFavoriteHandler);
router.delete("/favorites/:productId", authenticationMiddleware, removeFavoriteHandler);
router.get("/favorites", authenticationMiddleware, getFavoritesHandler);

export default router;
