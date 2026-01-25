import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  sentAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'sent_at'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  chatId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'chat_id',
    references: {
      model: 'chats',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'sender_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'messages',
  timestamps: false
});

export default Message;