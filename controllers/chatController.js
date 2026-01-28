import {
  createChat,
  getUserChats,
  getChatById,
  sendMessage,
  getChatMessages,
  getChatName
} from "../services/chatService.js";

const createChatHandler = async (req, res, next) => {
  const chat = await createChat(req.user.id, req.body);

  res.status(201).json({
    id: chat.id,
    name: getChatName(chat, req.user.id),
    participant1: chat.participant1,
    participant2: chat.participant2,
    product: chat.product,
    createdAt: chat.createdAt
  });
};

const getUserChatsHandler = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const { chats, total } = await getUserChats(req.user.id, limit, offset);

  const chatsWithNames = chats.map(chat => ({
    id: chat.id,
    name: getChatName(chat, req.user.id),
    participant1: chat.participant1,
    participant2: chat.participant2,
    product: chat.product,
    createdAt: chat.createdAt
  }));

  res.status(200).json({
    chats: chatsWithNames,
    total,
    limit,
    offset
  });
};

const getChatByIdHandler = async (req, res, next) => {
  const chat = await getChatById(parseInt(req.params.chatId), req.user.id);

  res.status(200).json({
    id: chat.id,
    name: getChatName(chat, req.user.id),
    participant1: chat.participant1,
    participant2: chat.participant2,
    product: chat.product,
    createdAt: chat.createdAt
  });
};

const sendMessageHandler = async (req, res, next) => {
  const message = await sendMessage(
    parseInt(req.params.chatId),
    req.user.id,
    req.body
  );

  res.status(201).json(message);
};

const getChatMessagesHandler = async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  const { messages, total } = await getChatMessages(
    parseInt(req.params.chatId),
    req.user.id,
    limit,
    offset
  );

  res.status(200).json({
    messages,
    total,
    limit,
    offset
  });
};

export {
  createChatHandler,
  getUserChatsHandler,
  getChatByIdHandler,
  sendMessageHandler,
  getChatMessagesHandler
};
