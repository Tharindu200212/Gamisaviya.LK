import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Total Products found: ${products.length}`);

        if (products.length === 0) {
            console.log('No products found in the database. creation might have failed.');
        } else {
            products.forEach(p => {
                console.log(`Product: ${p.name}`);
                console.log(`  ID: ${p._id}`);
                console.log(`  Approved: ${p.approved}`);
                console.log(`  SellerId: ${p.sellerId}`);
                console.log('-------------------');
            });
        }

        const sellers = await User.find({ role: 'seller' });
        console.log(`Total Sellers found: ${sellers.length}`);
        sellers.forEach(s => {
            console.log(`Seller: ${s.name} (${s.email})`);
            console.log(`  ID: ${s._id}`);
            console.log(`  Approved: ${s.approved}`);
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkProducts();
