import { describe, it, expect } from 'vitest';
import { createProductSchema, updateProductSchema } from '../schemas/product.schemas';

describe('Product Schemas', () => {
  describe('createProductSchema', () => {
    it('validates correct product data', () => {
      const validProduct = {
        name: 'Laptop',
        description: 'High-performance laptop',
        price: 999.99,
        category: 'Electronics',
        stock: 20,
        imageUrl: 'https://example.com/laptop.jpg',
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('validates product with only required fields', () => {
      const minimalProduct = {
        name: 'Simple Product',
        description: 'Basic description',
        price: 10.0,
      };

      const result = createProductSchema.safeParse(minimalProduct);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stock).toBe(0); // Default stock
      }
    });

    it('rejects product without name', () => {
      const invalidProduct = {
        description: 'Product without name',
        price: 50.0,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('name');
      }
    });

    it('rejects product with empty name', () => {
      const invalidProduct = {
        name: '',
        description: 'Product with empty name',
        price: 50.0,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('rejects product without description', () => {
      const invalidProduct = {
        name: 'Product Name',
        price: 50.0,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].path).toContain('description');
      }
    });

    it('rejects product without price', () => {
      const invalidProduct = {
        name: 'Product Name',
        description: 'Product description',
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('rejects negative price', () => {
      const invalidProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: -10.0,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('positive');
      }
    });

    it('accepts zero price', () => {
      const validProduct = {
        name: 'Free Product',
        description: 'Free item',
        price: 0,
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('rejects negative stock', () => {
      const invalidProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: 10.0,
        stock: -5,
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('negative');
      }
    });

    it('accepts zero stock', () => {
      const validProduct = {
        name: 'Out of Stock Product',
        description: 'Currently unavailable',
        price: 10.0,
        stock: 0,
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('rejects invalid URL format', () => {
      const invalidProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: 10.0,
        imageUrl: 'not-a-valid-url',
      };

      const result = createProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('accepts valid URL format', () => {
      const validProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: 10.0,
        imageUrl: 'https://example.com/image.jpg',
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('accepts empty string for imageUrl', () => {
      const validProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: 10.0,
        imageUrl: '',
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('accepts optional category', () => {
      const validProduct = {
        name: 'Product Name',
        description: 'Product description',
        price: 10.0,
        category: 'Electronics',
      };

      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });
  });

  describe('updateProductSchema', () => {
    it('validates partial product update', () => {
      const partialUpdate = {
        name: 'Updated Product Name',
      };

      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates price update only', () => {
      const partialUpdate = {
        price: 199.99,
      };

      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates stock update only', () => {
      const partialUpdate = {
        stock: 50,
      };

      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it('validates empty update object', () => {
      const result = updateProductSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('rejects negative price in update', () => {
      const invalidUpdate = {
        price: -50,
      };

      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('rejects negative stock in update', () => {
      const invalidUpdate = {
        stock: -10,
      };

      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('rejects invalid URL in update', () => {
      const invalidUpdate = {
        imageUrl: 'not-a-url',
      };

      const result = updateProductSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('validates multiple field update', () => {
      const partialUpdate = {
        name: 'Updated Name',
        price: 299.99,
        stock: 100,
        category: 'Updated Category',
      };

      const result = updateProductSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });
  });
});
