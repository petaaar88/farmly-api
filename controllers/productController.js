import ValidationError from '../errors/validationError.js';
import {
  createProduct,
  getAllProducts,
  getProductsByUserId,
  updateProduct,
  deleteProduct
} from '../services/productService.js';

const getPagination = (req) => {
  const page = req.query.page === undefined ? 1 : parseInt(req.query.page);
  const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit);

  if (Number.isNaN(page) || Number.isNaN(limit))
    throw new ValidationError(['Invalid pagination parameters']);
  if (page < 1 || limit < 1)
    throw new ValidationError(['Page and limit must be positive numbers']);

  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const createNewProduct = async (req, res, next) => {
  if (!req.body) throw new ValidationError('Request body is required');
  

  const productData = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price),
    categoryId: parseInt(req.body.categoryId)
  };

  const product = await createProduct(productData, req.file, req.user.id);

  res.status(201).json(product);
};

const getAllProductsHandler = async (req, res, next) => {
  const { page, limit, offset } = getPagination(req);

  const { products, total } = await getAllProducts(limit, offset);

  res.status(200).json({
    products,
    total,
    page,
    limit
  });
};

const getUserProductsHandler = async (req, res, next) => {
  const userId = parseInt(req.params.userid);
  if (Number.isNaN(userId)) throw new ValidationError(['Invalid user id']);

  const { page, limit, offset } = getPagination(req);
  const { products, total } = await getProductsByUserId(userId, limit, offset);

  res.status(200).json({
    products,
    total,
    page,
    limit
  });
};

const updateProductHandler = async (req, res, next) => {
  const productId = parseInt(req.params.productId);
  if (Number.isNaN(productId)) throw new ValidationError(['Invalid product id']);

  const updateData = {};
  if (req.body.name !== undefined) updateData.name = req.body.name;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.price !== undefined) updateData.price = parseFloat(req.body.price);
  if (req.body.categoryId !== undefined)
    updateData.categoryId = parseInt(req.body.categoryId);

  const product = await updateProduct(productId, updateData, req.file, req.user.id);

  res.status(200).json(product);
};

const deleteProductHandler = async (req, res, next) => {
  const productId = parseInt(req.params.productId);
  if (Number.isNaN(productId)) throw new ValidationError(['Invalid product id']);

  await deleteProduct(productId, req.user.id);

  res.status(204).send();
};

export {
  createNewProduct,
  getAllProductsHandler,
  getUserProductsHandler,
  updateProductHandler,
  deleteProductHandler
};
