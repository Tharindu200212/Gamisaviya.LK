import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Database,
} from 'lucide-react';
import { BackButton } from '../../components/common/BackButton';
import { adminAPI } from '../../utils/api';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>({
    users: { total: 0, buyers: 0, sellers: 0, pendingSellers: 0 },
    products: { total: 0, approved: 0, pending: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    revenue: { total: 0, currency: 'LKR' }
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          adminAPI.getPlatformStats(),
          adminAPI.getAllOrders()
        ]);

        if (statsData.success) {
          setStats(statsData.stats);
        }

        if (ordersData.success) {
          // Sort by creation date valid? Backup with slice
          const sorted = ordersData.orders.slice(0, 5).map((o: any) => ({
            id: o._id,
            orderNumber: `ORD-${o._id.slice(-6).toUpperCase()}`,
            buyerName: o.buyerId?.name || o.buyerName || 'Unknown',
            totalAmount: o.totalAmount,
            status: o.status
          }));
          setRecentOrders(sorted);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Derived stats
  const pendingApprovals = stats.users.pendingSellers;
  const totalRevenue = stats.revenue.total;
  const activeOrders = stats.orders.total - stats.orders.completed; // Approximation: total - completed. Or pending + processing + shipped. 
  // Let's rely on stats.orders.pending for now as specific "Active" in UI, or calculate derived if needed.
  // The UI showed "Active Orders" as non-delivered/cancelled. 
  // Backend stats returns pending and completed. 

  // Recalculate Active Orders roughly as Total - Completed (ignoring cancelled for simplicity or if backend doesn't account)
  // Or better, let's just use pending from stats for a quick view? 
  // The original UI calculate: mockOrders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton to="/" label="Back to Home" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">GamiSaviya.lk System Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
            <Users className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.users.sellers}</p>
            <p className="text-blue-50">Total Sellers</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl p-6">
            <Package className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.products.total}</p>
            <p className="text-amber-50">Total Products</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl p-6">
            <ShoppingBag className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.orders.total}</p>
            <p className="text-green-50">Total Orders</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
            <DollarSign className="w-10 h-10 mb-3 opacity-80" />
            <p className="text-3xl font-bold mb-1">LKR {totalRevenue.toLocaleString()}</p>
            <p className="text-purple-50">Platform Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/database-viewer')}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-xl transition text-left border-2 border-transparent hover:border-purple-300"
          >
            <Database className="w-8 h-8 mb-3 opacity-90" />
            <h3 className="font-bold text-lg mb-2">Database Viewer</h3>
            <p className="text-purple-100 text-sm">View and manage all database records</p>
          </button>

          <button
            onClick={() => navigate('/admin/seller-approval')}
            className="bg-white rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg transition text-left relative"
          >
            {pendingApprovals > 0 && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingApprovals}
              </span>
            )}
            <AlertCircle className="w-8 h-8 text-orange-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Seller Approvals</h3>
            <p className="text-gray-600 text-sm">Review pending seller applications</p>
          </button>

          <button
            onClick={() => navigate('/admin/product-approval')}
            className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition text-left"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Product Approvals</h3>
            <p className="text-gray-600 text-sm">Approve or reject product listings</p>
          </button>
        </div>

        {/* Management Sections */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Management</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition text-left"
          >
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600 text-sm">Add, edit, and delete platform users</p>
          </button>

          <button
            onClick={() => navigate('/admin/products')}
            className="bg-white rounded-xl p-6 border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg transition text-left"
          >
            <Package className="w-8 h-8 text-amber-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Product Management</h3>
            <p className="text-gray-600 text-sm">Manage all products and inventory</p>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition text-left"
          >
            <ShoppingBag className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-bold text-lg text-gray-900 mb-2">Order Management</h3>
            <p className="text-gray-600 text-sm">View and update order statuses</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-amber-600 hover:text-amber-700 font-semibold text-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 italic">No recent orders</p>
              ) : recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">#{order.orderNumber || order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.buyerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">LKR {order.totalAmount.toLocaleString()}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Active Orders</span>
                <span className="text-2xl font-bold text-blue-600">{stats.orders.total - stats.orders.completed}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Approved Sellers</span>
                <span className="text-2xl font-bold text-green-600">
                  {stats.users.sellers}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-gray-700">Listed Products</span>
                <span className="text-2xl font-bold text-amber-600">
                  {stats.products.approved}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Average Order Value</span>
                <span className="text-2xl font-bold text-purple-600">
                  LKR {stats.orders.total > 0 ? Math.round(totalRevenue / stats.orders.total).toLocaleString() : 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};