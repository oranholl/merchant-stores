import axios from 'axios';
import { Store, Product } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Backend wraps responses in { success: true, data: ... }
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Stores
export const getStores = () => 
  api.get<PaginatedResponse<Store[]>>('/stores');

export const getStore = (id: string) => 
  api.get<ApiResponse<Store>>(`/stores/${id}`);

export const createStore = (data: Partial<Store>) => 
  api.post<ApiResponse<Store>>('/stores', data);

export const updateStore = (id: string, data: Partial<Store>) => 
  api.put<ApiResponse<Store>>(`/stores/${id}`, data);

export const deleteStore = (id: string) => 
  api.delete<ApiResponse<void>>(`/stores/${id}`);

// Store Analytics
export const getStoreAnalytics = (id: string) =>
  api.get<ApiResponse<any>>(`/stores/${id}/analytics`);

export const bulkUpdatePrices = (storeId: string, adjustment: number, type: 'percentage' | 'fixed', category?: string) =>
  api.post<any>(`/stores/${storeId}/bulk-price-update`, { adjustment, type, category });

export const compareStores = (storeIds: string[]) =>
  api.post<any>('/stores/compare', { storeIds });

export const getMarketDensity = () =>
  api.get<ApiResponse<any>>('/stores/analytics/market-density');

// Products
export const getProducts = (storeId: string) => 
  api.get<ApiResponse<Product[]>>(`/products/store/${storeId}`);

export const getProduct = (storeId: string, id: string) => 
  api.get<ApiResponse<Product>>(`/products/store/${storeId}/${id}`);

export const createProduct = (storeId: string, data: Partial<Product>) => 
  api.post<ApiResponse<Product>>(`/products/store/${storeId}`, data);

export const updateProduct = (storeId: string, id: string, data: Partial<Product>) => 
  api.put<ApiResponse<Product>>(`/products/store/${storeId}/${id}`, data);

export const deleteProduct = (storeId: string, id: string) => 
  api.delete<ApiResponse<void>>(`/products/store/${storeId}/${id}`);