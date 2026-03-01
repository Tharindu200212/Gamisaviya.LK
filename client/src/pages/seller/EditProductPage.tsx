import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { productAPI } from '../../utils/api';
import { toast } from 'sonner';

export const EditProductPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        namesin: '',
        description: '',
        descriptionsin: '',
        category: '',
        retailPrice: '',
        wholesalePrice: '',
        wholesaleThreshold: '',
        stock: '',
    });

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await productAPI.getById(id);
                if (data.success && data.product) {
                    const p = data.product;
                    setFormData({
                        name: p.name || '',
                        namesin: p.namesin || '',
                        description: p.description || '',
                        descriptionsin: p.descriptionsin || '',
                        category: p.category || '',
                        retailPrice: p.retailPrice?.toString() || '',
                        wholesalePrice: p.wholesalePrice?.toString() || '',
                        wholesaleThreshold: p.wholesaleThreshold?.toString() || '',
                        stock: p.stock?.toString() || '',
                    });
                    if (p.images && p.images.length > 0) {
                        setImagePreview(p.images[0]);
                    }
                } else {
                    setError('Product not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFiles([file]);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        setSubmitting(true);
        setError('');

        try {
            // For updates, we usually construct a JSON unless we are changing the image
            // If imageFiles has content, we might need multipart/form-data.
            // However, the backend updateProduct usually expects JSON in this simple prototype, 
            // OR maybe it doesn't handle image updates yet. 
            // Let's assume for now we just update text fields via JSON as per productController.updateProduct logic 
            // (which uses req.body and doesn't explicitly look for req.files unless we use the 'upload' middleware on the route).

            // Checking productRoutes.js: router.put('/:id', ... updateProduct); -> It does NOT have upload.array middleware.
            // So we can only update text fields for now. 

            const updateData = {
                name: formData.name,
                namesin: formData.namesin,
                description: formData.description,
                descriptionsin: formData.descriptionsin,
                category: formData.category,
                retailPrice: Number(formData.retailPrice),
                wholesalePrice: Number(formData.wholesalePrice),
                wholesaleThreshold: Number(formData.wholesaleThreshold),
                stock: Number(formData.stock)
            };

            const result = await productAPI.update(id, updateData);

            if (result.success) {
                toast.success('Product updated successfully');
                navigate('/seller/products');
            } else {
                setError('Failed to update product');
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
                    <p className="text-gray-600">Update your product information</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Preview Only (Update not supported in this route yet) */}
                        <div className="text-center mb-6">
                            {imagePreview && (
                                <img src={imagePreview} alt="Product" className="mx-auto h-48 object-contain rounded-lg border border-gray-200" />
                            )}
                            <p className="text-xs text-gray-500 mt-2">Image updates are not supported in this version</p>
                        </div>

                        {/* Product Names */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Name (English) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Product Name (Sinhala) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.namesin}
                                    onChange={(e) => setFormData({ ...formData, namesin: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (English) *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={4}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description (Sinhala) *
                                </label>
                                <textarea
                                    required
                                    value={formData.descriptionsin}
                                    onChange={(e) => setFormData({ ...formData, descriptionsin: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    rows={4}
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">Select Category</option>
                                <option value="Grains & Rice">Grains & Rice</option>
                                <option value="Oils & Spices">Oils & Spices</option>
                                <option value="Honey & Sweeteners">Honey & Sweeteners</option>
                                <option value="Textiles & Crafts">Textiles & Crafts</option>
                                <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                            </select>
                        </div>

                        {/* Dual Pricing Section */}
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <Package className="w-6 h-6 text-green-600 mr-2" />
                                <h3 className="text-lg font-bold text-gray-900">Dual Pricing Setup</h3>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Retail Price (LKR) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.retailPrice}
                                        onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Wholesale Price (LKR) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.wholesalePrice}
                                        onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Wholesale Threshold *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.wholesaleThreshold}
                                        onChange={(e) => setFormData({ ...formData, wholesaleThreshold: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Product'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/seller/products')}
                                className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
