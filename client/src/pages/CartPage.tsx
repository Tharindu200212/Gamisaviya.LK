import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, TrendingDown } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Start adding products to your cart!</p>
          <button
            onClick={() => navigate('/products')}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-green-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const isWholesale = item.quantity >= item.product.wholesaleThreshold;
              const currentPrice = isWholesale
                ? item.product.wholesalePrice
                : item.product.retailPrice;
              const itemTotal = currentPrice * item.quantity;
              const savings = isWholesale
                ? (item.product.retailPrice - item.product.wholesalePrice) * item.quantity
                : 0;

              return (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div
                      className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/products/${item.product.id}`)}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3
                            className="font-bold text-lg text-gray-900 hover:text-primary cursor-pointer"
                            onClick={() => navigate(`/products/${item.product.id}`)}
                          >
                            {language === 'en' ? item.product.name : item.product.namesin}
                          </h3>
                          <p className="text-sm text-gray-600">{item.product.sellerName}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pricing Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            LKR {currentPrice}
                          </span>
                          {isWholesale && (
                            <span className="text-sm line-through text-gray-400">
                              LKR {item.product.retailPrice}
                            </span>
                          )}
                        </div>
                        {isWholesale && (
                          <div className="flex items-center bg-accent/20 border border-accent rounded-lg px-3 py-2 w-fit">
                            <TrendingDown className="w-4 h-4 text-accent-dark mr-2" />
                            <span className="text-sm text-secondary font-semibold">
                              {t('wholesaleApplied')}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-semibold w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            LKR {itemTotal}
                          </p>
                          {savings > 0 && (
                            <p className="text-xs text-green-600">
                              Saved LKR {savings}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Wholesale Threshold Info */}
                      {!isWholesale && item.quantity < item.product.wholesaleThreshold && (
                        <div className="mt-3 text-sm text-gray-600 bg-accent/10 px-3 py-2 rounded">
                          Add {item.product.wholesaleThreshold - item.quantity} more to get
                          wholesale price (LKR {item.product.wholesalePrice}/unit)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                  <span className="font-semibold">LKR {cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold text-secondary">FREE</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t('total')}:</span>
                    <span className="text-3xl font-bold text-primary">
                      LKR {cartTotal}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-semibold text-lg"
              >
                {t('checkout')}
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                {t('continueShopping')}
              </button>

              {/* Savings Summary */}
              {cartItems.some((item) => item.quantity >= item.product.wholesaleThreshold) && (
                <div className="mt-6 bg-accent/20 border border-accent rounded-lg p-4">
                  <p className="text-sm text-secondary font-semibold mb-2">
                    💰 Your Wholesale Savings
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    LKR{' '}
                    {cartItems.reduce((sum, item) => {
                      const isWholesale = item.quantity >= item.product.wholesaleThreshold;
                      return (
                        sum +
                        (isWholesale
                          ? (item.product.retailPrice - item.product.wholesalePrice) *
                          item.quantity
                          : 0)
                      );
                    }, 0)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
