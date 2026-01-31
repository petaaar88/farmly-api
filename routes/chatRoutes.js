import express from "express";
import { authenticationMiddleware } from "../middlewares/authMiddleware.js";
import {
  createChatHandler,
  getUserChatsHandler,
  getChatByIdHandler,
  getChatInfoHandler,
  sendMessageHandler,
  getChatMessagesHandler
} from "../controllers/chatController.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/", createChatHandler);
router.get("/", getUserChatsHandler);
router.get("/:chatId", getChatByIdHandler);
router.get("/:chatId/info", getChatInfoHandler);
router.post("/:chatId/messages", sendMessageHandler);
router.get("/:chatId/messages", getChatMessagesHandler);

export default router;
