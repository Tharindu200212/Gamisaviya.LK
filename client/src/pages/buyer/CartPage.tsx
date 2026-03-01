import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, TrendingDown } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { getImage } from '../../utils/imageMap';
import { useLanguage } from '../../contexts/LanguageContext';

export function CartPage() {
  const { items, updateQuantity, removeFromCart, getCartTotal, getItemPrice } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!user || user.role !== 'buyer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Please login to view cart</h2>
          <Link to="/login?role=buyer" className="text-amber-700 hover:text-amber-800">
            Login as Buyer
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping {t('cart')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = getItemPrice(item);
              const isWholesale = item.quantity >= item.wholesaleThreshold;

              return (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                      <img
                        src={getImage(item.image)}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="font-semibold text-lg text-gray-900 hover:text-amber-700"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">by {item.sellerName}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Pricing Badge */}
                      {isWholesale && (
                        <div className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3">
                          <TrendingDown className="w-4 h-4" />
                          <span>{t('wholesaleApplied')}</span>
                        </div>
                      )}

                      {/* Price Info */}
                      <div className="mb-4">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-bold text-gray-900">
                            LKR {price.toLocaleString()}
                          </span>
                          {isWholesale && (
                            <span className="text-sm text-gray-500 line-through">
                              LKR {item.retailPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {isWholesale ? 'Wholesale price' : 'Retail price'} • 
                          Wholesale at {item.wholesaleThreshold}+ items
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              updateQuantity(item.productId, Math.max(1, val));
                            }}
                            className="w-16 text-center font-semibold border-none focus:outline-none"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          Subtotal: LKR {(price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {items.map(item => {
                  const price = getItemPrice(item);
                  const isWholesale = item.quantity >= item.wholesaleThreshold;
                  
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                        {isWholesale && <span className="text-green-600 ml-1">(W)</span>}
                      </span>
                      <span className="font-medium">LKR {(price * item.quantity).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">LKR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">LKR 300</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-amber-700">LKR {(total + 300).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-amber-700 hover:text-amber-800 font-medium"
              >
                Continue Shopping
              </Link>

              {/* Pricing Info */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-900">
                  <strong>Note:</strong> Wholesale prices are automatically applied when you order the minimum quantity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
