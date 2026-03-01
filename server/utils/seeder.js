import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamisaviya', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data based on mockData.ts
const users = [
  {
    email: 'admin@gamisaviya.lk',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    approved: true
  },
  {
    email: 'ranjith@gamisaviya.lk',
    password: 'seller123',
    name: 'Ranjith Silva',
    role: 'seller',
    phone: '+94 77 123 4567',
    location: 'Anuradhapura',
    story: 'I am a third-generation farmer from Anuradhapura, dedicated to preserving traditional organic farming methods. My family has been cultivating rice for over 60 years.',
    storysin: 'මම අනුරාධපුරයේ තුන්වන පරම්පරාවේ ගොවියෙකි, සම්ප්‍රදායික කාබනික ගොවිතැන් ක්‍රම සංරක්ෂණය කිරීමට කැප වී සිටිමි. මගේ පවුල වසර 60කට වැඩි කාලයක් සහල් වගා කර ඇත.',
    image: 'https://images.unsplash.com/photo-1595152452543-e5c28ce0f208?w=400',
    approved: true,
    rating: 4.8
  },
  {
    email: 'kumari@gamisaviya.lk',
    password: 'seller123',
    name: 'Kumari Perera',
    role: 'seller',
    phone: '+94 71 234 5678',
    location: 'Kurunegala',
    story: 'I started making coconut oil using my grandmother\'s traditional methods. Every bottle is made with love and care.',
    storysin: 'මම මගේ ආච්චිගේ සම්ප්‍රදායික ක්‍රම භාවිතයෙන් පොල් තෙල් සෑදීම ආරම්භ කළෙමි. සෑම බෝතලයක්ම ආදරයෙන් හා සැලකිල්ලෙන් සාදා ඇත.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    approved: true,
    rating: 4.9
  },
  {
    email: 'gamini@gamisaviya.lk',
    password: 'seller123',
    name: 'Gamini Rathnayake',
    role: 'seller',
    phone: '+94 76 345 6789',
    location: 'Matale',
    story: 'Beekeeping has been my passion for 20 years. I collect honey from wild forest hives and ensure it remains pure and natural.',
    storysin: 'වසර 20ක් තිස්සේ මී මැස්සන් පෝෂණය කිරීම මගේ ආශාවයි. මම වල වන කූඩු වලින් මී පැණි එකතු කර එය පිරිසිදු හා ස්වභාවික බව සහතික කරමි.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    approved: true,
    rating: 5.0
  },
  {
    email: 'buyer@gamisaviya.lk',
    password: 'buyer123',
    name: 'Saman Kumara',
    role: 'buyer',
    phone: '+94 71 999 8888',
    address: '123, Main Street, Colombo 07',
    approved: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = await User.create(users);

    const adminUser = createdUsers.find(u => u.role === 'admin');
    const sellerRanjith = createdUsers.find(u => u.email === 'ranjith@gamisaviya.lk');
    const sellerKumari = createdUsers.find(u => u.email === 'kumari@gamisaviya.lk');
    const sellerGamini = createdUsers.find(u => u.email === 'gamini@gamisaviya.lk');
    const buyer = createdUsers.find(u => u.role === 'buyer');

    console.log(`✅ Created ${createdUsers.length} users`);

    // Create products
    console.log('📦 Creating products...');
    const products = [
      {
        name: 'Organic Rice (Red Rice)',
        namesin: 'කාබනික සහල් (රතු සහල්)',
        description: 'Premium quality organic red rice from Anuradhapura. Rich in nutrients and cultivated using traditional farming methods.',
        descriptionsin: 'අනුරාධපුරයේ උසස් තත්ත්වයේ කාබනික රතු සහල්. පෝෂ්‍ය පදාර්ථ වලින් පොහොසත් සහ සම්ප්‍රදායික ගොවිතැන් ක්‍රම භාවිතා කර වගා කර ඇත.',
        category: 'Grains & Rice',
        retailPrice: 250,
        wholesalePrice: 200,
        wholesaleThreshold: 10,
        stock: 500,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'],
        sellerId: sellerRanjith._id,
        sellerName: sellerRanjith.name,
        sellerLocation: sellerRanjith.location,
        approved: true,
        featured: true,
        rating: 4.8,
        reviews: 124
      },
      {
        name: 'Fresh Coconut Oil',
        namesin: 'නැවුම් පොල් තෙල්',
        description: 'Pure virgin coconut oil extracted from fresh coconuts. Cold-pressed to retain natural nutrients.',
        descriptionsin: 'නැවුම් පොල් වලින් නිස්සාරණය කරන ලද පිරිසිදු පොල් තෙල්. ස්වාභාවික පෝෂ්‍ය පදාර්ථ රඳවා තබා ගැනීම සඳහා සීතල-පීඩනය කර ඇත.',
        category: 'Oils & Spices',
        retailPrice: 800,
        wholesalePrice: 650,
        wholesaleThreshold: 5,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'],
        sellerId: sellerKumari._id,
        sellerName: sellerKumari.name,
        sellerLocation: sellerKumari.location,
        approved: true,
        featured: true,
        rating: 4.9,
        reviews: 89
      },
      {
        name: 'Natural Honey',
        namesin: 'ස්වාභාවික මී පැණි',
        description: 'Raw natural honey from forest beehives. No additives or preservatives.',
        descriptionsin: 'වන මී මැස්සන්ගේ වල මී පැණි. කිසිදු ආකාරයක ආකලන හෝ කල් තබා ගන්නා ද්‍රව්‍ය නැත.',
        category: 'Honey & Sweeteners',
        retailPrice: 1200,
        wholesalePrice: 1000,
        wholesaleThreshold: 3,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=800'],
        sellerId: sellerGamini._id,
        sellerName: sellerGamini.name,
        sellerLocation: sellerGamini.location,
        approved: true,
        featured: true,
        rating: 5.0,
        reviews: 156
      },
      {
        name: 'Ceylon Cinnamon Sticks',
        namesin: 'ලංකා කුරුඳු',
        description: 'Authentic Ceylon cinnamon from the hills of Sri Lanka. Premium grade quality.',
        descriptionsin: 'ශ්‍රී ලංකාවේ කඳුකරයේ සිට අව්‍යාජ ලංකා කුරුඳු. ප්‍රිමියම් ශ්‍රේණියේ ගුණාත්මකභාවය.',
        category: 'Oils & Spices',
        retailPrice: 450,
        wholesalePrice: 350,
        wholesaleThreshold: 10,
        stock: 400,
        images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=800'],
        sellerId: sellerRanjith._id,
        sellerName: sellerRanjith.name,
        sellerLocation: sellerRanjith.location,
        approved: true,
        rating: 4.7,
        reviews: 98
      },
      {
        name: 'Handloom Cotton Fabric',
        namesin: 'අත්වැසුම් කපු රෙදි',
        description: 'Traditional handloom cotton fabric woven by village artisans. Available in various colors.',
        descriptionsin: 'ගම්මාන ශිල්පීන් විසින් වියන ලද සම්ප්‍රදායික අත්වැසුම් කපු රෙදි. විවිධ වර්ණවලින් ලබා ගත හැක.',
        category: 'Textiles & Crafts',
        retailPrice: 600,
        wholesalePrice: 450,
        wholesaleThreshold: 8,
        stock: 300,
        images: ['https://images.unsplash.com/photo-1567696153798-cd5ca204a84a?w=800'],
        sellerId: sellerRanjith._id,
        sellerName: sellerRanjith.name,
        sellerLocation: sellerRanjith.location,
        approved: true,
        rating: 4.6,
        reviews: 67
      },
      {
        name: 'Clay Water Pot',
        namesin: 'මැටි වතුර බඳුන',
        description: 'Traditional handmade clay water pot. Keeps water naturally cool and adds minerals.',
        descriptionsin: 'සම්ප්‍රදායික අතින් සාදන ලද මැටි වතුර බඳුන. ස්වභාවිකව වතුර සිසිල් කර ඛනිජ එක් කරයි.',
        category: 'Pottery & Ceramics',
        retailPrice: 900,
        wholesalePrice: 700,
        wholesaleThreshold: 5,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800'],
        sellerId: sellerKumari._id,
        sellerName: sellerKumari.name,
        sellerLocation: sellerKumari.location,
        approved: true,
        rating: 4.5,
        reviews: 43
      }
    ];

    const createdProducts = await Product.create(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create sample orders
    console.log('🛍️  Creating sample orders...');
    const orders = [
      {
        buyerId: buyer._id,
        buyerName: buyer.name,
        items: [
          {
            productId: createdProducts[0]._id,
            productName: createdProducts[0].name,
            quantity: 15,
            pricePerUnit: 200,
            total: 3000
          }
        ],
        totalAmount: 3000,
        status: 'delivered',
        shippingAddress: '123, Main Street, Colombo 07',
        paymentMethod: 'Cash on Delivery',
        sellerIds: [sellerRanjith._id]
      },
      {
        buyerId: buyer._id,
        buyerName: buyer.name,
        items: [
          {
            productId: createdProducts[1]._id,
            productName: createdProducts[1].name,
            quantity: 3,
            pricePerUnit: 800,
            total: 2400
          }
        ],
        totalAmount: 2400,
        status: 'processing',
        shippingAddress: '123, Main Street, Colombo 07',
        paymentMethod: 'Bank Transfer',
        sellerIds: [sellerKumari._id]
      }
    ];

    const createdOrders = await Order.create(orders);
    console.log(`✅ Created ${createdOrders.length} orders`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin:');
    console.log('   Email: admin@gamisaviya.lk');
    console.log('   Password: admin123\n');
    console.log('👨‍💼 Sellers:');
    console.log('   Email: ranjith@gamisaviya.lk | Password: seller123');
    console.log('   Email: kumari@gamisaviya.lk  | Password: seller123');
    console.log('   Email: gamini@gamisaviya.lk  | Password: seller123\n');
    console.log('🛒 Buyer:');
    console.log('   Email: buyer@gamisaviya.lk');
    console.log('   Password: buyer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
