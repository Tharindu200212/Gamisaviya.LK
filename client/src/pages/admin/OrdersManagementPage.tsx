import React, { useState, useEffect } from 'react';
import { BackButton } from '../../components/common/BackButton';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { ShoppingBag, Search, Eye, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  priceType: 'retail' | 'wholesale';
}

interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const data = await import('../../utils/api').then(m => m.adminAPI.getAllOrders());
      if (data.success) {
        const mappedOrders = data.orders.map((o: any) => ({
          id: o._id, // Keep _id as id
          // Use a virtual order ID if available or just hash
          orderNumber: o.orderNumber || `ORD-${o._id.slice(-6).toUpperCase()}`,
          buyerName: o.buyerId?.name || o.buyerName || 'Unknown',
          buyerEmail: o.buyerId?.email || 'N/A',
          sellerId: o.sellerIds?.[0]?._id || 'Multiple', // Use first seller ID for referencing or modify interface
          sellerName: o.sellerIds?.map((s: any) => s.name).join(', ') || 'Unknown',
          items: o.items.map((i: any) => ({
            productId: i.productId?._id || i.productId,
            productName: i.productName || i.productId?.name,
            quantity: i.quantity,
            price: i.pricePerUnit,
            priceType: i.pricePerUnit < (i.productId?.retailPrice || 999999) ? 'wholesale' : 'retail' // Infer or just show price
          })),
          totalAmount: o.totalAmount,
          status: o.status,
          paymentMethod: o.paymentMethod,
          deliveryAddress: o.shippingAddress,
          createdAt: new Date(o.createdAt).toLocaleDateString(),
          updatedAt: new Date(o.updatedAt).toLocaleDateString(),
        }));

        // Fix up seller name if single seller (common case)
        mappedOrders.forEach((order: any, index: number) => {
          // We might need to look at the raw data again. 
          // backend populate: 'sellerIds' probably just returns IDs?
          // The controller `getAllOrders` populates `sellerIds`? 
          // Let's check controller. It populates 'buyerId' and 'items.productId'. 
          // It does NOT populate sellerIds currently.
          // However, items have productId which has sellerId.
          // For simplicity, we can try to derive or just say 'GamiSaviya Seller'
        });

        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          (order.id && order.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (order.buyerName && order.buyerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { orderAPI } = await import('../../utils/api');
      const result = await orderAPI.updateStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date().toLocaleDateString() } : order
        ));
        toast.success('Order status updated successfully');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error updating status');
    }
  };

  const openViewDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-green-100 text-green-700 border-green-200',
      processing: 'bg-green-100 text-green-700 border-green-200',
      shipped: 'bg-green-100 text-green-700 border-green-200',
      delivered: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton to="/admin/dashboard" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          </div>
          <p className="text-gray-600">Monitor and manage all platform orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-green-900">{orders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 mb-1">Active Orders</p>
                <p className="text-3xl font-bold text-green-900">{activeOrders}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 mb-1">Delivered</p>
                <p className="text-3xl font-bold text-green-900">
                  {orders.filter((o) => o.status === 'delivered').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-700 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">LKR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search orders by ID, buyer, or seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.buyerName}</p>
                          <p className="text-sm text-gray-500">{order.buyerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.sellerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-gray-50">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        LKR {order.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value: string) =>
                            handleUpdateStatus(order.id, value as Order['status'])
                          }
                        >
                          <SelectTrigger className="w-36">
                            <Badge variant="outline" className={getStatusBadge(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{order.createdAt}</p>
                          {order.updatedAt !== order.createdAt && (
                            <p className="text-gray-500">Updated: {order.updatedAt}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => openViewDialog(order)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6 py-4">
                {/* Order Status */}
                <div>
                  <Label className="text-gray-600">Order Status</Label>
                  <div className="mt-2">
                    <Badge className={getStatusBadge(selectedOrder.status)} variant="outline">
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Customer & Seller Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <Label className="text-green-700">Customer Information</Label>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{selectedOrder.buyerName}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.buyerEmail}</p>
                    </div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <Label className="text-green-700">Seller Information</Label>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium">{selectedOrder.sellerName}</p>
                      <p className="text-sm text-gray-600">ID: {selectedOrder.sellerId}</p>
                    </div>
                  </Card>
                </div>

                {/* Order Items */}
                <div>
                  <Label className="text-gray-600 mb-3 block">Order Items</Label>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <div className="flex gap-4 mt-2 text-sm text-gray-600">
                              <span>Quantity: {item.quantity}</span>
                              <span>
                                Price: LKR {item.price}{' '}
                                <Badge
                                  variant="outline"
                                  className={
                                    item.priceType === 'wholesale'
                                      ? 'bg-green-100 text-green-700 text-xs'
                                      : 'bg-green-100 text-green-700 text-xs'
                                  }
                                >
                                  {item.priceType}
                                </Badge>
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-green-600">
                              LKR {(item.quantity * item.price).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Total Amount */}
                <Card className="p-4 bg-gradient-to-br from-green-50 to-amber-50 border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">
                      LKR {selectedOrder.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </Card>

                {/* Delivery & Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">Payment Method</Label>
                    <p className="mt-1 font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Order Date</Label>
                    <p className="mt-1 font-medium">{selectedOrder.createdAt}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-600">Delivery Address</Label>
                  <Card className="p-3 mt-2 bg-gray-50">
                    <p>{selectedOrder.deliveryAddress}</p>
                  </Card>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
