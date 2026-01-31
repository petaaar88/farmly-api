import { User } from '../models/index.js';

class UserRepository {
  static async createUser(userData) {
    const user = await User.create(userData);
    return user;
  }

  static async findUserById(userId) {
    const user = await User.findByPk(userId);
    return user;
  }

  static async findUserProfileById(userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'imageUrl', 'city', 'phoneNumber', 'description', 'overallReview', 'numberOfReviews']
    });
    return user;
  }

  static async findUserByEmail(email) {
    const user = await User.findOne({ where: { email } });
    return user;
  }

  static async findUserByPhoneNumber(phoneNumber) {
    const user = await User.findOne({ where: { phoneNumber } });
    return user;
  }

  static async updateUser(userId, updateData) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return null;
    }

    await user.update(updateData);
    return user;
  }

  static async deleteUser(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      return false;
    }

    await user.destroy();
    return true;
  }

  static async getAllUsers(limit = 10, offset = 0) {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      users: rows,
      total: count
    };
  }
}

export default UserRepository;