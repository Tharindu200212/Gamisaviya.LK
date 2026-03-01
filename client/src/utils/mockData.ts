export interface Product {
  id: string;
  name: string;
  nameSi: string;
  description: string;
  descriptionSi: string;
  category: string;
  images: string[];
  retailPrice: number;
  wholesalePrice: number;
  wholesaleThreshold: number;
  stock: number;
  sellerId: string;
  sellerName: string;
  sellerNameSi: string;
  sellerLocation: string;
  rating: number;
  reviews: number;
  featured: boolean;
  approved: boolean;
}

export interface Seller {
  id: string;
  name: string;
  nameSi: string;
  story: string;
  storySi: string;
  location: string;
  image: string;
  productsCount: number;
  rating: number;
  joinedDate: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    priceType: 'retail' | 'wholesale';
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Basket',
    nameSi: 'අතින් වියන ලද බාස්කට්',
    description: 'Traditional handwoven basket made from natural materials by skilled artisans in Kurunegala',
    descriptionSi: 'කුරුණෑගල දක්ෂ ශිල්පීන් විසින් ස්වභාවික ද්‍රව්‍ය වලින් සාදන ලද සාම්ප්‍රදායික අතින් වියන ලද බාස්කට්',
    category: 'Handicrafts',
    images: ['basket', 'woven crafts', 'handicraft'],
    retailPrice: 1500,
    wholesalePrice: 1200,
    wholesaleThreshold: 10,
    stock: 50,
    sellerId: 's1',
    sellerName: 'Nimal Perera',
    sellerNameSi: 'නිමල් පෙරේරා',
    sellerLocation: 'Kurunegala',
    rating: 4.5,
    reviews: 23,
    featured: true,
    approved: true,
  },
  {
    id: '2',
    name: 'Organic Rice (5kg)',
    nameSi: 'කාබනික සහල් (5kg)',
    description: 'Premium organic red rice grown in the paddy fields of Anuradhapura without chemicals',
    descriptionSi: 'රසායනික ද්‍රව්‍ය රහිත අනුරාධපුර කුඹුරු වලින් වගා කරන ලද ප්‍රිමියම් කාබනික රතු සහල්',
    category: 'Agriculture',
    images: ['organic rice', 'rice grains', 'agriculture'],
    retailPrice: 850,
    wholesalePrice: 700,
    wholesaleThreshold: 20,
    stock: 200,
    sellerId: 's2',
    sellerName: 'Kamala Silva',
    sellerNameSi: 'කමලා සිල්වා',
    sellerLocation: 'Anuradhapura',
    rating: 4.8,
    reviews: 45,
    featured: true,
    approved: true,
  },
  {
    id: '3',
    name: 'Clay Pottery Set',
    nameSi: 'මැටි බඳුන් කට්ටලය',
    description: 'Beautiful handmade clay pottery set including pots, plates and cups from Kalutara',
    descriptionSi: 'කළුතර සිට බඳුන්, තැටි සහ කෝප්ප ඇතුළු අලංකාර අතින් සාදන ලද මැටි භාජන කට්ටලයක්',
    category: 'Handicrafts',
    images: ['pottery', 'ceramic pottery', 'clay crafts'],
    retailPrice: 3500,
    wholesalePrice: 3000,
    wholesaleThreshold: 5,
    stock: 30,
    sellerId: 's3',
    sellerName: 'Sunil Fernando',
    sellerNameSi: 'සුනිල් ප්‍රනාන්දු',
    sellerLocation: 'Kalutara',
    rating: 4.7,
    reviews: 18,
    featured: true,
    approved: true,
  },
  {
    id: '4',
    name: 'Coconut Oil (1L)',
    nameSi: 'පොල් තෙල් (1L)',
    description: 'Pure virgin coconut oil extracted using traditional methods in Galle',
    descriptionSi: 'ගාල්ල සම්ප්‍රදායික ක්‍රම භාවිතයෙන් නිස්සාරණය කරන ලද පිරිසිදු කොකනට් තෙල්',
    category: 'Food',
    images: ['coconut oil', 'cooking oil', 'coconut'],
    retailPrice: 950,
    wholesalePrice: 800,
    wholesaleThreshold: 12,
    stock: 100,
    sellerId: 's4',
    sellerName: 'Priyantha Jayawardena',
    sellerNameSi: 'ප්‍රියන්ත ජයවර්ධන',
    sellerLocation: 'Galle',
    rating: 4.9,
    reviews: 67,
    featured: false,
    approved: true,
  },
  {
    id: '5',
    name: 'Handloom Saree',
    nameSi: 'අතින් වියන ලද සාරිය',
    description: 'Elegant handloom cotton saree with traditional designs from Matale',
    descriptionSi: 'මාතලේ සිට සම්ප්‍රදායික මෝස්තර සහිත අලංකාර අතින් වියන ලද කපු සාරිය',
    category: 'Textiles',
    images: ['traditional textile', 'fabric weaving', 'handloom'],
    retailPrice: 8500,
    wholesalePrice: 7500,
    wholesaleThreshold: 3,
    stock: 15,
    sellerId: 's5',
    sellerName: 'Dilani Wickramasinghe',
    sellerNameSi: 'දිලානි වික්‍රමසිංහ',
    sellerLocation: 'Matale',
    rating: 4.6,
    reviews: 12,
    featured: false,
    approved: true,
  },
  {
    id: '6',
    name: 'Cashew Nuts (500g)',
    nameSi: 'කජු (500g)',
    description: 'Premium roasted cashew nuts from local farms in Puttalam',
    descriptionSi: 'පුත්තලමේ දේශීය ගොවිපලවල් වලින් ලබාගත් ප්‍රිමියම් බැදපු කජු',
    category: 'Food',
    images: ['cashew nuts', 'roasted nuts', 'snacks'],
    retailPrice: 1800,
    wholesalePrice: 1500,
    wholesaleThreshold: 10,
    stock: 80,
    sellerId: 's6',
    sellerName: 'Ranjith Kumar',
    sellerNameSi: 'රංජිත් කුමාර්',
    sellerLocation: 'Puttalam',
    rating: 4.7,
    reviews: 34,
    featured: true,
    approved: true,
  },
];

