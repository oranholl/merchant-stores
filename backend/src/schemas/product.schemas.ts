import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative').default(0),
  imageUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

export const updateProductSchema = createProductSchema.partial();