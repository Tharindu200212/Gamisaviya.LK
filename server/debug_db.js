
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const checkProducts = async () => {
    try {
        console.log('Connecting to MongoDB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB.');

        const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        console.log(`\n--- LATEST 5 PRODUCTS ---`);
        for (const p of products) {
            const seller = await User.findById(p.sellerId);
            console.log({
                productStart: p.name.substring(0, 15),
                isApproved: p.approved,
                sellerId: p.sellerId,
                sellerName: seller ? seller.name : 'UNKNOWN',
                sellerRole: seller ? seller.role : 'UNKNOWN',
                sellerApproved: seller ? seller.approved : 'UNKNOWN'
            });
        }

        console.log('\n--- USER STATISTICS ---');
        const roleStats = await User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);
        console.log(roleStats);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProducts();
