import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler.js';

export const validateStore = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, city, cityType } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Store name is required', 400));
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return next(new AppError('Store description is required', 400));
  }

  if (!city || typeof city !== 'string' || city.trim().length === 0) {
    return next(new AppError('City is required', 400));
  }

  if (!cityType || !['big', 'small'].includes(cityType)) {
    return next(new AppError('City type must be either "big" or "small"', 400));
  }

  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, description, price, stock, store } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('Product name is required', 400));
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return next(new AppError('Product description is required', 400));
  }

  if (price === undefined || typeof price !== 'number' || price < 0) {
    return next(new AppError('Valid price is required (must be >= 0)', 400));
  }

  if (stock === undefined || typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
    return next(new AppError('Valid stock is required (must be integer >= 0)', 400));
  }

  if (!store || typeof store !== 'string') {
    return next(new AppError('Store ID is required', 400));
  }

  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const { page, limit } = req.query;

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return next(new AppError('Page must be a positive integer', 400));
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return next(new AppError('Limit must be between 1 and 100', 400));
  }

  next();
};
