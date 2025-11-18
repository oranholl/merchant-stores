export interface Store {
  _id: string;
  name: string;
  description: string;
  city: string;
  cityType: 'big' | 'small';
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  store: string;
  category?: string;
  stock: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
