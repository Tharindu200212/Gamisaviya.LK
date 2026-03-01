import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../hooks/useProducts';
import { mockSellers } from '../data/mockData';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { products } = useProducts({ featured: true });
  const featuredProducts = products.slice(0, 3);

  const categories = [
    { name: 'Grains & Rice', namesin: 'ධාන්‍ය සහ සහල්', image: '/categories/basket_grains.png', count: 45 },
    { name: 'Oils & Spices', namesin: 'තෙල් සහ කුළුබඩු', image: '/categories/basket_oils.png', count: 32 },
    { name: 'Honey & Sweeteners', namesin: 'මී පැණි සහ මිහිරි ද්‍රව්‍ය', image: '/categories/basket_honey.png', count: 18 },
    { name: 'Textiles & Crafts', namesin: 'රෙදිපිළි සහ ශිල්ප', image: '/categories/basket_textiles.png', count: 27 },
    { name: 'Pottery & Ceramics', namesin: 'මැටි භාණ්ඩ', image: '/categories/basket_pottery.png', count: 15 },
    { name: 'Fresh Vegetables', namesin: 'නැවුම් එළවළු', image: '/categories/basket_vegetables.png', count: 56 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-hero-gradient text-white py-28 md:py-48">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {language === 'en'
                  ? 'Connecting Rural Sri Lanka to the World'
                  : 'ග්‍රාමීය ශ්‍රී ලංකාව ලෝකයට සම්බන්ධ කිරීම'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-amber-50">
                {language === 'en'
                  ? 'Discover authentic products from Sri Lankan village artisans and farmers'
                  : 'ශ්‍රී ලංකික ගම්මාන ශිල්පීන් සහ ගොවීන්ගෙන් අව්‍යාජ නිෂ්පාදන සොයා ගන්න'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-lg hover:bg-white/90 transition font-semibold"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Shop Now' : 'දැන් සාප්පු ස���ාරි'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/become-seller"
                  className="inline-flex items-center px-8 py-4 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition font-semibold"
                >
                  <Users className="w-5 h-5 mr-2" />
                  {t('becomeSeller')}
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/hero_banner.jpg"
                alt="Sri Lankan village artisans"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="text-gray-600 mt-2">
                {language === 'en' ? 'Products' : 'නිෂ්පාදන'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">150+</div>
              <div className="text-gray-600 mt-2">
                {language === 'en' ? 'Sellers' : 'විකුණුම්කරුවන්'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1000+</div>
              <div className="text-gray-600 mt-2">
                {language === 'en' ? 'Happy Buyers' : 'සතුටු ගැනුම්කරුවන්'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">25</div>
              <div className="text-gray-600 mt-2">
                {language === 'en' ? 'Districts' : 'දිස්ත්‍රික්ක'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('categories')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-xl transition border border-gray-100 hover:border-primary/30 group"
              >
                <div className="aspect-[16/11] w-full bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500 drop-shadow-sm"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition">
                    {language === 'en' ? category.name : category.namesin}
                  </h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('featured')}
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-primary-dark font-semibold flex items-center"
            >
              {language === 'en' ? 'View All' : 'සියල්ල බලන්න'}
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition gami-card"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {language === 'en' ? product.name : product.namesin}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {language === 'en' ? product.description : product.descriptionsin}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        LKR {product.retailPrice}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'en' ? 'Wholesale' : 'තොග'}: LKR {product.wholesalePrice}
                      </p>
                    </div>
                    <div className="text-yellow-500 flex items-center">
                      <span className="text-lg">⭐</span>
                      <span className="ml-1 font-semibold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Maker Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {t('meetTheMaker')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {mockSellers.slice(0, 3).map((seller) => (
              <div
                key={seller.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={seller.image}
                    alt={seller.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{seller.name}</h3>
                  <p className="text-secondary font-semibold mb-3">{seller.location}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {language === 'en' ? seller.story : seller.storysin}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-yellow-500 flex items-center">
                      <span className="text-lg">⭐</span>
                      <span className="ml-1 font-semibold">{seller.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{seller.products} products</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-cta-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'en' ? 'Ready to Start Selling?' : 'විකිණීම ආරම්භ කිරීමට සූදානම්ද?'}
          </h2>
          <p className="text-xl mb-8 text-amber-50">
            {language === 'en'
              ? 'Join our community of rural sellers and reach customers across Sri Lanka'
              : 'අපගේ ග්‍රාමීය විකුණුම්කරුවන්ගේ ප්‍රජාවට එක්වී ශ්‍රී ලංකාව පුරා ගනුදෙනුකරුවන් වෙත ළඟා වන්න'}
          </p>
          <Link
            to="/become-seller"
            className="inline-flex items-center px-8 py-4 bg-white text-secondary rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
          >
            {t('becomeSeller')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};