import { Category } from '../models/index.js';

class CategoryRepository {
  static async findCategoryById(categoryId) {
    const category = await Category.findByPk(categoryId);
    return category;
  }

  static async getAllCategories() {
    const categories = await Category.findAll();
    return categories;
  }

  static async createCategory(categoryData) {
    const category = await Category.create(categoryData);
    return category;
  }
}

export default CategoryRepository;
