import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { productAPI } from '../../utils/api';
import { getImage } from '../../utils/imageMap';

export const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get product ID if editing
  const isEditing = !!id;

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

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

  // Fetch product data if editing
  useEffect(() => {
    if (isEditing && id) {
      const fetchProduct = async () => {
        try {
          setFetching(true);
          const data = await productAPI.getById(id);
          if (data.success) {
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
            setError('Failed to fetch product details');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to load product for editing');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [isEditing, id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFiles([file]);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key as keyof typeof formData]);
      });

      // Only append images if new ones are selected
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      let result;
      if (isEditing && id) {
        result = await productAPI.update(id, data);
      } else {
        result = await productAPI.create(data);
      }

      if (!result.success) {
        throw new Error(result.error || 'Operation failed');
      }

      setSuccessMessage(result.message || (isEditing ? 'Product updated successfully' : 'Product submitted successfully'));
      setSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{isEditing ? 'Product Updated!' : 'Product Submitted!'}</h1>
          <p className="text-xl text-gray-600 mb-8">
            {successMessage}
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-gray-700 mb-6">
              {isEditing ? 'Your changes have been saved.' : 'Our team will review your product and notify you once it\'s approved.'}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/seller/products')}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                View My Products
              </button>
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-gray-600">{isEditing ? 'Update your product details' : 'List a new product for sale on GamiSaviya.lk'}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Images
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-400 transition cursor-pointer relative"
                onClick={() => document.getElementById('imageInput')?.click()}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-48 object-contain"
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = getImage('default product');
                    }}
                  />
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">Click to upload product images</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input
                  type="file"
                  id="imageInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Organic Rice"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., කාබනික සහල්"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Category</option>
                <option value="Grains & Rice">Grains & Rice</option>
                <option value="Oils & Spices">Oils & Spices</option>
                <option value="Honey & Sweeteners">Honey & Sweeteners</option>
                <option value="Textiles & Crafts">Textiles & Crafts</option>
                <option value="Pottery & Ceramics">Pottery & Ceramics</option>
                <option value="Fresh Vegetables">Fresh Vegetables</option>
                <option value="Food Products">Food Products</option>
                <option value="Handicrafts">Handicrafts</option>
              </select>
            </div>

            {/* Dual Pricing Section */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-amber-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">Dual Pricing Setup</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Set different prices for retail and wholesale purchases
              </p>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="250"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="200"
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
                    onChange={(e) =>
                      setFormData({ ...formData, wholesaleThreshold: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                    placeholder="10"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Wholesale price will automatically apply when quantity reaches the threshold
              </p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                placeholder="100"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold flex items-center justify-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isEditing ? 'Save Changes' : 'Submit for Approval')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/seller/dashboard')}
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
