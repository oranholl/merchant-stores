import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  city: z.string().min(1, 'City is required'),
  cityType: z.enum(['big', 'small'], { errorMap: () => ({ message: 'City type must be big or small' }) }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional(),
});

export const updateStoreSchema = createStoreSchema.partial();