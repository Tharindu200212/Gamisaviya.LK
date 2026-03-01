import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const BecomeSellerPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    story: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        'seller',
        {
          phone: formData.phone,
          location: formData.location,
          story: formData.story,
          storysin: '',
        }
      );
      
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || 'Application failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Application failed. Please try again.');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your interest in becoming a seller on GamiSaviya.lk
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <p className="text-gray-700 mb-6">
              Our team will review your application and get back to you within 2-3 business days.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Store className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Seller</h1>
          <p className="text-xl text-amber-50">
            Join hundreds of rural sellers and grow your business online
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <TrendingUp className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Reach More Customers</h3>
            <p className="text-gray-600">
              Access buyers from all districts of Sri Lanka through our platform
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <Store className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Easy to Use</h3>
            <p className="text-gray-600">
              Simple dashboard to manage products, orders, and your seller profile
            </p>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-md text-center">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Support & Training</h3>
            <p className="text-gray-600">
              Get help from our team to succeed in online selling
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Application</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location (Village/City) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Story *
              </label>
              <textarea
                required
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                rows={4}
                placeholder="Tell us about your products and business..."
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-semibold text-lg"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};