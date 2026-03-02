import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Tag } from 'lucide-react';
import { Product } from '../../types';
import { getImage } from '../../utils/imageMap';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();

  const name = language === 'si' && product.namesin ? product.namesin : product.name;
  const sellerName = product.sellerName;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={getImage(product.images[0])}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.featured && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
          {name}
        </h3>

        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{product.sellerLocation}</span>
          <span className="mx-1">•</span>
          <span className="text-gray-500">{sellerName}</span>
        </div>

        <div className="flex items-center space-x-1 mb-3">
          <Star className="w-4 h-4 fill-green-400 text-green-400" />
          <span className="text-sm font-medium text-gray-900">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                <Tag className="w-3 h-3" />
                <span>{t('retailPrice')}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">
                LKR {product.retailPrice.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600 font-medium mb-1">
                {t('wholesalePrice')}
              </div>
              <div className="text-sm font-semibold text-green-700">
                LKR {product.wholesalePrice.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                (min {product.wholesaleThreshold})
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
