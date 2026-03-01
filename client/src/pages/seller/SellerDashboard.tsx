import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, ShoppingBag, Plus, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { productAPI, orderAPI } from '../../utils/api';
import { toast } from 'sonner';

export const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    productCount: 0,
    orderCount: 0,
    rating: 0,
    recentProducts: [] as any[],
    recentOrders: [] as any[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, ordersData] = await Promise.all([
          productAPI.getSellerProducts(),
          orderAPI.getSellerOrders()
        ]);

        const products = productsData.success ? productsData.products : [];
        const orders = ordersData.success ? ordersData.orders : [];

        // Calculate stats
        const revenue = orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
        // Calculate average rating across products (if available, else placeholder)
        const avgRating = products.length > 0
          ? (products.reduce((sum: number, p: any) => sum + (p.rating || 0), 0) / products.length).toFixed(1)
          : '0.0';

        setStats({
          revenue,
          productCount: products.length,
          orderCount: orders.length,
          rating: Number(avgRating),
          recentProducts: products.slice(0, 3),
          recentOrders: orders.slice(0, 5)
        });

      } catch (error) {
        console.error('Failed to load dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {user?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6">
            <DollarSign className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">LKR {stats.revenue.toLocaleString()}</p>
            <p className="text-green-50">Total Revenue</p>
          </div>

          <div
            onClick={() => navigate('/seller/products')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition"
          >
            <Package className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.productCount}</p>
            <p className="text-gray-600">Total Products</p>
          </div>

          <div
            onClick={() => navigate('/seller/orders')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition"
          >
            <ShoppingBag className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.orderCount}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <TrendingUp className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.rating}</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/seller/add-product')}
            className="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition text-left"
          >
            <Plus className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Add New Product</h3>
            <p className="text-gray-600 text-sm">List a new product for sale</p>
          </button>

          <button
            onClick={() => navigate('/seller/orders')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition text-left"
          >
            <ShoppingBag className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Manage Orders</h3>
            <p className="text-gray-600 text-sm">View and process customer orders</p>
          </button>

          <button
            onClick={() => navigate('/seller/profile')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition text-left"
          >
            <Settings className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Seller Profile</h3>
            <p className="text-gray-600 text-sm">Update your seller information</p>
          </button>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
            <button
              onClick={() => navigate('/seller/products')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.recentProducts.length > 0 ? (
              stats.recentProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/seller/products/${product._id}/edit`)}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 hover:shadow-md transition cursor-pointer"
                >
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/100'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">
                        LKR {product.retailPrice}
                      </span>
                      <span className="text-sm text-gray-600">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No products found. Start selling today!
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h2>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{order.buyer?.name || 'Unknown Buyer'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">
                        LKR {order.totalAmount}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'processing'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No orders yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
