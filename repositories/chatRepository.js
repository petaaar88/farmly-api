import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Chat, Message, User, Product } from '../models/index.js';

class ChatRepository {
  static async createChat(chatData) {
    const chat = await Chat.create(chatData);
    return chat;
  }

  static async findChatById(chatId) {
    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'fullName'] },
        { model: User, as: 'participant2', attributes: ['id', 'fullName'] },
        { model: Product, as: 'product', attributes: ['id', 'name'] }
      ]
    });
    return chat;
  }

  static async findChatByParticipantsAndProduct(participant1Id, participant2Id, productId) {
    const chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { participant1Id, participant2Id, productId },
          { participant1Id: participant2Id, participant2Id: participant1Id, productId }
        ]
      },
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'fullName'] },
        { model: User, as: 'participant2', attributes: ['id', 'fullName'] },
        { model: Product, as: 'product', attributes: ['id', 'name'] }
      ]
    });
    return chat;
  }

  static async findUserChats(userId, limit = 20, offset = 0) {
    const { count, rows } = await Chat.findAndCountAll({
      where: {
        [Op.or]: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      attributes: {
        include: [
          [sequelize.literal('(SELECT content FROM messages WHERE messages.chat_id = "Chat".id ORDER BY sent_at DESC LIMIT 1)'), 'lastMessage']
        ]
      },
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'fullName', 'imageUrl'] },
        { model: User, as: 'participant2', attributes: ['id', 'fullName', 'imageUrl'] },
        { model: Product, as: 'product', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [[sequelize.literal('COALESCE((SELECT sent_at FROM messages WHERE messages.chat_id = "Chat".id ORDER BY sent_at DESC LIMIT 1), "Chat".created_at)'), 'DESC']]
    });

    return { chats: rows, total: count };
  }

  static async findChatInfoById(chatId) {
    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participant1', attributes: ['id', 'fullName', 'imageUrl', 'overallReview'] },
        { model: User, as: 'participant2', attributes: ['id', 'fullName', 'imageUrl', 'overallReview'] },
        { model: Product, as: 'product', attributes: ['id', 'name', 'imageUrl', 'price', 'userId'] }
      ]
    });
    return chat;
  }

  static async isUserParticipant(chatId, userId) {
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      }
    });
    return chat !== null;
  }

  static async createMessage(messageData) {
    const message = await Message.create(messageData);
    return message;
  }

  static async findMessageById(messageId) {
    const message = await Message.findByPk(messageId, {
      include: [
        { model: User, as: 'sender', attributes: ['id', 'fullName'] }
      ]
    });
    return message;
  }

  static async findChatMessages(chatId, limit = 50, offset = 0) {
    const { count, rows } = await Message.findAndCountAll({
      where: { chatId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'fullName'] }
      ],
      limit,
      offset,
      order: [['sentAt', 'DESC']]
    });

    return { messages: rows.reverse(), total: count };
  }

  static async findProducerFirstResponse(chatId, producerId) {
    const message = await Message.findOne({
      where: {
        chatId,
        senderId: producerId
      },
      order: [['sentAt', 'ASC']]
    });
    return message;
  }
}

export default ChatRepository;
