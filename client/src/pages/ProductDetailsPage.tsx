import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, Star, Plus, Minus, Package, TrendingDown, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { productAPI } from '../utils/api';
import { getImage } from '../utils/imageMap';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productAPI.getById(id);
        if (data.success) {
          setProduct({ ...data.product, id: data.product._id });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Product Not Found'}</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const isWholesale = quantity >= product.wholesaleThreshold;
  const currentPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const totalPrice = currentPrice * quantity;
  const savings = isWholesale ? (product.retailPrice - product.wholesalePrice) * quantity : 0;

  const handleAddToCart = () => {
    // Check if user is seller (sellers cannot buy)
    if (user?.role === 'seller' || user?.role === 'admin') {
      alert('Sellers and Admins cannot purchase items.');
      return;
    }

    if (isAuthenticated) {
      addToCart(product, quantity);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else {
      navigate('/login');
    }
  };

  const handleBuyNow = () => {
    // Check if user is seller
    if (user?.role === 'seller' || user?.role === 'admin') {
      alert('Sellers and Admins cannot purchase items.');
      return;
    }

    if (isAuthenticated) {
      addToCart(product, quantity);
      navigate('/cart');
    } else {
      navigate('/login');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          ✓ Added to cart successfully!
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span className="mx-2">/</span>
          <span
            className="hover:text-primary cursor-pointer"
            onClick={() => navigate('/products')}
          >
            Products
          </span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{language === 'en' ? product.name : product.namesin}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            <img
              src={product.images && product.images.length > 0 ? product.images[0] : getImage(product.name)}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'en' ? product.name : product.namesin}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''
                      }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {product.rating || 'New'} ({product.reviews || 0} reviews)
              </span>
            </div>

            {/* Seller Info */}
            <div className="flex items-center mb-6 p-4 bg-green-50 rounded-lg">
              <Store className="w-5 h-5 text-primary mr-2" />
              <div>
                <p className="text-sm text-gray-600">Sold by</p>
                <p className="font-semibold text-gray-900">{product.sellerId?.name || product.sellerName || 'Unknown Seller'}</p>
                <p className="text-sm text-primary">{product.sellerId?.location || 'Sri Lanka'}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-gray-700">
                {language === 'en' ? product.description : product.descriptionsin}
              </p>
            </div>

            {/* Pricing Section - DUAL PRICING DEMO */}
            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${!isWholesale ? 'bg-secondary/10 border-2 border-secondary' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">{t('retailPrice')}</p>
                  <p className="text-2xl font-bold text-gray-900">LKR {product.retailPrice?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">1-{product.wholesaleThreshold - 1} items</p>
                </div>
                <div className={`p-4 rounded-lg ${isWholesale ? 'bg-secondary/10 border-2 border-primary' : 'bg-gray-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">{t('wholesalePrice')}</p>
                  <p className="text-2xl font-bold text-primary">LKR {product.wholesalePrice?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{product.wholesaleThreshold}+ items</p>
                </div>
              </div>

              {/* Active Price Indicator */}
              {isWholesale && (
                <div className="flex items-center bg-accent/20 border border-accent rounded-lg p-3 mb-4">
                  <TrendingDown className="w-5 h-5 text-accent-dark mr-2" />
                  <span className="text-secondary font-semibold">
                    {t('wholesaleApplied')} - Save LKR {savings.toLocaleString()}!
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t('quantity')}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decrementQuantity}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, Math.min(val, product.stock)));
                    }}
                    className="w-20 text-center text-xl font-bold border-2 border-gray-300 rounded-lg py-2"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="flex items-center text-gray-600">
                    <Package className="w-4 h-4 mr-1" />
                    <span className="text-sm">{product.stock} in stock</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per unit:</span>
                  <span className="font-semibold text-lg">LKR {currentPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-lg">{t('total')}:</span>
                  <span className="text-3xl font-bold text-primary">LKR {totalPrice?.toLocaleString()}</span>
                </div>
                {isWholesale && (
                  <p className="text-right text-sm text-accent-dark mt-1">
                    You save LKR {savings.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center px-6 py-4 text-white rounded-lg transition font-semibold ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary hover:bg-secondary-dark'}`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : t('addToCart')}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className={`flex-1 px-6 py-4 text-white rounded-lg transition font-semibold ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
              >
                {t('buyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
