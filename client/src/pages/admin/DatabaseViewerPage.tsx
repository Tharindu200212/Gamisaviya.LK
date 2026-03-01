import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  Database, 
  Users, 
  Package, 
  ShoppingCart, 
  Store,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { adminAPI } from '../../utils/api';
import { BackButton } from '../../components/common/BackButton';

interface DatabaseStats {
  users: number;
  products: number;
  orders: number;
  sellers: number;
  pendingSellers: number;
}

export default function DatabaseViewerPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  
  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersData, productsData, ordersData, pendingSellersData] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders(),
        adminAPI.getPendingSellers(),
      ]);

      setUsers(usersData.users || []);
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setPendingSellers(pendingSellersData.sellers || []);
      
      // Get all sellers (approved and pending)
      const allSellers = usersData.users?.filter((u: any) => u.role === 'seller') || [];
      setSellers(allSellers);
    } catch (error) {
      console.error('Error loading database data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const stats: DatabaseStats = {
    users: users.length,
    products: products.length,
    orders: orders.length,
    sellers: sellers.length,
    pendingSellers: pendingSellers.length,
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only administrators can access the database viewer.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <BackButton to="/admin/dashboard" />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Database Viewer</h1>
                <p className="text-gray-600">View and manage all database records</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard
              icon={Users}
              label="Total Users"
              value={stats.users}
              color="blue"
            />
            <StatCard
              icon={Package}
              label="Products"
              value={stats.products}
              color="green"
            />
            <StatCard
              icon={ShoppingCart}
              label="Orders"
              value={stats.orders}
              color="purple"
            />
            <StatCard
              icon={Store}
              label="Sellers"
              value={stats.sellers}
              color="orange"
            />
            <StatCard
              icon={Database}
              label="Pending Approvals"
              value={stats.pendingSellers}
              color="amber"
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search across all records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="sellers">Sellers ({sellers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DatabaseOverview 
              stats={stats}
              users={users}
              products={products}
              orders={orders}
              sellers={sellers}
            />
          </TabsContent>

          <TabsContent value="users">
            <UsersTable users={users} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="products">
            <ProductsTable products={products} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable orders={orders} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="sellers">
            <SellersTable sellers={sellers} pendingSellers={pendingSellers} searchTerm={searchTerm} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}

// Database Overview
function DatabaseOverview({ stats, users, products, orders, sellers }: any) {
  const recentUsers = users.slice(0, 5);
  const recentProducts = products.slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Recent Users
        </h3>
        <div className="space-y-3">
          {recentUsers.map((user: any) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                {user.role}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-green-600" />
          Recent Products
        </h3>
        <div className="space-y-3">
          {recentProducts.map((product: any) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={product.approved ? 'default' : 'secondary'}>
                  {product.approved ? 'Approved' : 'Pending'}
                </Badge>
                <p className="font-bold text-amber-600">Rs.{product.retailPrice}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-600" />
          Recent Orders
        </h3>
        <div className="space-y-3">
          {recentOrders.map((order: any) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-600">
                  {order.buyerName} • {order.items?.length || 0} items
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 text-lg">Rs.{order.totalAmount?.toFixed(2)}</p>
                <Badge 
                  variant={
                    order.status === 'delivered' ? 'default' : 
                    order.status === 'pending' ? 'secondary' : 
                    'outline'
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Users Table
function UsersTable({ users, searchTerm }: any) {
  const filteredUsers = users.filter((user: any) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="text-amber-700 font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={
                      user.role === 'admin' ? 'destructive' : 
                      user.role === 'seller' ? 'default' : 
                      'secondary'
                    }
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.id?.slice(0, 8)}...
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No users found</p>
        </div>
      )}
    </Card>
  );
}

// Products Table
function ProductsTable({ products, searchTerm }: any) {
  const filteredProducts = products.filter((product: any) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sellerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Retail Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wholesale Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product: any) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.namesin}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{product.category}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.sellerName}</div>
                  <div className="text-sm text-gray-500">{product.sellerLocation}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    Rs.{product.retailPrice?.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">
                    Rs.{product.wholesalePrice?.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({product.wholesaleThreshold}+ units)
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock} units
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <Badge variant={product.approved ? 'default' : 'secondary'}>
                      {product.approved ? '✓ Approved' : '⏳ Pending'}
                    </Badge>
                    {product.featured && (
                      <Badge variant="outline" className="bg-yellow-50">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No products found</p>
        </div>
      )}
    </Card>
  );
}

// Orders Table
function OrdersTable({ orders, searchTerm }: any) {
  const filteredOrders = orders.filter((order: any) =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {order.id}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.buyerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="outline">{order.items?.length || 0} items</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    Rs.{order.totalAmount?.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    variant={
                      order.status === 'delivered' ? 'default' : 
                      order.status === 'pending' ? 'secondary' : 
                      order.status === 'processing' ? 'outline' :
                      'destructive'
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No orders found</p>
        </div>
      )}
    </Card>
  );
}

// Sellers Table
function SellersTable({ sellers, pendingSellers, searchTerm }: any) {
  const allSellers = [...sellers];
  const filteredSellers = allSellers.filter((seller: any) =>
    seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {pendingSellers.length > 0 && (
        <Card className="p-6 border-amber-200 bg-amber-50">
          <h3 className="text-lg font-bold text-amber-900 mb-4">
            ⏳ Pending Seller Approvals ({pendingSellers.length})
          </h3>
          <div className="space-y-3">
            {pendingSellers.map((seller: any) => (
              <div key={seller.id} className="bg-white p-4 rounded-lg border border-amber-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{seller.name}</p>
                    <p className="text-sm text-gray-600">{seller.email}</p>
                    <p className="text-sm text-gray-500 mt-1">{seller.location}</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map((seller: any) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Store className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{seller.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.location || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{seller.phone || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(seller.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No sellers found</p>
          </div>
        )}
      </Card>
    </div>
  );
}