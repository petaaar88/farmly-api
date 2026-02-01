import { Product, User, Category } from '../models/index.js';

class ProductRepository {
  static async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  static async findProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName', 'city', 'numberOfReviews', 'overallReview'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });
    return product;
  }

  static async findAllProducts(limit = 10, offset = 0) {
    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName', 'city', 'numberOfReviews', 'overallReview', 'imageUrl'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });

    return {
      products: rows,
      total: count
    };
  }

  static async findProductsByUserId(userId, limit = 10, offset = 0) {
    const { count, rows } = await Product.findAndCountAll({
      where: { userId },
      limit,
      offset,
      include: [
        { model: User, as: 'seller', attributes: ['id', 'fullName', 'city', 'numberOfReviews', 'overallReview'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });

    return {
      products: rows,
      total: count
    };
  }

  static async updateProduct(productId, updateData) {
    const product = await Product.findByPk(productId);
    if (!product) return null;

    await product.update(updateData);
    return product;
  }

  static async deleteProduct(productId) {
    const product = await Product.findByPk(productId);
    if (!product) return false;

    await product.destroy();
    return true;
  }
}

export default ProductRepository;
