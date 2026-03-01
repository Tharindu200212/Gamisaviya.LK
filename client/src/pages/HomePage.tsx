import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Responsive Full Width Hero Banner Section */}
      <section className="relative w-full bg-gray-900 border-b border-gray-800">
        <div className="relative w-full">
          {/* Background Image */}
          <img
            src={"/banner.png"}
            alt="Sri Lankan Marketplace Background"
            className="w-full h-[300px] md:h-auto object-cover md:max-h-[700px] shadow-md"
          />
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

      {/* Promotional Ad Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-green-600 to-amber-500">
            {/* Background Decorative Pattern/Overlay */}
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-green-300/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold tracking-wider uppercase mb-4 backdrop-blur-md shadow-sm border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-green-200 mr-2 animate-pulse"></span>
                  {language === 'en' ? 'Limited Time Offer' : 'සීමිත කාල දීමනාවක්'}
                </span>
                <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                  {language === 'en' ? 'Save 20% on Wholesale' : 'තොග මිලදී ගැනුම් මත 20%ක් ඉතිරි කරන්න'}
                </h3>
                <p className="text-green-50 text-lg md:text-xl max-w-2xl font-medium">
                  {language === 'en'
                    ? 'Stock up on premium Sri Lankan spices, organic oils, and pure honey. Direct from the village to your business.'
                    : 'සුවිශේෂී ශ්‍රී ලාංකීය කුළුබඩු, කාබනික තෙල් සහ පිරිසිදු මී පැණි මිලදී ගන්න. ගමෙන් කෙළින්ම ඔබේ ව්‍යාපාරයට.'}
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center px-8 py-4 text-green-700 bg-white hover:bg-gray-50 rounded-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  {language === 'en' ? 'Claim Offer Now' : 'දීමනාව ලබා ගන්න'}
                  <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
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
          <p className="text-xl mb-8 text-green-50">
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