import { Request, Response } from 'express';
import { Store } from '../models/Store.js';
import { Product } from '../models/Product.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { createStoreSchema, updateStoreSchema } from '../schemas/store.schemas.js'; 
import { 
  getProductStats, 
  groupProductsByStore, 
  analyzeByCities, 
  analyzeByCityTypes, 
  findCategoryGaps, 
  findLocationPatterns, 
  calculateOpportunities 
} from '../utils/analytics.js'; 

export const getAllStores = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10, cityType } = req.query;
  
  const query: any = {};
  if (cityType) query.cityType = cityType;

  const stores = await Store.find(query)
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Store.countDocuments(query);

  res.json({
    success: true,
    data: stores,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await Store.findById(req.params.id);
  
  if (!store) {
    throw new AppError('Store not found', 404);
  }

  res.json({ success: true, data: store });
});

export const createStore = asyncHandler(async (req: Request, res: Response) => {
  
  const validationResult = createStoreSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation failed: ${errors}`, 400);
  }

  const store = await Store.create(validationResult.data);

  res.status(201).json({ 
    success: true,
    message: 'Store created successfully',
    data: store 
  });
});

export const updateStore = asyncHandler(async (req: Request, res: Response) => {
  
  const validationResult = updateStoreSchema.safeParse(req.body);
  
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    throw new AppError(`Validation failed: ${errors}`, 400);
  }

  const store = await Store.findByIdAndUpdate(
    req.params.id,
    validationResult.data,
    { new: true, runValidators: true }
  );

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  res.json({ 
    success: true,
    message: 'Store updated successfully',
    data: store 
  });
});

export const deleteStore = asyncHandler(async (req: Request, res: Response) => {
  const store = await Store.findByIdAndDelete(req.params.id);

  if (!store) {
    throw new AppError('Store not found', 404);
  }

  // Also delete all products in this store
  await Product.deleteMany({ store: req.params.id });

  res.json({ 
    success: true,
    message: 'Store and its products deleted successfully' 
  });
});


// INTERESTING API: Store Analytics 
export const getStoreAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const storeId = req.params.id;
  
  // Verify store exists
  const store = await Store.findById(storeId);
  if (!store) {
    throw new AppError('Store not found', 404);
  }

  // Get all products for this store
  const products = await Product.find({ store: storeId });

  // Calculate analytics using the new utility function
  const stats = getProductStats(products);

  const analytics = {
    success: true,
    data: {
      store: {
        id: store._id,
        name: store.name,
        city: store.city,
        cityType: store.cityType,
      },
      inventory: {
        totalProducts: stats.totalProducts,
        totalValue: stats.totalValue,
        averagePrice: stats.averagePrice,
        totalStock: stats.totalStock,
      },
      categories: stats.categoryStats,
      priceRanges: stats.priceRanges,
    },
  };

  res.json(analytics);
});

// INTERESTING API: Bulk Price Update
export const bulkUpdatePrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeId } = req.params;
    const { adjustment, type, category } = req.body;
    
    // Validate input
    if (!adjustment || !type || (type !== 'percentage' && type !== 'fixed')) {
      res.status(400).json({ error: 'Invalid adjustment parameters' });
      return;
    }

    // Build query
    const query: any = { store: storeId };
    if (category) {
      query.category = category;
    }

    // Get products to update
    const products = await Product.find(query);

    // Update prices
    const updatePromises = products.map(async (product) => {
      let newPrice: number;
      
      if (type === 'percentage') {
        newPrice = product.price * (1 + adjustment / 100);
      } else {
        newPrice = product.price + adjustment;
      }
      
      // Ensure price doesn't go negative
      newPrice = Math.max(0, newPrice);
      
      return Product.findByIdAndUpdate(product._id, { price: newPrice });
    });

    await Promise.all(updatePromises);

    res.json({
      message: 'Prices updated successfully',
      updatedCount: products.length,
      adjustment: {
        type,
        value: adjustment,
        category: category || 'all',
      },
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// INTERESTING API: Compare Stores 
export const compareStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const { storeIds } = req.body;

    if (!Array.isArray(storeIds) || storeIds.length < 2) {
      res.status(400).json({ error: 'Provide at least 2 store IDs to compare' });
      return;
    }

    const comparisons = await Promise.all(
      storeIds.map(async (storeId) => {
        const store = await Store.findById(storeId);
        if (!store) return null;

        const products = await Product.find({ store: storeId });
        const stats = getProductStats(products);
        
        return {
          store: {
            id: store._id,
            name: store.name,
          },
          metrics: {
            productCount: stats.totalProducts,
            totalValue: stats.totalValue,
            averagePrice: stats.averagePrice,
            totalStock: stats.totalStock,
            categories: stats.categoryStats.length, // Get unique category count from stats
          },
        };
      })
    );

    const validComparisons = comparisons.filter(c => c !== null);

    res.json({
      comparison: validComparisons,
      summary: {
        storesCompared: validComparisons.length,
        totalProducts: validComparisons.reduce((sum, c) => sum + c.metrics.productCount, 0),
        highestValue: Math.max(...validComparisons.map(c => c.metrics.totalValue)),
        lowestValue: Math.min(...validComparisons.map(c => c.metrics.totalValue)),
      },
    });
  } catch (error) {
    console.error('Compare stores error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// INTERESTING API: Market Density Analysis
export const getMarketDensity = asyncHandler(async (req: Request, res: Response) => {
  // Get all stores with their products
  const stores = await Store.find().lean();
  const allProducts = await Product.find().lean();

  // Group products by store using the utility function
  const productsByStore = groupProductsByStore(allProducts);

  // 1. Analyze by city
  const cityAnalysis = analyzeByCities(stores, productsByStore);

  // 2. Analyze by city type
  const cityTypeAnalysis = analyzeByCityTypes(stores, productsByStore);

  // 3. Find category gaps
  const categoryGaps = findCategoryGaps(stores, productsByStore);

  // 4. Find patterns
  const patterns = findLocationPatterns(stores, productsByStore);

  // 5. Calculate opportunities
  const opportunities = calculateOpportunities(categoryGaps);

  res.json({
    success: true,
    data: {
      byCities: cityAnalysis,
      byCityTypes: cityTypeAnalysis,
      categoryGaps,
      patterns,
      opportunities,
    },
  });
});