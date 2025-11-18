
/**
 * Groups all products by their store ID.
 * @param allProducts - Array of all products.
 * @returns A Map where key is storeId (string) and value is an array of products.
 */
export function groupProductsByStore(allProducts: any[]): Map<string, any[]> {
  const productsByStore = new Map<string, any[]>();
  allProducts.forEach(product => {
    const storeId = product.store.toString();
    if (!productsByStore.has(storeId)) {
      productsByStore.set(storeId, []);
    }
    productsByStore.get(storeId)!.push(product);
  });
  return productsByStore;
}

/**
 * Calculates category and price range statistics for a given array of products.
 */
export function getProductStats(products: any[]) {
  return {
    categoryStats: calculateCategoryStats(products),
    priceRanges: calculatePriceRanges(products),
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    averagePrice: products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0,
    totalStock: products.reduce((sum, p) => sum + p.stock, 0),
  };
}

/**
 * Analyze competition by individual cities.
 */
export function analyzeByCities(stores: any[], productsByStore: Map<string, any[]>) {
  const cityMap = new Map<string, {
    storeCount: number;
    categories: Set<string>;
    categoryCompetition: Map<string, number>;
  }>();

  stores.forEach(store => {
    const city = store.city || 'Unknown';
    if (!cityMap.has(city)) {
      cityMap.set(city, {
        storeCount: 0,
        categories: new Set(),
        categoryCompetition: new Map(),
      });
    }

    const cityData = cityMap.get(city)!;
    cityData.storeCount++;

    const products = productsByStore.get(store._id.toString()) || [];
    const storeCategories = new Set(
      products.map(p => p.category || 'Uncategorized').filter(Boolean)
    );

    storeCategories.forEach(category => {
      cityData.categories.add(category);
      const count = cityData.categoryCompetition.get(category) || 0;
      cityData.categoryCompetition.set(category, count + 1);
    });
  });

  // Convert to response format with competition analysis
  return Array.from(cityMap.entries()).map(([city, data]) => {
    const categoryDetails = Array.from(data.categoryCompetition.entries()).map(
      ([category, storeCount]) => {
        const saturation = (storeCount / data.storeCount) * 100;
        let status: string;
        if (saturation >= 60) {
          status = 'SATURATED';
        } else if (saturation >= 30) {
          status = 'COMPETITIVE';
        } else {
          status = 'EMERGING';
        }

        return {
          category,
          storeCount,
          saturation: Math.round(saturation),
          status,
        };
      }
    );

    return {
      city,
      storeCount: data.storeCount,
      categoryCount: data.categories.size,
      categories: categoryDetails.sort((a, b) => b.storeCount - a.storeCount),
    };
  }).sort((a, b) => b.storeCount - a.storeCount);
}

/**
 * Analyze by city types (metro, tourist, etc).
 */
export function analyzeByCityTypes(stores: any[], productsByStore: Map<string, any[]>) {
  const typeMap = new Map<string, {
    storeCount: number;
    cities: Set<string>;
    categories: Set<string>;
    categoryCompetition: Map<string, number>;
  }>();

  stores.forEach(store => {
    const cityType = store.cityType || 'unknown';
    if (!typeMap.has(cityType)) {
      typeMap.set(cityType, {
        storeCount: 0,
        cities: new Set(),
        categories: new Set(),
        categoryCompetition: new Map(),
      });
    }

    const typeData = typeMap.get(cityType)!;
    typeData.storeCount++;
    if (store.city) typeData.cities.add(store.city);

    const products = productsByStore.get(store._id.toString()) || [];
    const storeCategories = new Set(
      products.map(p => p.category || 'Uncategorized').filter(Boolean)
    );

    storeCategories.forEach(category => {
      typeData.categories.add(category);
      const count = typeData.categoryCompetition.get(category) || 0;
      typeData.categoryCompetition.set(category, count + 1);
    });
  });

  return Array.from(typeMap.entries()).map(([cityType, data]) => {
    const categoryDetails = Array.from(data.categoryCompetition.entries()).map(
      ([category, storeCount]) => {
        const saturation = (storeCount / data.storeCount) * 100;
        return {
          category,
          storeCount,
          saturation: Math.round(saturation),
        };
      }
    );

    return {
      cityType,
      storeCount: data.storeCount,
      cityCount: data.cities.size,
      categories: categoryDetails,
    };
  });
}

/**
 * Find which categories are missing in which locations (category gaps).
 */
