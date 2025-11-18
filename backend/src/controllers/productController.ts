import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { createProductSchema, updateProductSchema } from '../schemas/product.schemas.js';

export const getStoreProducts = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;
  const { page = 1, limit = 20, category, minPrice, maxPrice, inStock } = req.query;

  // Build query
  const query: any = { store: storeId };
  if (category) query.category = category;
  if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
  if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
  if (inStock === 'true') query.stock = { $gt: 0 };

  const products = await Product.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({ 
    success: true,
    data: products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, id } = req.params;

  const product = await Product.findOne({ _id: id, store: storeId });
  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { storeId } = req.params;

  // Validate input
  const validationResult = createProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation failed: ${errors}`, 400);
  }

  const product = await Product.create({
    ...validationResult.data,
    store: storeId,
  });

  res.status(201).json({ 
    success: true,
    message: 'Product created successfully',
    data: product 
  });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, id } = req.params;

  // Validate input
  const validationResult = updateProductSchema.safeParse(req.body);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation failed: ${errors}`, 400);
  }

  const product = await Product.findOneAndUpdate(
    { _id: id, store: storeId },
    validationResult.data,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ 
    success: true,
    message: 'Product updated successfully',
    data: product 
  });
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { storeId, id } = req.params;


  const product = await Product.findOneAndDelete({ _id: id, store: storeId });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ 
    success: true,
    message: 'Product deleted successfully' 
  });
});