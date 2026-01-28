import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  grade: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  targetId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'target_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'author_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  chatId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    field: 'chat_id',
    references: {
      model: 'chats',
      key: 'id'
    }
  }
}, {
  tableName: 'reviews',
  timestamps: false
});

export default Review;