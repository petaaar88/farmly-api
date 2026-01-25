import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
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
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'full_name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'phone_number'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url'
  },
  description: {
    type: DataTypes.TEXT
  },
  numberOfReviews: {
    type: DataTypes.BIGINT,
    allowNull: false,
    defaultValue: 0,
    field: 'number_of_reviews'
  },
  overallReview: {
    type: DataTypes.DOUBLE,
    field: 'overallReview'
  }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;