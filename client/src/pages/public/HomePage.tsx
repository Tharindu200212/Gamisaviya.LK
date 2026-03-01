import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Users, Shield, Truck, Loader2 } from 'lucide-react';
import { productAPI, sellerAPI } from '../../utils/api';
import { ProductCard } from '../../components/common/ProductCard';
import { getImage } from '../../utils/imageMap';
import { useLanguage } from '../../contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, sellersData] = await Promise.all([
          productAPI.getAll({ featured: true }),
          sellerAPI.getAll()
        ]);

        if (productsData.success) {
          setFeaturedProducts(productsData.products.slice(0, 6));
        }

        if (sellersData.success) {
          // Filter sellers to show only approved ones and maybe limit to 3
          // If the API returns a 'sellers' array
          const sellers = (sellersData.sellers || [])
            .filter((s: any) => s.approved) // Ensure we only show approved sellers
            .slice(0, 3);
          setTopSellers(sellers);
        }
      } catch (error) {
        console.error('Failed to load home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl text-gray-600">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {t('shopNow')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/become-seller"
                  className="inline-flex items-center px-8 py-4 bg-white text-amber-700 border-2 border-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  {t('becomeSeller')}
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src={getImage('marketplace shopping')}
                alt="Sri Lankan Marketplace"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Quality Assured</h3>
              <p className="text-sm text-gray-600">All products verified by our team</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Island-wide Delivery</h3>
              <p className="text-sm text-gray-600">Fast shipping across Sri Lanka</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Support Local</h3>
              <p className="text-sm text-gray-600">Directly from village artisans</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-700 rounded-full mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-semibold mb-2">Wholesale Pricing</h3>
              <p className="text-sm text-gray-600">Save more on bulk orders</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('featuredProducts')}</h2>
            <Link
              to="/products"
              className="text-amber-700 hover:text-amber-800 font-medium flex items-center"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={{ ...product, id: product._id }} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                No featured products available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Meet the Makers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('meetTheMakers')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the talented artisans and farmers who craft these beautiful products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topSellers.length > 0 ? (
              topSellers.map(seller => (
                <div
                  key={seller._id}
                  className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={seller.image ? seller.image : getImage('default user')}
                      alt={seller.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2">{seller.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{seller.location}</p>
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">{seller.story || 'No story shared yet.'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{seller.productCount || 0} Products</span>
                      <div className="flex items-center">
                        <span className="text-amber-600 font-medium">★ {seller.rating || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                Meet our sellers soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-amber-700 to-orange-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Selling?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Join our community of rural artisans and farmers. Share your products with the world.
          </p>
          <Link
            to="/become-seller"
            className="inline-flex items-center px-8 py-4 bg-white text-amber-700 rounded-lg hover:bg-amber-50 transition-colors shadow-lg text-lg font-semibold"
          >
            Become a Seller Today
            <ArrowRight className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
