import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const orderId = localStorage.getItem('lastOrderId') || 'XXXXXXXXX';

  useEffect(() => {
    // Clean up after showing confirmation
    const timer = setTimeout(() => {
      localStorage.removeItem('lastOrderId');
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>

        {/* Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase from GamiSaviya.lk
        </p>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Your Order Number</p>
            <p className="text-3xl font-bold text-amber-600">#{orderId}</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <Package className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <p className="text-gray-700 mb-2">
              We've received your order and will start processing it soon.
            </p>
            <p className="text-sm text-gray-600">
              You'll receive a confirmation email with tracking details.
            </p>
          </div>

          <div className="text-left space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Order confirmation sent to your email</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Seller has been notified</span>
            </div>
            <div className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Estimated delivery: 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/buyer/orders')}
            className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold"
          >
            View Order Details
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
