import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo_nav.png" alt="Gamisaviya.LK" className="h-16 w-auto transform hover:scale-105 transition duration-300 rounded-lg" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-accent transition font-medium">
              {t('home')}
            </Link>
            <Link to="/products" className="text-white hover:text-accent transition font-medium">
              {t('products')}
            </Link>
            <Link to="/become-seller" className="text-white hover:text-accent transition font-medium">
              {t('becomeSeller')}
            </Link>
            <Link to="/about" className="text-white hover:text-accent transition font-medium">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-white hover:text-accent transition font-medium">
              {t('contact')}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-white hover:text-accent transition border border-white/30 px-2 py-1 rounded"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">{language === 'en' ? 'සිං' : 'EN'}</span>
            </button>

            {/* Cart Icon (Buyers only) */}
            {isAuthenticated && user?.role === 'buyer' && (
              <Link to="/cart" className="relative group transition text-white hover:text-accent">
                <img
                  src="/cart_icon.svg"
                  alt="Cart"
                  className="w-6 h-6 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }} // Fallback if currentColor doesn't work with img tag, but for simple white icon on dark bg this is fine
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-accent transition"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:block">{user?.name}</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-800">
                    <Link
                      to={
                        user?.role === 'admin'
                          ? '/admin/dashboard'
                          : user?.role === 'seller'
                            ? '/seller/dashboard'
                            : '/buyer/dashboard'
                      }
                      className="block px-4 py-2 hover:bg-green-50 text-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      {t('dashboard')}
                    </Link>
                    <Link
                      to={
                        user?.role === 'admin'
                          ? '/admin/profile'
                          : user?.role === 'seller'
                            ? '/seller/profile'
                            : '/buyer/profile'
                      }
                      className="block px-4 py-2 hover:bg-green-50 text-gray-700"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      {t('profile')}
                    </Link>
                    {user?.role === 'buyer' && (
                      <Link
                        to="/buyer/orders"
                        className="block px-4 py-2 hover:bg-accent/10 text-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        {t('myOrders')}
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white border border-white rounded-lg hover:bg-white/10 transition font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="hidden md:block px-4 py-2 bg-accent text-white font-bold rounded-lg hover:bg-accent-dark transition shadow-md"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-accent"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-dark bg-primary -mx-4 px-4 shadow-inner">
            <Link
              to="/"
              className="block py-2 text-white hover:text-yellow-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('home')}
            </Link>
            <Link
              to="/products"
              className="block py-2 text-white hover:text-yellow-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('products')}
            </Link>
            <Link
              to="/become-seller"
              className="block py-2 text-white hover:text-yellow-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('becomeSeller')}
            </Link>
            <Link
              to="/about"
              className="block py-2 text-white hover:text-yellow-300 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('about')}
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-white hover:text-accent font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('contact')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
