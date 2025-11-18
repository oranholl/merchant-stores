import { Router } from 'express';
import { 
  getAllStores, 
  getStore, 
  createStore, 
  updateStore, 
  deleteStore,
  getStoreAnalytics,
  bulkUpdatePrices,
  compareStores,
  getMarketDensity
} from '../controllers/storeController.js';
import { validateStore } from '../middleware/validation.js';
import { validateStoreExistence } from '../middleware/storeValidation.js'; 

const router = Router();

// Standard CRUD
router.get('/', getAllStores);
router.get('/:id', getStore);
router.post('/', validateStore, createStore);
router.put('/:id', validateStore, updateStore);
router.delete('/:id', deleteStore);

// Interesting APIs
router.get('/:id/analytics', getStoreAnalytics);

router.post('/:storeId/bulk-price-update', validateStoreExistence, bulkUpdatePrices); 

router.post('/compare', compareStores);
router.get('/analytics/market-density', getMarketDensity);

export default router;