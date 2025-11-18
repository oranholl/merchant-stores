
import { Router } from 'express';
import { 
  getStoreProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { validateProduct, validatePagination } from '../middleware/validation.js';
import { validateStoreExistence } from '../middleware/storeValidation.js';

const router = Router();

router.get('/store/:storeId', validateStoreExistence, validatePagination, getStoreProducts);
router.get('/store/:storeId/:id', validateStoreExistence, getProduct);
router.post('/store/:storeId', validateStoreExistence, validateProduct, createProduct);
router.put('/store/:storeId/:id', validateStoreExistence, validateProduct, updateProduct);
router.delete('/store/:storeId/:id', validateStoreExistence, deleteProduct);

export default router;