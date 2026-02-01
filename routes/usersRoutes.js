import express from "express";
import { registerUser, getUserProfileHandler } from "../controllers/usersController.js";
import { getUserProductsHandler, getUserProductDetailsHandler } from "../controllers/productController.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/:userId/profile", getUserProfileHandler);
router.get("/:userid/products", getUserProductsHandler);
router.get("/:userid/products/:productId", getUserProductDetailsHandler);


export default router;
