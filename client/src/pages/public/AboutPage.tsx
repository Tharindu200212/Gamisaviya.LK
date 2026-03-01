import React from 'react';
import { Target, Heart, Users, Globe } from 'lucide-react';
import { getImage } from '../../utils/imageMap';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About GamiSaviya.lk</h1>
          <p className="text-xl text-amber-100">
            Empowering rural Sri Lankan artisans and farmers through e-commerce
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <img src={getImage('sri lanka village')} alt="Sri Lankan Village" className="rounded-2xl shadow-xl" />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              GamiSaviya.lk is dedicated to bridging the gap between rural Sri Lankan producers and global markets. 
              We provide a platform where traditional artisans, farmers, and small-scale producers can showcase 
              their authentic products to a wider audience.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our innovative dual pricing system allows sellers to offer both retail and wholesale prices, 
              automatically adjusting based on order quantity, making it easier for both individual buyers 
              and bulk purchasers to get the best value.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Target className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Authentic Products</h3>
            <p className="text-sm text-gray-600">100% genuine handmade and locally sourced items</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Heart className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Support Local</h3>
            <p className="text-sm text-gray-600">Direct support to rural communities</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
            <p className="text-sm text-gray-600">Transparent dual pricing system</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <Globe className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Global Reach</h3>
            <p className="text-sm text-gray-600">Connecting local to global markets</p>
          </div>
        </div>
      </div>
    </div>
  );
}
