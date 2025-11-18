import { Request, Response, NextFunction } from 'express';
import { Store } from '../models/Store.js';
import { AppError, asyncHandler } from './errorHandler.js';

/**
 * Middleware to check if a store with the ID in req.params.storeId exists.
 * Throws AppError 404 if not found.
 */
export const validateStoreExistence = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { storeId } = req.params;

  // Verify store exists
  const store = await Store.findById(storeId);
  if (!store) {
    throw new AppError('Store not found', 404);
  }

  next();
});