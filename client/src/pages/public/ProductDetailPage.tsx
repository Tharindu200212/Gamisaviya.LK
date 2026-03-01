import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, MapPin, Package, Minus, Plus, ShoppingCart, User } from 'lucide-react';
import { mockProducts } from '../../utils/mockData';
import { getImage } from '../../utils/imageMap';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-amber-700 hover:text-amber-800">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const name = language === 'si' ? product.nameSi : product.name;
  const description = language === 'si' ? product.descriptionSi : product.description;
  const sellerName = language === 'si' ? product.sellerNameSi : product.sellerName;

  const handleAddToCart = () => {
    if (!user || user.role !== 'buyer') {
      navigate('/login?role=buyer');
      return;
    }

    addToCart({
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      image: product.images[0],
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      wholesaleThreshold: product.wholesaleThreshold,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
    }, quantity);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  };

  const isWholesale = quantity >= product.wholesaleThreshold;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            Added to cart successfully!
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-amber-700">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-lg p-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4 border border-gray-200">
              <img
                src={getImage(product.images[0])}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border-2 border-amber-200 cursor-pointer hover:border-amber-500 transition-colors">
                  <img
                    src={getImage(img)}
                    alt={`${name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{name}</h1>
              <p className="text-gray-600">{description}</p>
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center space-x-4 border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">({product.reviews} reviews)</span>
            </div>

            {/* Seller Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{sellerName}</div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {product.sellerLocation}
                    </div>
                  </div>
                </div>
                <Link
                  to={`/seller/${product.sellerId}`}
                  className="text-amber-700 hover:text-amber-800 text-sm font-medium"
                >
                  View Shop
                </Link>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 text-sm">
              <Package className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-900">{t('quantity')}</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantity(Math.min(Math.max(1, val), product.stock));
                    }}
                    className="w-20 text-center font-semibold text-lg border-none focus:outline-none"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {isWholesale && (
                    <span className="text-green-600 font-medium">
                      ✓ Wholesale pricing active
                    </span>
                  )}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Order {product.wholesaleThreshold} or more items to get wholesale pricing
              </p>
            </div>

            {/* Price Display - Core Dual Pricing Feature */}
            <PriceDisplay
              quantity={quantity}
              retailPrice={product.retailPrice}
              wholesalePrice={product.wholesalePrice}
              wholesaleThreshold={product.wholesaleThreshold}
              showDetails={true}
            />

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold">{t('addToCart')}</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl font-semibold"
              >
                {t('buyNow')}
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">Product Information</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex">
              <span className="w-40 font-semibold">Category:</span>
              <span>{product.category}</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold">Retail Price:</span>
              <span>LKR {product.retailPrice.toLocaleString()}</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold">Wholesale Price:</span>
              <span>LKR {product.wholesalePrice.toLocaleString()} (min {product.wholesaleThreshold} items)</span>
            </div>
            <div className="flex">
              <span className="w-40 font-semibold">Savings:</span>
              <span className="text-green-600 font-semibold">
                LKR {(product.retailPrice - product.wholesalePrice).toLocaleString()} per item
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
