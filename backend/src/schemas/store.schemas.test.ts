import { describe, it, expect } from 'vitest';
import { createStoreSchema, updateStoreSchema } from '../schemas/store.schemas';

describe('Store Schemas', () => {
  describe('createStoreSchema', () => {
    it('validates correct store data', () => {
      const validStore = {
        name: 'Tech Haven',
        description: 'Electronics store',
        city: 'New York',
        cityType: 'big' as const,
        address: '123 Main St',
        phone: '555-0101',
        email: 'info@techhaven.com',
      };

      const result = createStoreSchema.safeParse(validStore);
      expect(result.success).toBe(true);
    });

    it('validates store with only required fields', () => {
      const minimalStore = {
        name: 'Simple Store',
        description: 'A basic store',
        city: 'Chicago',
        cityType: 'small' as const,
      };

      const result = createStoreSchema.safeParse(minimalStore);
      expect(result.success).toBe(true);
    });

    it('rejects store without name', () => {
      const invalidStore = {
        description: 'Store without name',
        city: 'Boston',
        cityType: 'big' as const,
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('name');
      }
    });

    it('rejects store with empty name', () => {
      const invalidStore = {
        name: '',
        description: 'Store with empty name',
        city: 'Seattle',
        cityType: 'big' as const,
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
    });

    it('rejects store without description', () => {
      const invalidStore = {
        name: 'Store Name',
        city: 'Portland',
        cityType: 'small' as const,
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('description');
      }
    });

    it('rejects store without city', () => {
      const invalidStore = {
        name: 'Store Name',
        description: 'Store description',
        cityType: 'big' as const,
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
    });

    it('rejects invalid cityType', () => {
      const invalidStore = {
        name: 'Store Name',
        description: 'Store description',
        city: 'Denver',
        cityType: 'medium' as any,
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
      const invalidStore = {
        name: 'Store Name',
        description: 'Store description',
        city: 'Miami',
        cityType: 'big' as const,
        email: 'not-an-email',
      };

      const result = createStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('email');
      }
    });

    it('accepts valid email format', () => {
      const validStore = {
        name: 'Store Name',
        description: 'Store description',
        city: 'Austin',
        cityType: 'big' as const,
        email: 'info@store.com',
      };

      const result = createStoreSchema.safeParse(validStore);
      expect(result.success).toBe(true);
    });
  });

  describe('updateStoreSchema', () => {
    it('validates partial store update', () => {
      const partialUpdate = {
        name: 'Updated Store Name',
      };

      const result = updateStoreSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates multiple field update', () => {
      const partialUpdate = {
        name: 'Updated Store',
        description: 'Updated description',
        city: 'New City',
      };

      const result = updateStoreSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates empty update object', () => {
      const result = updateStoreSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('rejects invalid email in update', () => {
      const invalidUpdate = {
        email: 'invalid-email',
      };

      const result = updateStoreSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('rejects invalid cityType in update', () => {
      const invalidUpdate = {
        cityType: 'invalid' as any,
      };

      const result = updateStoreSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
