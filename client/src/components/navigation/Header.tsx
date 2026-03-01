import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

export function Header() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'si' : 'en');
  };

  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-green-900 to-amber-900 border-b border-green-800 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-green-100 rounded-lg flex items-center justify-center shadow-inner">
              <span className="text-green-900 font-extrabold text-xl">GS</span>
            </div>
            <span className="text-xl font-bold text-white tracking-wide">GamiSaviya.lk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-green-50 hover:text-green-300 font-medium transition-colors">
              {t('home')}
            </Link>
            <Link to="/products" className="text-green-50 hover:text-green-300 font-medium transition-colors">
              {t('products')}
            </Link>
            <Link to="/become-seller" className="text-green-50 hover:text-green-300 font-medium transition-colors">
              {t('becomeSeller')}
            </Link>
            <Link to="/about" className="text-green-50 hover:text-green-300 font-medium transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-green-50 hover:text-green-300 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-green-50 hover:bg-white/10 transition-colors"
              title="Switch Language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{language === 'en' ? 'සිං' : 'EN'}</span>
            </button>

            {/* Cart (Buyers only) */}
            {user?.role === 'buyer' && (
              <Link
                to="/cart"
                className="relative p-2 text-green-50 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-green-50 hover:bg-white/10 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <Link
                      to={user.role === 'buyer' ? '/buyer/dashboard' : user.role === 'seller' ? '/seller/dashboard' : '/admin/dashboard'}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('dashboard')}
                    </Link>
                    <Link
                      to={`/${user.role}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      {t('profile')}
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-amber-100 text-green-900 font-bold rounded-lg hover:bg-white transition-colors shadow-md"
              >
                {t('login')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-green-50 hover:bg-white/10 rounded-lg"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('home')}
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('products')}
              </Link>
              <Link
                to="/become-seller"
                className="text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                {t('becomeSeller')}
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
