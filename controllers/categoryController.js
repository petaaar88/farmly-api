import ValidationError from '../errors/validationError.js';
import { getAllCategories, createCategory } from '../services/categoryService.js';

const getAllCategoriesHandler = async (req, res, next) => {
  const categories = await getAllCategories();

  res.status(200).json(categories);
};

const createCategoryHandler = async (req, res, next) => {
  if (!req.body) throw new ValidationError('Request body is required');

  const categoryData = {
    name: req.body.name
  };

  const category = await createCategory(categoryData, req.file);

  res.status(201).json(category);
};

export { getAllCategoriesHandler, createCategoryHandler };
