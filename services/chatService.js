import { createChatSchema, sendMessageSchema } from "../validators/chatValidator.js";
import ValidationError from "../errors/validationError.js";
import ChatRepository from "../repositories/chatRepository.js";
import UserRepository from "../repositories/userRepository.js";
import { Product } from "../models/index.js";

const createChat = async (userId, chatDto) => {
  const validatedData = await createChatSchema.validateAsync(chatDto, {
    abortEarly: false,
    stripUnknown: true
  }).catch(err => {
    throw new ValidationError(err.details.map(e => e.message));
  });

  if (Number(userId) === Number(validatedData.recipientId))
    throw new ValidationError(["Cannot create chat with yourself"]);

  const recipient = await UserRepository.findUserById(validatedData.recipientId);
  if (!recipient)
    throw new ValidationError(["Recipient user not found"]);

  const product = await Product.findByPk(validatedData.productId);
  if (!product)
    throw new ValidationError(["Product not found"]);

  const existingChat = await ChatRepository.findChatByParticipantsAndProduct(
    userId,
    validatedData.recipientId,
    validatedData.productId
  );

  if (existingChat)
    return existingChat;

  const chat = await ChatRepository.createChat({
    participant1Id: userId,
    participant2Id: validatedData.recipientId,
    productId: validatedData.productId
  });

  return ChatRepository.findChatById(chat.id);
};

const getUserChats = async (userId, limit = 20, offset = 0) => {
  return ChatRepository.findUserChats(userId, limit, offset);
};

const getChatById = async (chatId, userId) => {
  const chat = await ChatRepository.findChatById(chatId);

  if (!chat)
    throw new ValidationError(["Chat not found"]);

  const isParticipant = await ChatRepository.isUserParticipant(chatId, userId);
  if (!isParticipant)
    throw new ValidationError(["You are not a participant of this chat"]);

  return chat;
};

const sendMessage = async (chatId, userId, messageDto) => {
  const validatedData = await sendMessageSchema.validateAsync(messageDto, {
    abortEarly: false,
    stripUnknown: true
  }).catch(err => {
    throw new ValidationError(err.details.map(e => e.message));
  });

  const chat = await ChatRepository.findChatById(chatId);
  if (!chat)
    throw new ValidationError(["Chat not found"]);

  const isParticipant = await ChatRepository.isUserParticipant(chatId, userId);
  if (!isParticipant)
    throw new ValidationError(["You are not a participant of this chat"]);

  const message = await ChatRepository.createMessage({
    chatId,
    senderId: userId,
    content: validatedData.content
  });

  return ChatRepository.findMessageById(message.id);
};

const getChatMessages = async (chatId, userId, limit = 50, offset = 0) => {
  const chat = await ChatRepository.findChatById(chatId);
  if (!chat)
    throw new ValidationError(["Chat not found"]);

  const isParticipant = await ChatRepository.isUserParticipant(chatId, userId);
  if (!isParticipant)
    throw new ValidationError(["You are not a participant of this chat"]);

  return ChatRepository.findChatMessages(chatId, limit, offset);
};

const canUserReviewProducer = async (buyerId, producerId, reviewDelayHours = 24) => {
  const { chats } = await ChatRepository.findUserChats(buyerId, 100, 0);

  for (const chat of chats) {
    const isProducerInChat =
      Number(chat.participant1Id) === Number(producerId) || Number(chat.participant2Id) === Number(producerId);

    if (!isProducerInChat)
      continue;

    const producerResponse = await ChatRepository.findProducerFirstResponse(chat.id, producerId);

    if (!producerResponse)
      continue;

    const hoursSinceResponse = (Date.now() - new Date(producerResponse.sentAt)) / (1000 * 60 * 60);

    if (hoursSinceResponse >= reviewDelayHours)
      return { canReview: true, chatId: chat.id };
  }

  return { canReview: false, chatId: null };
};

const getChatInfo = async (chatId, userId) => {
  const chat = await ChatRepository.findChatInfoById(chatId);

  if (!chat)
    throw new ValidationError(["Chat not found"]);

  const isParticipant = await ChatRepository.isUserParticipant(chatId, userId);
  if (!isParticipant)
    throw new ValidationError(["You are not a participant of this chat"]);

  const isSeller = Number(chat.product.userId) === Number(userId);
  const otherParticipant = Number(chat.participant1Id) === Number(userId)
    ? chat.participant2
    : chat.participant1;

  const chatName = `${otherParticipant.fullName} - ${chat.product.name}`;

  if (isSeller)
    return {
      id: chat.id,
      user: {
        id: otherParticipant.id,
        name: chatName,
        imageUrl: otherParticipant.imageUrl || null
      }
    };

  const producerId = Number(chat.participant1Id) === Number(userId)
    ? chat.participant2Id
    : chat.participant1Id;
  const { canReview } = await canUserReviewProducer(userId, producerId);

  return {
    id: chat.id,
    user: {
      id: otherParticipant.id,
      name: chatName,
      overallRating: otherParticipant.overallReview || null,
      imageUrl: otherParticipant.imageUrl || null
    },
    product: {
      id: chat.product.id,
      imageUrl: chat.product.imageUrl,
      price: chat.product.price,
      name: chat.product.name
    },
    reviewAllowed: canReview
  };
};

const getChatName = (chat, currentUserId) => {
  const otherParticipant = Number(chat.participant1Id) === Number(currentUserId)
    ? chat.participant2
    : chat.participant1;

  return `${otherParticipant.fullName} - ${chat.product.name}`;
};

export {
  createChat,
  getUserChats,
  getChatById,
  getChatInfo,
  sendMessage,
  getChatMessages,
  canUserReviewProducer,
  getChatName
};
