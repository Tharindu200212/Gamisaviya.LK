import { useState, useEffect } from 'react';
import { Product } from '../types';
import { productAPI } from '../utils/api';

export const useProducts = (filters?: { category?: string; featured?: boolean }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [filters?.category, filters?.featured]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getAll(filters);
      if (response.success) {
        setProducts(response.products || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  return { products, loading, error, refetch };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getById(id);
      if (response.success) {
        setProduct(response.product);
      }
    } catch (err: any) {
      console.error('Failed to fetch product:', err);
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, refetch: fetchProduct };
};
