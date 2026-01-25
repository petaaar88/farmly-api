import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UsersFavorites = sequelize.define('UsersFavorites', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'id'
    }
  }
}, {
  tableName: 'users_favorites',
  timestamps: false
});

export default UsersFavorites;