import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, MapPin, CreditCard, Package, AlertCircle } from 'lucide-react';
import { orderAPI } from '../../utils/api';
import { toast } from 'sonner';

export const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await orderAPI.getById(id);
                if (data.success) {
                    setOrder(data.order);
                } else {
                    setError('Failed to load order details');
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while loading the order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

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

    /* 
    // Add cancel functionality if api supports it
    const handleCancel = async () => {
      if(!window.confirm('Are you sure you want to cancel this order?')) return;
      try {
          // await orderAPI.cancel(id); // If API existed
          toast.success('Order cancelled');
          // Refresh
      } catch(e) { toast.error('Failed to cancel'); }
    } 
    */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 text-center">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Order</h2>
                    <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
                    <button onClick={() => navigate('/buyer/orders')} className="text-amber-600 hover:text-amber-700 font-medium">
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate('/buyer/orders')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Orders
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</h1>
                            <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                        </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                        {/* Order Items */}
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-amber-600" />
                                Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.productId?.images?.[0] || 'https://placehold.co/100'}
                                                alt={item.productId?.name || 'Product'}
                                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{item.productId?.name || 'Unknown Product'}</h3>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">LKR {(item.price || 0).toLocaleString()}</p>
                                            {/* Note: item.price might not exist on older orders if not saved, fallback logic needed if dealing with legacy data */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                            {/* Shipping Info */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                                    Shipping Details
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 space-y-2">
                                    <p><span className="font-medium">Name:</span> {order.buyerName}</p>
                                    <p><span className="font-medium">Address:</span> {order.shippingAddress}</p>
                                    <p><span className="font-medium">Phone:</span> {order.buyerId?.phone || order.phone || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2 text-amber-600" />
                                    Payment Summary
                                </h2>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Payment Method</span>
                                        <span className="font-medium capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>LKR {order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>LKR {order.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
