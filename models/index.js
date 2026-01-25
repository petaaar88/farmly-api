import User from './user.js';
import Category from './category.js';
import Product from './product.js';
import Chat from './chat.js';
import Message from './message.js';
import Review from './review.js';
import UsersFavorites from './usersFavorites.js';

User.hasMany(Product, { foreignKey: 'userId', as: 'products' });
User.hasMany(Review, { foreignKey: 'authorId', as: 'writtenReviews' });
User.hasMany(Review, { foreignKey: 'targetId', as: 'receivedReviews' });
User.belongsToMany(Product, { 
  through: UsersFavorites, 
  foreignKey: 'userId',
  otherKey: 'productId',
  as: 'favorites' 
});

Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

Product.belongsTo(User, { foreignKey: 'userId', as: 'seller' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.belongsToMany(User, { 
  through: UsersFavorites, 
  foreignKey: 'productId',
  otherKey: 'userId',
  as: 'favoritedBy' 
});

Chat.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });
Chat.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' });

Message.belongsTo(Chat, { foreignKey: 'chatId', as: 'chat' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Review.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
Review.belongsTo(User, { foreignKey: 'targetId', as: 'target' });

UsersFavorites.belongsTo(User, { foreignKey: 'userId' });
UsersFavorites.belongsTo(Product, { foreignKey: 'productId' });

export {
  User,
  Category,
  Product,
  Chat,
  Message,
  Review,
  UsersFavorites
};