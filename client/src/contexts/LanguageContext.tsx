import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'si';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    products: 'Products',
    search: 'Search',
    becomeSeller: 'Become a Seller',
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    cart: 'Cart',
    profile: 'Profile',
    dashboard: 'Dashboard',
    myOrders: 'My Orders',
    settings: 'Settings',
    about: 'About Us',
    contact: 'Contact Us',
    featured: 'Featured Products',
    categories: 'Categories',
    meetTheMaker: 'Meet the Maker',
    retailPrice: 'Retail Price',
    wholesalePrice: 'Wholesale Price',
    wholesaleApplied: 'Wholesale price applied',
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    quantity: 'Quantity',
    total: 'Total',
    checkout: 'Checkout',
    continueToPayment: 'Continue to Payment',
    placeOrder: 'Place Order',
    orderConfirmed: 'Order Confirmed!',
    viewOrder: 'View Order',
    continueShopping: 'Continue Shopping',
  },
  si: {
    home: 'මුල් පිටුව',
    products: 'නිෂ්පාදන',
    search: 'සොයන්න',
    becomeSeller: 'විකුණුම්කරුවෙකු වන්න',
    login: 'ඇතුල් වන්න',
    logout: 'පිටවන්න',
    register: 'ලියාපදිංචි වන්න',
    cart: 'කරත්තය',
    profile: 'පැතිකඩ',
    dashboard: 'උපකරණ පුවරුව',
    myOrders: 'මගේ ඇණවුම්',
    settings: 'සැකසුම්',
    about: 'අප ගැන',
    contact: 'අප අමතන්න',
    featured: 'විශේෂ නිෂ්පාදන',
    categories: 'කාණ්ඩ',
    meetTheMaker: 'නිර්මාතෘ හමුවන්න',
    retailPrice: 'සිල්ලර මිල',
    wholesalePrice: 'තොග මිල',
    wholesaleApplied: 'තොග මිල යොදා ඇත',
    addToCart: 'කරත්තයට එක් කරන්න',
    buyNow: 'දැන් මිලදී ගන්න',
    quantity: 'ප්‍රමාණය',
    total: 'එකතුව',
    checkout: 'ගෙවීම',
    continueToPayment: 'ගෙවීමට යන්න',
    placeOrder: 'ඇණවුම තබන්න',
    orderConfirmed: 'ඇණවුම තහවුරු විය!',
    viewOrder: 'ඇණවුම බලන්න',
    continueShopping: 'සාප්පු සවාරිය දිගටම කරගෙන යන්න',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('gamisaviya_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'si')) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'si' : 'en';
    setLanguage(newLang);
    localStorage.setItem('gamisaviya_language', newLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
