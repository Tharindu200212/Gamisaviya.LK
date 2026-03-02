import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
// Use the centralized productAPI if available or mock directly here.
import { productAPI } from '../utils/api';

export const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                // We'll fetch all products and filter locally for prototype simplicity
                // In a real app, this should be a backend search endpoint
                const response = await productAPI.getAll();
                const productsList = response.success ? response.products : [];

                const filtered = productsList.filter((product: any) => {
                    const searchTerm = query.toLowerCase();
                    return (
                        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
                        (product.namesin && product.namesin.includes(searchTerm)) ||
                        (product.description && product.description.toLowerCase().includes(searchTerm)) ||
                        (product.category && product.category.toLowerCase().includes(searchTerm))
                    );
                });

                setResults(filtered);
            } catch (error) {
                console.error('Failed to fetch search results', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-green-50/30 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Search className="h-8 w-8 text-amber-600" />
                        Search Results for "{query}"
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Found {results.length} {results.length === 1 ? 'product' : 'products'} matching your search.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {results.map((product) => {
                            const imageSrc = product.images && product.images.length > 0
                                ? (product.images[0].startsWith('http') ? product.images[0] : `/products/${product.images[0].split('/').pop()}`)
                                : '/placeholder.png';

                            return (
                                <Link to={`/product/${product._id || product.id}`} key={product._id || product.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                    <div className="relative h-48 overflow-hidden bg-gray-100">
                                        <img
                                            src={imageSrc}
                                            alt={product.name}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400';
                                            }}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="text-xs font-bold text-amber-600 mb-1">{product.category}</div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                        {product.namesin && <p className="text-sm text-gray-500 mb-2 font-sinhala">{product.namesin}</p>}
                                        <div className="mt-auto pt-4 flex items-center justify-between">
                                            <span className="text-lg font-bold text-green-700">Rs. {product.retailPrice ? product.retailPrice.toLocaleString() : 0}</span>
                                            <button className="hidden sm:flex bg-green-100 p-2 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
                                                <ShoppingBag className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                        <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 text-amber-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                        <p className="text-gray-600 mb-6">We couldn't find anything matching "{query}". Try different keywords or browse our categories.</p>
                        <Link to="/products" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors">
                            Browse All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
