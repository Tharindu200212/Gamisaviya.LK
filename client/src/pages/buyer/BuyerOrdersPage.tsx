import React from 'react';
import { Package, MapPin, TrendingDown } from 'lucide-react';
import { orderAPI } from '../../utils/api';
import { Order } from '../../types';

export function BuyerOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getBuyerOrders();
        if (res.success) {
          setOrders(res.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      delivered: 'bg-green-100 text-green-800',
      processing: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      shipped: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders found</div>
          ) : orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">Order {order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Placed on {order.createdAt}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Order Total</div>
                  <div className="text-2xl font-bold text-green-700">
                    LKR {order.totalAmount ? order.totalAmount.toLocaleString() : 0}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-10 h-10 text-gray-400" />
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>LKR {item.pricePerUnit ? item.pricePerUnit.toLocaleString() : 0} each</span>
                          {/* {item.priceType === 'wholesale' && (
                            <>
                              <span>•</span>
                              <span className="flex items-center text-green-600 font-medium">
                                <TrendingDown className="w-4 h-4 mr-1" />
                                Wholesale Price Applied
                              </span>
                            </>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">Subtotal</div>
                      <div className="font-bold text-gray-900">
                        LKR {item.total ? item.total.toLocaleString() : 0}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              < div className="flex items-start space-x-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-4" >
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Shipping Address</div>
                  <div>{order.shippingAddress}</div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Track Order
                </button>
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <h3 className="font-bold text-green-900 mb-2">💡 About Wholesale Pricing</h3>
          <p className="text-sm text-green-800">
            Orders marked with "Wholesale Price Applied" received automatic discounts because the quantity met
            the seller's wholesale threshold. This dual pricing system helps you save more on bulk purchases!
          </p>
        </div>
      </div >
    </div >
  );
}
