import React from 'react';
import { Heart, Users, Target, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About GamiSaviya.lk</h1>
          <p className="text-xl text-amber-50">
            Empowering rural Sri Lankan sellers to reach customers nationwide
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-4">
              GamiSaviya.lk is dedicated to bridging the gap between rural Sri Lankan artisans,
              farmers, and craftspeople with buyers across the country.
            </p>
            <p className="text-lg text-gray-700">
              We believe in preserving traditional craftsmanship while providing sustainable
              income opportunities for rural communities through digital commerce.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600"
            alt="Sri Lankan village"
            className="rounded-2xl shadow-xl"
          />
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Authenticity</h3>
            <p className="text-gray-600">100% genuine products from verified sellers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Community</h3>
            <p className="text-gray-600">Supporting rural livelihoods</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Quality</h3>
            <p className="text-gray-600">Carefully curated products</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Trust</h3>
            <p className="text-gray-600">Secure and reliable platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};
