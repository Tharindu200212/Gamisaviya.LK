import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="Gamisaviya.LK" className="h-28 w-auto opacity-90" />
            </div>
            <p className="text-gray-400 mb-4">
              Connecting rural Sri Lankan sellers with buyers nationwide
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-amber-600 transition">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-400 transition">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Sellers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-seller" className="text-gray-400 hover:text-amber-400 transition">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-amber-400 transition">
                  Seller Login
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                  Seller Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-gray-400">
                <Mail className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>info@gamisaviya.lk</span>
              </li>
              <li className="flex items-start text-gray-400">
                <Phone className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </li>
              <li className="flex items-start text-gray-400">
                <MapPin className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                <span>123 Main Street<br />Colombo 07, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Gamisaviya.LK. All rights reserved.</p>
          <p className="text-sm mt-2">
            Empowering rural communities through digital commerce
          </p>
        </div>
      </div>
    </footer>
  );
};
