import { describe, it, expect } from 'vitest';
import {
  groupProductsByStore,
  getProductStats,
  analyzeByCities,
  analyzeByCityTypes,
  findCategoryGaps,
  calculateOpportunities
} from '../utils/analytics';

describe('Analytics Utils', () => {
  describe('groupProductsByStore', () => {
    it('groups products by store ID correctly', () => {
      const products = [
        { _id: '1', name: 'Product 1', store: { toString: () => 'store1' } },
        { _id: '2', name: 'Product 2', store: { toString: () => 'store1' } },
        { _id: '3', name: 'Product 3', store: { toString: () => 'store2' } },
      ];

      const result = groupProductsByStore(products);

      expect(result.size).toBe(2);
      expect(result.get('store1')).toHaveLength(2);
      expect(result.get('store2')).toHaveLength(1);
    });

    it('returns empty map for empty products array', () => {
      const result = groupProductsByStore([]);
      expect(result.size).toBe(0);
    });
  });

  describe('getProductStats', () => {
    it('calculates product statistics correctly', () => {
      const products = [
        { name: 'Laptop', price: 1000, stock: 10, category: 'Electronics' },
        { name: 'Mouse', price: 50, stock: 20, category: 'Electronics' },
        { name: 'Shirt', price: 30, stock: 50, category: 'Fashion' },
      ];

      const stats = getProductStats(products);

      expect(stats.totalProducts).toBe(3);
      expect(stats.totalValue).toBe(1000 * 10 + 50 * 20 + 30 * 50); // 13,500
      expect(stats.averagePrice).toBe((1000 + 50 + 30) / 3); // 360
      expect(stats.totalStock).toBe(80);
      expect(stats.categoryStats).toHaveLength(2);
    });

    it('handles empty products array', () => {
      const stats = getProductStats([]);

      expect(stats.totalProducts).toBe(0);
      expect(stats.totalValue).toBe(0);
      expect(stats.averagePrice).toBe(0);
      expect(stats.totalStock).toBe(0);
    });

    it('categorizes products correctly', () => {
      const products = [
        { name: 'Laptop', price: 1000, stock: 10, category: 'Electronics' },
        { name: 'Mouse', price: 50, stock: 20, category: 'Electronics' },
        { name: 'Shirt', price: 30, stock: 50, category: 'Fashion' },
      ];

      const stats = getProductStats(products);
      const electronics = stats.categoryStats.find(c => c.category === 'Electronics');
      const fashion = stats.categoryStats.find(c => c.category === 'Fashion');

      expect(electronics?.productCount).toBe(2);
      expect(fashion?.productCount).toBe(1);
    });
  });

  describe('analyzeByCities', () => {
    it('analyzes stores by city correctly', () => {
      const stores = [
        { _id: { toString: () => '1' }, city: 'New York', cityType: 'big' },
        { _id: { toString: () => '2' }, city: 'New York', cityType: 'big' },
        { _id: { toString: () => '3' }, city: 'Los Angeles', cityType: 'big' },
      ];

      const productsByStore = new Map([
        ['1', [{ category: 'Electronics' }]],
        ['2', [{ category: 'Fashion' }]],
        ['3', [{ category: 'Electronics' }]],
      ]);

      const result = analyzeByCities(stores, productsByStore);

      expect(result).toHaveLength(2);
      expect(result[0].city).toBe('New York');
      expect(result[0].storeCount).toBe(2);
      expect(result[1].city).toBe('Los Angeles');
      expect(result[1].storeCount).toBe(1);
    });

    it('sorts cities by store count descending', () => {
      const stores = [
        { _id: { toString: () => '1' }, city: 'Small City', cityType: 'small' },
        { _id: { toString: () => '2' }, city: 'Big City', cityType: 'big' },
        { _id: { toString: () => '3' }, city: 'Big City', cityType: 'big' },
        { _id: { toString: () => '4' }, city: 'Big City', cityType: 'big' },
      ];

      const productsByStore = new Map();
      const result = analyzeByCities(stores, productsByStore);

      expect(result[0].city).toBe('Big City');
      expect(result[0].storeCount).toBe(3);
    });
  });

  describe('analyzeByCityTypes', () => {
    it('analyzes stores by city type correctly', () => {
      const stores = [
        { _id: { toString: () => '1' }, city: 'New York', cityType: 'big' },
        { _id: { toString: () => '2' }, city: 'Los Angeles', cityType: 'big' },
        { _id: { toString: () => '3' }, city: 'Smallville', cityType: 'small' },
      ];

      const productsByStore = new Map([
        ['1', [{ category: 'Electronics' }]],
        ['2', [{ category: 'Fashion' }]],
        ['3', [{ category: 'Food' }]],
      ]);

      const result = analyzeByCityTypes(stores, productsByStore);

      const bigCities = result.find(r => r.cityType === 'big');
      const smallCities = result.find(r => r.cityType === 'small');

      expect(bigCities?.storeCount).toBe(2);
      expect(bigCities?.cityCount).toBe(2);
      expect(smallCities?.storeCount).toBe(1);
      expect(smallCities?.cityCount).toBe(1);
    });
  });

  describe('findCategoryGaps', () => {
    it('identifies missing categories in city types', () => {
      const stores = [
        { _id: { toString: () => '1' }, cityType: 'big' },
        { _id: { toString: () => '2' }, cityType: 'small' },
      ];

      const productsByStore = new Map([
        ['1', [{ category: 'Electronics' }, { category: 'Fashion' }]],
        ['2', [{ category: 'Food' }]],
      ]);

      const result = findCategoryGaps(stores, productsByStore);

      expect(result).toHaveLength(2);
      
      const bigCityGaps = result.find(g => g.cityType === 'big');
      const smallCityGaps = result.find(g => g.cityType === 'small');

      expect(bigCityGaps?.missingCategories).toContain('Food');
      expect(smallCityGaps?.missingCategories).toContain('Electronics');
      expect(smallCityGaps?.missingCategories).toContain('Fashion');
    });

    it('returns empty array when no gaps exist', () => {
      const stores = [
        { _id: { toString: () => '1' }, cityType: 'big' },
        { _id: { toString: () => '2' }, cityType: 'small' },
      ];

      const productsByStore = new Map([
        ['1', [{ category: 'Electronics' }]],
        ['2', [{ category: 'Electronics' }]],
      ]);

      const result = findCategoryGaps(stores, productsByStore);

      expect(result).toHaveLength(0);
    });
  });

  describe('calculateOpportunities', () => {
    it('generates opportunities from category gaps', () => {
      const categoryGaps = [
        {
          cityType: 'small',
          missingCategories: ['Electronics', 'Fashion'],
          presentIn: ['big'],
        },
      ];

      const result = calculateOpportunities(categoryGaps);

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('Electronics');
      expect(result[0].cityType).toBe('small');
      expect(result[0].competitionLevel).toBe('NONE');
      expect(result[0].reason).toContain('No stores offering Electronics');
    });

    it('prioritizes big cities over small cities', () => {
      const categoryGaps = [
        { cityType: 'small', missingCategories: ['Electronics'], presentIn: [] },
        { cityType: 'big', missingCategories: ['Fashion'], presentIn: [] },
      ];

      const result = calculateOpportunities(categoryGaps);

      expect(result[0].cityType).toBe('big');
      expect(result[1].cityType).toBe('small');
    });

    it('returns empty array for no gaps', () => {
      const result = calculateOpportunities([]);
      expect(result).toHaveLength(0);
    });
  });
});
