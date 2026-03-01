import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, Heart, User, MapPin, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { mockOrders } from '../../data/mockData';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const navigate = useNavigate();

  const recentOrders = mockOrders.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Here's what's happening with your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div
            onClick={() => navigate('/cart')}
            className="bg-gradient-to-br from-green-500 to-amber-500 text-white rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <ShoppingBag className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{cartCount}</p>
            <p className="text-green-50">Items in Cart</p>
            {cartTotal > 0 && (
              <p className="text-sm mt-2 font-semibold">LKR {cartTotal}</p>
            )}
          </div>

          <div
            onClick={() => navigate('/buyer/orders')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition"
          >
            <Package className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-3xl font-bold text-gray-900 mb-1">{mockOrders.length}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <Heart className="w-10 h-10 mb-3 text-red-500" />
            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-gray-600">Wishlist Items</p>
          </div>

          <div
            onClick={() => navigate('/buyer/profile')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 cursor-pointer hover:shadow-lg transition"
          >
            <User className="w-10 h-10 mb-3 text-green-500" />
            <p className="text-sm font-semibold text-gray-900 mb-1">Profile</p>
            <p className="text-gray-600">Manage Account</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/products')}
            className="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition text-left"
          >
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Continue Shopping</h3>
            <p className="text-gray-600 text-sm">Browse our collection of authentic products</p>
          </button>

          <button
            onClick={() => navigate('/buyer/addresses')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition text-left"
          >
            <MapPin className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Manage Addresses</h3>
            <p className="text-gray-600 text-sm">Add or update delivery addresses</p>
          </button>

          <button
            onClick={() => navigate('/buyer/orders')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition text-left"
          >
            <Package className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Track Orders</h3>
            <p className="text-gray-600 text-sm">View your order history and status</p>
          </button>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <button
              onClick={() => navigate('/buyer/orders')}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'processing'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'shipped'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">
                      {order.items.length} item(s)
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      LKR {order.totalAmount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No orders yet</p>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
