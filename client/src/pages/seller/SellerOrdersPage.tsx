import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, Truck, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { orderAPI } from '../../utils/api';
import { toast } from 'sonner';

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        images: string[];
        sellerId: string;
    };
    quantity: number;
    price: number; // This might be dynamically calculated or stored
}

interface Order {
    _id: string;
    buyerId: {
        name: string;
        email: string;
        phone: string;
    };
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

export const SellerOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await orderAPI.getSellerOrders();
            if (data.success) {
                setOrders(data.orders);
            } else {
                setError('Failed to load orders');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while loading orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const response = await orderAPI.updateStatus(id, newStatus);
            if (response.success) {
                setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus as any } : o));
                toast.success(`Order updated to ${newStatus}`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'shipped': return 'bg-purple-100 text-purple-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600">View and manage customer orders</p>
                </div>

                {error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                                <p className="text-gray-500">Wait for customers to place orders.</p>
                            </div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-lg text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <label className="text-sm font-medium text-gray-700 mr-2">Update Status:</label>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className="border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-sm"
                                                disabled={order.status === 'cancelled' || order.status === 'delivered'}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="p-6">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Customer Info */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                    Customer Details
                                                </h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p><span className="font-medium">Name:</span> {order.buyerId?.name || 'Guest'}</p>
                                                    <p><span className="font-medium">Phone:</span> {order.buyerId?.phone || 'N/A'}</p>
                                                    <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                                                    <p><span className="font-medium">Payment:</span> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                                                </div>
                                            </div>

                                            {/* Items */}
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg">
                                                            <img
                                                                src={item.productId.images?.[0] || 'https://placehold.co/50'}
                                                                alt={item.productId.name}
                                                                className="w-12 h-12 rounded object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 text-sm">{item.productId.name}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                            </div>
                                                            <div className="font-semibold text-sm text-amber-600">
                                                                {/* Note: This price might need to be passed from backend better if it's per unit */}
                                                                {/* For now assuming the controller filters correctly and these are valid */}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
