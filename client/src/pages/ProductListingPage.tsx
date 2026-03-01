import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Star, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { productAPI } from '../utils/api';
import { getImage } from '../utils/imageMap';
import { ProductPagination } from '../components/ProductPagination';

export const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

  // State for products and loading
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Products');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const categories = [
    'All Products',
    'Grains & Rice',
    'Oils & Spices',
    'Honey & Sweeteners',
    'Textiles & Crafts',
    'Pottery & Ceramics',
    'Fresh Vegetables',
    'Food Products',
    'Handicrafts'
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Build filters for API (if API supported advanced filtering directly)
        // For now, fetch all approved and filter client-side or use basic API filters
        // The API supports 'category' and 'featured' query params
        const apiFilters: any = {};
        if (selectedCategory && selectedCategory !== 'All Products' && selectedCategory !== 'all') {
          apiFilters.category = selectedCategory;
        }

        const data = await productAPI.getAll(apiFilters);

        if (data.success) {
          // Client side filtering for search and price since API might not support all complex queries yet
          let fetchedProducts = data.products.map((p: any) => ({
            ...p,
            id: p._id // Ensure ID compatibility
          }));

          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]); // Re-fetch only when category changes (as it's a server param)

  // Derived state for client-side filtering (Search, Price, Sort)
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(lowerTerm) ||
          p.namesin?.toLowerCase().includes(lowerTerm) ||
          p.description?.toLowerCase().includes(lowerTerm)
      );
    }

    // Price range filter
    if (priceRange !== 'all') {
      result = result.filter((p) => {
        if (priceRange === 'low') return p.retailPrice < 500;
        if (priceRange === 'mid') return p.retailPrice >= 500 && p.retailPrice < 1000;
        if (priceRange === 'high') return p.retailPrice >= 1000;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-low') return (a.retailPrice || 0) - (b.retailPrice || 0);
      if (sortBy === 'price-high') return (b.retailPrice || 0) - (a.retailPrice || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      // Featured/Default: We could sort by featured first, then created date
      if (sortBy === 'featured') {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      }
      return 0;
    });

    return result;
  }, [products, searchTerm, priceRange, sortBy]);

  // Update URL params when filters change
  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (selectedCategory !== 'All Products') params.category = selectedCategory;
    setSearchParams(params, { replace: true });

  }, [searchTerm, selectedCategory, setSearchParams]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'All Products' : 'සියලුම නිෂ්පාදන'}
          </h1>
          <p className="text-gray-600">
            Discover authentic products from Sri Lankan rural sellers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under LKR 500</option>
                <option value="mid">LKR 500 - 1000</option>
                <option value="high">Over LKR 1000</option>
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center text-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              <span className="font-semibold">Sort by:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'featured', label: 'Featured' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
                { value: 'rating', label: 'Highest Rated' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSortBy(option.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${sortBy === option.value
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{paginatedProducts.length}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer gami-card"
                >
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : getImage('default product')}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = getImage('default product');
                      }}
                    />
                    {product.featured && (
                      <div className="absolute top-2 right-2 bg-accent text-primary-dark font-bold text-xs px-2 py-1 rounded shadow">Featured</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                      {language === 'en' ? product.name : product.namesin || product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {product.sellerName || product.sellerId?.name || 'Seller'}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex text-accent text-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''
                              }`}
                          />
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-600">
                        ({product.reviews || 0})
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-lg font-bold text-primary">
                            LKR {product.retailPrice?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Wholesale: LKR {product.wholesalePrice?.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xs text-secondary font-semibold">
                          {product.wholesaleThreshold}+ items
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Products');
                setPriceRange('all');
              }}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
