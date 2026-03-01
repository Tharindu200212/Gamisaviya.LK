
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const testCreate = async () => {
    try {
        console.log('Connecting...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);

        // Find a seller to assign
        const seller = await User.findOne({ role: 'seller' });
        if (!seller) throw new Error('No seller found');

        console.log('Creating test product for seller:', seller.name);

        const p = await Product.create({
            name: 'DEBUG_PRODUCT_' + Date.now(),
            description: 'Test',
            category: 'Test',
            retailPrice: 100,
            wholesalePrice: 80,
            wholesaleThreshold: 10,
            stock: 100,
            sellerId: seller._id,
            sellerName: seller.name,
            sellerLocation: 'Test Loc',
            approved: false // Explicitly false!
        });

        console.log('Created:', p._id, 'Approved:', p.approved);

        const check = await Product.findById(p._id);
        console.log('Re-fetched:', check._id, 'Approved:', check.approved);

        // Verify latest again
        const latest = await Product.findOne().sort({ createdAt: -1 });
        console.log('Latest in DB:', latest.name);

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

testCreate();
