export type UserRole = 'buyer' | 'seller' | 'admin' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  namesin: string;
  description: string;
  descriptionsin: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleThreshold: number;
  stock: number;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  approved: boolean;
  featured?: boolean;
  rating?: number;
  reviews?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  sellerId?: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  story: string;
  storysin: string;
  image: string;
  approved: boolean;
  createdAt: string;
  products?: number;
  rating?: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullAddress: string;
  city: string;
  district: string;
  isDefault: boolean;
}
