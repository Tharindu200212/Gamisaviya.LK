import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';

export function OrderConfirmationPage() {
  const location = useLocation();
  const { orderId, total, items } = location.state || { orderId: 'ORD123', total: 0, items: 0 };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We've received your order and will process it soon.
        </p>

        <div className="bg-gradient-to-br from-green-50 to-amber-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="text-sm text-gray-600 mb-2">Order ID</div>
          <div className="text-2xl font-bold text-green-700 mb-4">{orderId}</div>
          <div className="flex justify-between text-sm border-t border-green-200 pt-4">
            <span className="text-gray-600">Items:</span>
            <span className="font-semibold">{items}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-bold text-gray-900">LKR {total.toLocaleString()}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/buyer/orders"
            className="flex items-center justify-center space-x-2 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            <Package className="w-5 h-5" />
            <span>View My Orders</span>
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
          <strong>Note:</strong> Wholesale pricing was automatically applied to eligible items in your order.
        </div>
      </div>
    </div>
  );
}
