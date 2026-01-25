import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  participant1Id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'participant1_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  participant2Id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'participant2_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'chats',
  timestamps: false
});

export default Chat;