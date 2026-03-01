
// Native fetch is available in Node 18+
// If node-fetch is not installed, we might need to rely on global fetch or install it.
// Let's try to usage global fetch first, if that fails we can install node-fetch.
// Actually, I'll essentially write a script that checks for global fetch.

const BASE_URL = 'http://localhost:5000/api';

const log = (msg, type = 'info') => {
    const symbol = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
    console.log(`${symbol} ${msg}`);
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
    console.log('🚀 Starting Automated CRUD Tests...');

    // 1. Health Check with Retry (max 30s)
    let serverReady = false;
    for (let i = 0; i < 15; i++) {
        try {
            const health = await fetch('http://localhost:5000/health');
            if (health.ok) {
                log('Health check passed', 'success');
                serverReady = true;
                break;
            }
        } catch (e) {
            log(`Waiting for server... (${i + 1}/15)`);
            await sleep(2000);
        }
    }

    if (!serverReady) {
        log('Server is not running or health check failed after 30s.', 'error');
        process.exit(1);
    }

    let adminToken, sellerToken, buyerToken;
    let createdProductId, createdOrderId;

    // 2. Authentication
    try {
        // Admin Login
        const adminRes = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@gamisaviya.lk', password: 'admin123' })
        });
        const adminData = await adminRes.json();
        if (adminData.success) {
            adminToken = adminData.accessToken;
            log('Admin Login successful', 'success');
        } else {
            throw new Error('Admin Login failed');
        }

        // Seller Login
        const sellerRes = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'ranjith@gamisaviya.lk', password: 'seller123' })
        });
        const sellerData = await sellerRes.json();
        if (sellerData.success) {
            sellerToken = sellerData.accessToken;
            log('Seller Login successful', 'success');
        } else {
            throw new Error('Seller Login failed');
        }

        // Buyer Login
        const buyerRes = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'buyer@gamisaviya.lk', password: 'buyer123' })
        });
        const buyerData = await buyerRes.json();
        if (buyerData.success) {
            buyerToken = buyerData.accessToken;
            log('Buyer Login successful', 'success');
        } else {
            throw new Error('Buyer Login failed');
        }

    } catch (e) {
        log(`Auth Error: ${e.message}`, 'error');
        return;
    }

    // 3. Product CRUD (Seller)
    try {
        // Create Product
        const newProduct = {
            name: "Automated Test Product",
            namesin: "ස්වයංක්‍රිය පරීක්ෂණ අයිතමය",
            description: "This is a test product created by automation script.",
            descriptionsin: "මෙය ස්වයංක්‍රියකරණ ස්ක්‍රිප්ට් මගින් සාදන ලද පරීක්ෂණ නිෂ්පාදනයකි.",
            category: "Grains & Rice",
            retailPrice: 1000,
            wholesalePrice: 800,
            wholesaleThreshold: 5,
            stock: 100,
            images: ["https://placehold.co/600x400"]
        };

        const createRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sellerToken}`
            },
            body: JSON.stringify(newProduct)
        });
        const createData = await createRes.json();

        if (createData.success && createData.product) {
            createdProductId = createData.product._id || createData.product.id;
            log('Create Product successful', 'success');
        } else {
            console.log(createData);
            throw new Error('Create Product failed');
        }

        // Update Product
        const updateRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sellerToken}`
            },
            body: JSON.stringify({ stock: 150 })
        });
        const updateData = await updateRes.json();
        if (updateData.success) {
            log('Update Product successful', 'success');
        } else {
            throw new Error('Update Product failed');
        }

        // Get Products
        const getRes = await fetch(`${BASE_URL}/products`);
        const getData = await getRes.json();
        if (getData.success && getData.products.length > 0) {
            log(`Get Products successful (Found ${getData.count})`, 'success');
        } else {
            throw new Error('Get Products failed');
        }

    } catch (e) {
        log(`Product CRUD Error: ${e.message}`, 'error');
    }

    // 4. Order CRUD
    try {
        if (!createdProductId) throw new Error('No product created to order');

        // Create Order (Buyer)
        const orderDataPayload = {
            items: [{
                productId: createdProductId,
                productName: "Automated Test Product",
                quantity: 2,
                pricePerUnit: 1000,
                total: 2000
            }],
            totalAmount: 2000,
            shippingAddress: "Test Address, Colombo",
            paymentMethod: "Cash on Delivery",
            notes: "Test order"
        };

        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${buyerToken}`
            },
            body: JSON.stringify(orderDataPayload)
        });
        const orderResData = await orderRes.json();

        if (orderResData.success) {
            createdOrderId = orderResData.order._id || orderResData.order.id;
            log('Create Order successful', 'success');
        } else {
            console.log(orderResData);
            throw new Error('Create Order failed');
        }

        // Get My Orders (Buyer)
        const myOrdersRes = await fetch(`${BASE_URL}/orders/buyer/my-orders`, {
            headers: { 'Authorization': `Bearer ${buyerToken}` }
        });
        const myOrdersData = await myOrdersRes.json();
        if (myOrdersData.success) {
            log('Get Buyer Orders successful', 'success');
        }

        // Update Order Status (Seller)
        const statusRes = await fetch(`${BASE_URL}/orders/${createdOrderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sellerToken}`
            },
            body: JSON.stringify({ status: 'processing' })
        });
        const statusData = await statusRes.json();
        if (statusData.success) {
            log('Update Order Status successful', 'success');
        } else {
            throw new Error('Update Order Status failed');
        }

    } catch (e) {
        log(`Order CRUD Error: ${e.message}`, 'error');
    }

    // 5. Cleanup (Delete Product via Admin or Seller)
    try {
        if (createdProductId) {
            const deleteRes = await fetch(`${BASE_URL}/products/${createdProductId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${sellerToken}` }
            });
            if (deleteRes.ok) {
                log('Delete Product successful', 'success');
            } else {
                log('Delete Product failed or already deleted', 'error');
            }
        }
    } catch (e) {
        log(`Cleanup Error: ${e.message}`, 'error');
    }

    console.log('\n✨ All Tests Completed');
}

runTests();
