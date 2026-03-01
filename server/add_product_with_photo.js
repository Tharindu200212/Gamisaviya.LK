
// Native fetch is available in Node 18+

const BASE_URL = 'http://localhost:5000/api';

const log = (msg, type = 'info') => {
    const symbol = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    console.log(`${symbol} ${msg}`);
};

async function addProductWithPhoto() {
    console.log('🚀 Adding Product with Photo...');

    try {
        // 1. Login as Seller
        const loginRes = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'ranjith@gamisaviya.lk', password: 'seller123' })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) {
            throw new Error(`Login failed: ${loginData.error}`);
        }

        const token = loginData.accessToken;
        log('Logged in as Seller', 'success');

        // 2. Create Product with Photo URL
        const photoUrl = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'; // Red Rice image

        const newProduct = {
            name: "Photo Test Product",
            namesin: "ඡායාරූප පරීක්ෂණ අයිතමය",
            description: "Product created to test photo URL support.",
            descriptionsin: "ඡායාරූප සහාය පරීක්ෂා කිරීම සඳහා නිර්මාණය කරන ලද නිෂ්පාදනය.",
            category: "Grains & Rice",
            retailPrice: 500,
            wholesalePrice: 450,
            wholesaleThreshold: 10,
            stock: 50,
            images: [photoUrl] // Adding the photo here
        };

        log('Sending request to create product...', 'info');

        const createRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newProduct)
        });

        const createData = await createRes.json();

        if (createData.success) {
            log('Product created successfully!', 'success');
            console.log('\n📄 Product Details:');
            console.log(`   ID: ${createData.product._id}`);
            console.log(`   Name: ${createData.product.name}`);
            console.log(`   Images: ${createData.product.images.join(', ')}`);

            if (createData.product.images.includes(photoUrl)) {
                log('Verified: Photo URL is present in the product.', 'success');
            } else {
                log('Warning: Photo URL mismatch.', 'error');
            }

        } else {
            throw new Error(`Create failed: ${createData.error}`);
        }

    } catch (error) {
        log(error.message, 'error');
    }
}

addProductWithPhoto();
