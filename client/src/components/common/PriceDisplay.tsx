import React from 'react';
import { Tag, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface PriceDisplayProps {
  quantity: number;
  retailPrice: number;
  wholesalePrice: number;
  wholesaleThreshold: number;
  showDetails?: boolean;
}

export function PriceDisplay({ 
  quantity, 
  retailPrice, 
  wholesalePrice, 
  wholesaleThreshold,
  showDetails = true 
}: PriceDisplayProps) {
  const { t } = useLanguage();
  
  const isWholesale = quantity >= wholesaleThreshold;
  const currentPrice = isWholesale ? wholesalePrice : retailPrice;
  const totalPrice = currentPrice * quantity;
  const savings = isWholesale ? (retailPrice - wholesalePrice) * quantity : 0;

  return (
    <div className="space-y-3">
      {/* Price Type Indicator */}
      {isWholesale && (
        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-800">{t('wholesaleApplied')}</span>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">
              {isWholesale ? t('wholesalePrice') : t('retailPrice')}
            </span>
          </div>
          <span className="font-semibold text-gray-900">
            LKR {currentPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">{t('quantity')}</span>
          <span className="font-medium text-gray-900">× {quantity}</span>
        </div>

        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-amber-700">
              LKR {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {savings > 0 && (
          <div className="bg-green-100 text-green-800 rounded-lg p-2 text-sm text-center font-medium">
            You save LKR {savings.toLocaleString()} with wholesale pricing!
          </div>
        )}
      </div>

      {/* Pricing Details */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">{t('retailPrice')}</div>
            <div className="text-lg font-bold text-blue-900">
              LKR {retailPrice.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              1-{wholesaleThreshold - 1} items
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-xs text-amber-600 font-medium mb-1">{t('wholesalePrice')}</div>
            <div className="text-lg font-bold text-amber-900">
              LKR {wholesalePrice.toLocaleString()}
            </div>
            <div className="text-xs text-amber-600 mt-1">
              {wholesaleThreshold}+ items
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