export const mockSellers: Seller[] = [
  {
    id: 's1',
    name: 'Nimal Perera',
    nameSi: 'නිමල් පෙරේරා',
    story: 'I have been crafting traditional baskets for over 20 years, learning the art from my father. Each piece tells a story of our village heritage.',
    storySi: 'මම වසර 20කට වැඩි කාලයක් සම්ප්‍රදායික බාස්කට් සාදමින් සිටිමි, මගේ පියාගෙන් කලාව ඉගෙන ගත්තෙමි. සෑම කැබැල්ලක්ම අපේ ගමේ උරුමය පිළිබඳ කතාවක් කියයි.',
    location: 'Kurunegala',
    image: 'artisan weaving',
    productsCount: 12,
    rating: 4.5,
    joinedDate: '2024-01-15',
  },
  {
    id: 's2',
    name: 'Kamala Silva',
    nameSi: 'කමලා සිල්වා',
    story: 'Our family has been farming organic rice for three generations. We believe in sustainable agriculture and preserving traditional farming methods.',
    storySi: 'අපේ පවුල පරම්පරා තුනක් තිස්සේ කාබනික සහල් වගා කරනවා. අපි විශ්වාස කරන්නේ තිරසාර කෘෂිකර්මාන්තය සහ සම්ප්‍රදායික ගොවිතැන් ක්‍රම ආරක්ෂා කිරීම ගැනයි.',
    location: 'Anuradhapura',
    image: 'rice farming',
    productsCount: 8,
    rating: 4.8,
    joinedDate: '2023-11-20',
  },
  {
    id: 's3',
    name: 'Sunil Fernando',
    nameSi: 'සුනිල් ප්‍රනාන්දු',
    story: 'Clay pottery is not just my profession, it is my passion. I create each piece with love and dedication, keeping our cultural traditions alive.',
    storySi: 'මැටි භාජන හැදීම මගේ වෘත්තිය පමණක් නොව, එය මගේ ආශාවයි. මම සෑම කැබැල්ලක්ම ආදරයෙන් හා කැපවීමෙන් නිර්මාණය කරමි, අපේ සංස්කෘතික සම්ප්‍රදායන් ජීවමානව තබමින්.',
    location: 'Kalutara',
    image: 'pottery making',
    productsCount: 15,
    rating: 4.7,
    joinedDate: '2024-03-10',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'c1',
    items: [
      {
        productId: '1',
        productName: 'Handwoven Basket',
        quantity: 12,
        price: 1200,
        priceType: 'wholesale',
      },
    ],
    total: 14400,
    status: 'delivered',
    createdAt: '2024-12-15',
    shippingAddress: '123, Main Street, Colombo 07',
  },
  {
    id: 'ORD002',
    customerId: 'c1',
    items: [
      {
        productId: '2',
        productName: 'Organic Rice (5kg)',
        quantity: 5,
        price: 850,
        priceType: 'retail',
      },
    ],
    total: 4250,
    status: 'processing',
    createdAt: '2025-01-03',
    shippingAddress: '123, Main Street, Colombo 07',
  },
];

export const categories = [
  'All',
  'Handicrafts',
  'Agriculture',
  'Food',
  'Textiles',
  'Spices',
  'Pottery',
  'Jewelry',
];