export function findCategoryGaps(stores: any[], productsByStore: Map<string, any[]>) {
  // Get all categories across all stores
  const allCategories = new Set<string>();
  productsByStore.forEach(products => {
    products.forEach(p => {
      if (p.category) allCategories.add(p.category);
    });
  });

  // Group by city type
  const categoryByCityType = new Map<string, Set<string>>();
  stores.forEach(store => {
    const cityType = store.cityType || 'unknown';
    if (!categoryByCityType.has(cityType)) {
      categoryByCityType.set(cityType, new Set());
    }

    const products = productsByStore.get(store._id.toString()) || [];
    products.forEach(p => {
      if (p.category) {
        categoryByCityType.get(cityType)!.add(p.category);
      }
    });
  });

  // Find gaps
  const gaps: any[] = [];
  categoryByCityType.forEach((categories, cityType) => {
    const missing = Array.from(allCategories).filter(cat => !categories.has(cat));
    
    if (missing.length > 0) {
      // Find where these categories DO exist
      const presentIn: string[] = [];
      categoryByCityType.forEach((cats, type) => {
        if (type !== cityType && missing.some(m => cats.has(m))) {
          presentIn.push(type);
        }
      });

      gaps.push({
        cityType,
        missingCategories: missing,
        presentIn: [...new Set(presentIn)],
      });
    }
  });

  return gaps;
}

/**
 * Find location patterns for categories.
 */
export function findLocationPatterns(stores: any[], productsByStore: Map<string, any[]>) {
  // Get category presence by city type
  const categoryPresence = new Map<string, Set<string>>();
  
  stores.forEach(store => {
    const cityType = store.cityType || 'unknown';
    const products = productsByStore.get(store._id.toString()) || [];
    
    products.forEach(p => {
      if (p.category) {
        if (!categoryPresence.has(p.category)) {
          categoryPresence.set(p.category, new Set());
        }
        categoryPresence.get(p.category)!.add(cityType);
      }
    });
  });

  // Analyze patterns
  const patterns: any[] = [];
  const allCityTypes = new Set(stores.map(s => s.cityType || 'unknown'));

  categoryPresence.forEach((cityTypes, category) => {
    const presentIn = Array.from(cityTypes);
    const absentFrom = Array.from(allCityTypes).filter(ct => !cityTypes.has(ct));

    if (absentFrom.length > 0) {
      patterns.push({
        category,
        presentIn,
        absentFrom,
        coverage: `${presentIn.length}/${allCityTypes.size} location types`,
      });
    }
  });

  return patterns;
}

/**
 * Calculate business opportunities based on gaps.
 */
export function calculateOpportunities(categoryGaps: any[]) {
  const opportunities: any[] = [];

  categoryGaps.forEach(gap => {
    gap.missingCategories.forEach((category: string) => {
      opportunities.push({
        cityType: gap.cityType,
        category,
        reason: `No stores offering ${category} in ${gap.cityType} locations`,
        competitionLevel: 'NONE',
        recommendation: `Consider opening a ${category} store in ${gap.cityType} area`,
      });
    });
  });

  return opportunities.sort((a, b) => {
    // Prioritize gaps in larger markets
    const typeOrder = { 'big': 0, 'small': 1, 'unknown': 2 };
    const aOrder = typeOrder[a.cityType as keyof typeof typeOrder] ?? 3;
    const bOrder = typeOrder[b.cityType as keyof typeof typeOrder] ?? 3;
    return aOrder - bOrder; 
  });
}

function calculateCategoryStats(products: any[]) {
  const categoryMap = new Map<string, { count: number; totalValue: number }>();
  
  products.forEach(product => {
    const category = product.category || 'Uncategorized';
    const existing = categoryMap.get(category) || { count: 0, totalValue: 0 };
    categoryMap.set(category, {
      count: existing.count + 1,
      totalValue: existing.totalValue + (product.price * product.stock),
    });
  });

  return Array.from(categoryMap.entries()).map(([name, stats]) => ({
    category: name,
    productCount: stats.count,
    totalValue: stats.totalValue,
  }));
}

function calculatePriceRanges(products: any[]) {
  const ranges = [
    { min: 0, max: 25, label: '$0-$25' },
    { min: 25, max: 50, label: '$25-$50' },
    { min: 50, max: 100, label: '$50-$100' },
    { min: 100, max: 500, label: '$100-$500' },
    { min: 500, max: Infinity, label: '$500+' },
  ];

  return ranges.map(range => ({
    range: range.label,
    count: products.filter(p => p.price >= range.min && p.price < range.max).length,
  }));
}