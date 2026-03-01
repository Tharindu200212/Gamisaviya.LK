import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Loader2, Package, Star } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { toast } from 'sonner';

interface Product {
  id: string; // Updated to match API response conventions, API might return _id which we'll map
  _id?: string;
  name: string;
  description: string;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleThreshold: number;
  stock: number;
  sellerName: string; // API populate
  sellerId: any;
  category: string;
  images: string[];
  approved: boolean;
  featured?: boolean;
}

export function ApprovalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const data = await adminAPI.getAllProducts();
      if (data.success) {
        // Map backend _id to id
        const mappedProducts = data.products.map((p: any) => ({
          id: p._id,
          ...p,
          sellerName: p.sellerId?.name || 'Unknown'
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      if (isInitial) toast.error('Failed to load products');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(true);
    const interval = setInterval(() => fetchProducts(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await adminAPI.approveProduct(id, true);
      if (response.success) {
        toast.success('Product approved successfully');
        // Update local state locally to avoid flicker
        setProducts(products.map(p => p.id === id ? { ...p, approved: true } : p));
      }
    } catch (error) {
      toast.error('Failed to approve product');
    }
  };

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      // Pass the current approval status to avoid changing it unintentionally, only toggle featured
      // The API expects { approved, featured }
      // We need to find the product to know its current approved status
      const product = products.find(p => p.id === id);
      if (!product) return;

      const response = await adminAPI.approveProduct(id, product.approved, !currentStatus);
      if (response.success) {
        toast.success(currentStatus ? 'Removed from featured' : 'Added to featured');
        setProducts(products.map(p => p.id === id ? { ...p, featured: !currentStatus } : p));
      }
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const handleReject = async (id: string) => {
    // For now, rejection could just be toggling approval off or deleting
    if (!window.confirm("Are you sure you want to reject (delete) this product?")) return;
    // Assuming we use delete for reject in this context (or we could set approved: false)
    // Let's set approved: false for now
    const response = await adminAPI.approveProduct(id, false);
    if (response.success) {
      toast.success('Product rejected (unapproved)');
      setProducts(products.map(p => p.id === id ? { ...p, approved: false } : p));
    }
  };

  const filteredProducts = filter === 'pending'
    ? products.filter(p => !p.approved)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  const pendingCount = products.filter(p => !p.approved).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Approvals</h1>
            <p className="text-gray-600">Review and approve seller products</p>
          </div>
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${filter === 'pending'
                ? 'bg-amber-100 text-amber-800 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              Pending
              <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'pending' ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-600'
                }`}>
                {pendingCount}
              </span>
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${filter === 'all'
                ? 'bg-amber-100 text-amber-800 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              All Products
              <span className={`text-xs px-2 py-0.5 rounded-full ${filter === 'all' ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-600'
                }`}>
                {products.length}
              </span>
            </button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <div className="mb-4 text-gray-400">
              {filter === 'pending' ? <CheckCircle className="w-12 h-12 mx-auto" /> : <Package className="w-12 h-12 mx-auto" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {filter === 'pending' ? 'No pending approvals' : 'No products found'}
            </h3>
            <p className="text-gray-500 mt-1">
              {filter === 'pending' ? 'All products have been reviewed!' : 'Wait for sellers to add products.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-transparent hover:border-amber-400 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400'}
                      alt={product.name}
                      className="w-full md:w-48 h-48 object-cover rounded-lg"
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded shadow">Featured</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        <p className="text-sm text-gray-500">
                          Seller: {product.sellerName} • Category: {product.category}
                        </p>
                      </div>
                      <span className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${product.approved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {product.approved ? (
                          <><CheckCircle className="w-4 h-4 mr-1" /> Active</>
                        ) : (
                          <><Clock className="w-4 h-4 mr-1" /> Pending</>
                        )}
                      </span>
                    </div>

                    {/* Pricing Information */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Retail</div>
                        <div className="font-bold text-gray-900">LKR {product.retailPrice?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Wholesale</div>
                        <div className="font-bold text-green-600">LKR {product.wholesalePrice?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Stock</div>
                        <div className="font-bold text-gray-900">{product.stock}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      {!product.approved && (
                        <button
                          onClick={() => handleApprove(product.id)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                      )}

                      {product.approved && (
                        <button
                          onClick={() => handleReject(product.id)}
                          className="flex items-center px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Unapprove
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleFeature(product.id, !!product.featured)}
                        className={`flex items-center px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${product.featured
                          ? 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        <Star className={`w-4 h-4 mr-2 ${product.featured ? 'fill-current' : ''}`} />
                        {product.featured ? 'Featured' : 'Feature Product'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
