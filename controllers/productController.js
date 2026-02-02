import ValidationError from '../errors/validationError.js';
import {
  createProduct,
  getAllProducts,
  getProductsByUserId,
  getProductById,
  updateProduct,
  deleteProduct
} from '../services/productService.js';

const getPagination = (req) => {
  const limit = req.query.limit === undefined ? 50 : parseInt(req.query.limit);
  const offset = req.query.offset === undefined ? 0 : parseInt(req.query.offset);

  if (Number.isNaN(limit) || Number.isNaN(offset))
    throw new ValidationError(['Invalid pagination parameters']);
  if (limit < 1 || offset < 0)
    throw new ValidationError(['Limit must be positive and offset must be non-negative']);

  return { limit, offset };
};

const mapProducer = (seller) => ({
  id: seller.id,
  fullName: seller.fullName,
  imageUrl: seller.imageUrl,
  city: seller.city,
  overallReview: {
    numberOfReviews: seller.numberOfReviews == null ? 0 : Number(seller.numberOfReviews),
    overallReview: seller.overallReview == null ? null : Number(seller.overallReview)
  }
});

const mapProductListItem = (product) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  imageUrl: product.imageUrl,
  producer: mapProducer(product.seller)
});

const mapProductDetail = (product) => ({
  producer: mapProducer(product.seller),
  imageUrl: product.imageUrl,
  name: product.name,
  price: product.price,
  description: product.description,
  id: product.id
});

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
  const { limit, offset } = getPagination(req);

  const { products, total } = await getAllProducts(limit, offset);

  res.status(200).json({
    products: products.map(mapProductListItem),
    total,
    limit,
    offset
  });
};

const getUserProductsHandler = async (req, res, next) => {
  const userId = parseInt(req.params.userid);
  if (Number.isNaN(userId)) throw new ValidationError(['Invalid user id']);

  const { limit, offset } = getPagination(req);
  const { products, total } = await getProductsByUserId(userId, limit, offset);

  res.status(200).json({
    products: products.map(mapProductListItem),
    total,
    limit,
    offset
  });
};

const getUserProductDetailsHandler = async (req, res, next) => {
  const productId = parseInt(req.params.productId);

  if (Number.isNaN(productId)) throw new ValidationError(['Invalid product id']);

  const product = await getProductById(productId);
  if (!product)
    throw new ValidationError(['Product not found']);

  res.status(200).json(mapProductDetail(product));
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
  getUserProductDetailsHandler,
  updateProductHandler,
  deleteProductHandler
};
