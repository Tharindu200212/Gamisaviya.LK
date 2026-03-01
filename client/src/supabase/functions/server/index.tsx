import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    console.log('Auth error while verifying user token:', error);
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  // Attach user to context
  c.set('userId', user.id);
  c.set('userEmail', user.email);
  
  await next();
};

// Health check endpoint
app.get("/make-server-9b2fc9a2/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ==================== AUTH ROUTES ====================

// Sign up new user
app.post("/make-server-9b2fc9a2/auth/signup", async (c) => {
  try {
    const { email, password, name, role, phone, location, story, storysin } = await c.req.json();

    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields: email, password, name, role' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true,
    });

    if (authError) {
      console.log('Supabase auth error during user signup:', authError);
      return c.json({ error: `Failed to create user: ${authError.message}` }, 400);
    }

    const userId = authData.user.id;

    // Create user profile in KV store
    const userProfile = {
      id: userId,
      email,
      name,
      role,
      phone: phone || '',
      address: '',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`users:${userId}`, userProfile);

    // If seller, create seller profile (pending approval)
    if (role === 'seller') {
      const sellerProfile = {
        id: userId,
        name,
        email,
        phone: phone || '',
        location: location || '',
        story: story || '',
        storysin: storysin || '',
        image: '',
        approved: false,
        createdAt: new Date().toISOString(),
        products: 0,
        rating: 0,
      };

      await kv.set(`sellers:${userId}`, sellerProfile);
      
      // Add to pending sellers list
      const pendingSellers = await kv.get('pending_sellers') || [];
      pendingSellers.push(userId);
      await kv.set('pending_sellers', pendingSellers);
    }

    return c.json({
      success: true,
      user: userProfile,
      message: role === 'seller' ? 'Seller account created. Awaiting admin approval.' : 'Account created successfully',
    });

  } catch (error) {
    console.log('Error during signup process:', error);
    return c.json({ error: `Signup failed: ${error.message}` }, 500);
  }
});

// Sign in user
app.post("/make-server-9b2fc9a2/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Supabase auth error during sign in:', error);
      return c.json({ error: `Sign in failed: ${error.message}` }, 401);
    }

    // Get user profile from KV
    const userProfile = await kv.get(`users:${data.user.id}`);

    if (!userProfile) {
      console.log('User profile not found in KV store for user:', data.user.id);
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({
      success: true,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: userProfile,
    });

  } catch (error) {
    console.log('Error during sign in process:', error);
    return c.json({ error: `Sign in failed: ${error.message}` }, 500);
  }
});

// Get current session
app.get("/make-server-9b2fc9a2/auth/session", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({
      success: true,
      user: userProfile,
    });

  } catch (error) {
    console.log('Error fetching session:', error);
    return c.json({ error: `Failed to fetch session: ${error.message}` }, 500);
  }
});

// Sign out
app.post("/make-server-9b2fc9a2/auth/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (accessToken) {
      await supabase.auth.signOut();
    }

    return c.json({ success: true, message: 'Signed out successfully' });
  } catch (error) {
    console.log('Error during sign out:', error);
    return c.json({ error: `Sign out failed: ${error.message}` }, 500);
  }
});

// ==================== PRODUCT ROUTES ====================

// Get all approved products (public)
app.get("/make-server-9b2fc9a2/products", async (c) => {
  try {
    const category = c.req.query('category');
    const featured = c.req.query('featured');
    
    const allProducts = await kv.getByPrefix('products:');
    let products = allProducts.filter((p: any) => p.approved === true);

    if (category) {
      products = products.filter((p: any) => p.category === category);
    }

    if (featured === 'true') {
      products = products.filter((p: any) => p.featured === true);
    }

    return c.json({ success: true, products });

  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: `Failed to fetch products: ${error.message}` }, 500);
  }
});

// Get single product by ID (public)
app.get("/make-server-9b2fc9a2/products/:id", async (c) => {
  try {
    const productId = c.req.param('id');
    const product = await kv.get(`products:${productId}`);

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    return c.json({ success: true, product });

  } catch (error) {
    console.log('Error fetching product:', error);
    return c.json({ error: `Failed to fetch product: ${error.message}` }, 500);
  }
});

// Create new product (sellers only)
app.post("/make-server-9b2fc9a2/products", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'seller' && userProfile.role !== 'admin') {
      return c.json({ error: 'Only sellers can create products' }, 403);
    }

    // Check if seller is approved
    const sellerProfile = await kv.get(`sellers:${userId}`);
    if (sellerProfile && !sellerProfile.approved) {
      return c.json({ error: 'Seller account not yet approved by admin' }, 403);
    }

    const productData = await c.req.json();
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const product = {
      id: productId,
      name: productData.name,
      namesin: productData.namesin || '',
      description: productData.description,
      descriptionsin: productData.descriptionsin || '',
      category: productData.category,
      retailPrice: parseFloat(productData.retailPrice),
      wholesalePrice: parseFloat(productData.wholesalePrice),
      wholesaleThreshold: parseInt(productData.wholesaleThreshold),
      stock: parseInt(productData.stock),
      images: productData.images || [],
      sellerId: userId,
      sellerName: userProfile.name,
      sellerLocation: sellerProfile?.location || '',
      approved: false, // Requires admin approval
      featured: false,
      rating: 0,
      reviews: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`products:${productId}`, product);

    // Add to seller's products list
    const sellerProducts = await kv.get(`products_by_seller:${userId}`) || [];
    sellerProducts.push(productId);
    await kv.set(`products_by_seller:${userId}`, sellerProducts);

    return c.json({ success: true, product, message: 'Product created. Awaiting admin approval.' });

  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: `Failed to create product: ${error.message}` }, 500);
  }
});

// Get seller's products
app.get("/make-server-9b2fc9a2/seller/products", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const productIds = await kv.get(`products_by_seller:${userId}`) || [];
    const products = await kv.mget(productIds.map((id: string) => `products:${id}`));

    return c.json({ success: true, products });

  } catch (error) {
    console.log('Error fetching seller products:', error);
    return c.json({ error: `Failed to fetch products: ${error.message}` }, 500);
  }
});

// Update product
app.put("/make-server-9b2fc9a2/products/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const productId = c.req.param('id');
    const product = await kv.get(`products:${productId}`);

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const userProfile = await kv.get(`users:${userId}`);
    
    // Only the seller who created it or admin can update
    if (product.sellerId !== userId && userProfile.role !== 'admin') {
      return c.json({ error: 'Not authorized to update this product' }, 403);
    }

    const updates = await c.req.json();
    const updatedProduct = { ...product, ...updates, updatedAt: new Date().toISOString() };

    await kv.set(`products:${productId}`, updatedProduct);

    return c.json({ success: true, product: updatedProduct });

  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: `Failed to update product: ${error.message}` }, 500);
  }
});

// Delete product
app.delete("/make-server-9b2fc9a2/products/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const productId = c.req.param('id');
    const product = await kv.get(`products:${productId}`);

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const userProfile = await kv.get(`users:${userId}`);
    
    if (product.sellerId !== userId && userProfile.role !== 'admin') {
      return c.json({ error: 'Not authorized to delete this product' }, 403);
    }

    await kv.del(`products:${productId}`);

    // Remove from seller's products list
    const sellerProducts = await kv.get(`products_by_seller:${product.sellerId}`) || [];
    const updatedList = sellerProducts.filter((id: string) => id !== productId);
    await kv.set(`products_by_seller:${product.sellerId}`, updatedList);

    return c.json({ success: true, message: 'Product deleted successfully' });

  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: `Failed to delete product: ${error.message}` }, 500);
  }
});

// ==================== ORDER ROUTES ====================

// Create new order
app.post("/make-server-9b2fc9a2/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    const orderData = await c.req.json();
    const orderId = `ORD${Date.now()}`;

    const order = {
      id: orderId,
      buyerId: userId,
      buyerName: userProfile.name,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`orders:${orderId}`, order);

    // Add to buyer's orders
    const buyerOrders = await kv.get(`orders_by_buyer:${userId}`) || [];
    buyerOrders.push(orderId);
    await kv.set(`orders_by_buyer:${userId}`, buyerOrders);

    // Group items by seller and add to each seller's orders
    const itemsBySeller: any = {};
    for (const item of orderData.items) {
      const product = await kv.get(`products:${item.productId}`);
      if (product) {
        if (!itemsBySeller[product.sellerId]) {
          itemsBySeller[product.sellerId] = [];
        }
        itemsBySeller[product.sellerId].push(item);
      }
    }

    for (const sellerId of Object.keys(itemsBySeller)) {
      const sellerOrders = await kv.get(`orders_by_seller:${sellerId}`) || [];
      sellerOrders.push(orderId);
      await kv.set(`orders_by_seller:${sellerId}`, sellerOrders);
    }

    return c.json({ success: true, order });

  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: `Failed to create order: ${error.message}` }, 500);
  }
});

// Get buyer's orders
app.get("/make-server-9b2fc9a2/buyer/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderIds = await kv.get(`orders_by_buyer:${userId}`) || [];
    const orders = await kv.mget(orderIds.map((id: string) => `orders:${id}`));

    // Sort by creation date (newest first)
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });

  } catch (error) {
    console.log('Error fetching buyer orders:', error);
    return c.json({ error: `Failed to fetch orders: ${error.message}` }, 500);
  }
});

// Get seller's orders
app.get("/make-server-9b2fc9a2/seller/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderIds = await kv.get(`orders_by_seller:${userId}`) || [];
    const orders = await kv.mget(orderIds.map((id: string) => `orders:${id}`));

    // Sort by creation date (newest first)
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });

  } catch (error) {
    console.log('Error fetching seller orders:', error);
    return c.json({ error: `Failed to fetch orders: ${error.message}` }, 500);
  }
});

// Get single order
app.get("/make-server-9b2fc9a2/orders/:id", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderId = c.req.param('id');
    const order = await kv.get(`orders:${orderId}`);

    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const userProfile = await kv.get(`users:${userId}`);

    // Check authorization
    if (order.buyerId !== userId && userProfile.role !== 'admin') {
      // Check if user is a seller for this order
      let isSeller = false;
      for (const item of order.items) {
        const product = await kv.get(`products:${item.productId}`);
        if (product && product.sellerId === userId) {
          isSeller = true;
          break;
        }
      }
      
      if (!isSeller) {
        return c.json({ error: 'Not authorized to view this order' }, 403);
      }
    }

    return c.json({ success: true, order });

  } catch (error) {
    console.log('Error fetching order:', error);
    return c.json({ error: `Failed to fetch order: ${error.message}` }, 500);
  }
});

// Update order status
app.put("/make-server-9b2fc9a2/orders/:id/status", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const orderId = c.req.param('id');
    const { status } = await c.req.json();

    const order = await kv.get(`orders:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const userProfile = await kv.get(`users:${userId}`);

    // Only seller or admin can update status
    if (userProfile.role !== 'admin') {
      let isSeller = false;
      for (const item of order.items) {
        const product = await kv.get(`products:${item.productId}`);
        if (product && product.sellerId === userId) {
          isSeller = true;
          break;
        }
      }
      
      if (!isSeller) {
        return c.json({ error: 'Not authorized to update this order' }, 403);
      }
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    await kv.set(`orders:${orderId}`, order);

    return c.json({ success: true, order });

  } catch (error) {
    console.log('Error updating order status:', error);
    return c.json({ error: `Failed to update order: ${error.message}` }, 500);
  }
});

// ==================== SELLER ROUTES ====================

// Get all sellers (public - only approved)
app.get("/make-server-9b2fc9a2/sellers", async (c) => {
  try {
    const allSellers = await kv.getByPrefix('sellers:');
    const approvedSellers = allSellers.filter((s: any) => s.approved === true);

    return c.json({ success: true, sellers: approvedSellers });

  } catch (error) {
    console.log('Error fetching sellers:', error);
    return c.json({ error: `Failed to fetch sellers: ${error.message}` }, 500);
  }
});

// Get seller profile
app.get("/make-server-9b2fc9a2/sellers/:id", async (c) => {
  try {
    const sellerId = c.req.param('id');
    const seller = await kv.get(`sellers:${sellerId}`);

    if (!seller) {
      return c.json({ error: 'Seller not found' }, 404);
    }

    // Get seller's products
    const productIds = await kv.get(`products_by_seller:${sellerId}`) || [];
    const products = await kv.mget(productIds.map((id: string) => `products:${id}`));
    const approvedProducts = products.filter((p: any) => p.approved === true);

    return c.json({ 
      success: true, 
      seller: { ...seller, products: approvedProducts.length },
      products: approvedProducts 
    });

  } catch (error) {
    console.log('Error fetching seller:', error);
    return c.json({ error: `Failed to fetch seller: ${error.message}` }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

// Get all pending sellers
app.get("/make-server-9b2fc9a2/admin/pending-sellers", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const pendingSellerIds = await kv.get('pending_sellers') || [];
    const sellers = await kv.mget(pendingSellerIds.map((id: string) => `sellers:${id}`));

    return c.json({ success: true, sellers });

  } catch (error) {
    console.log('Error fetching pending sellers:', error);
    return c.json({ error: `Failed to fetch pending sellers: ${error.message}` }, 500);
  }
});

// Approve/Reject seller
app.put("/make-server-9b2fc9a2/admin/sellers/:id/approve", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const sellerId = c.req.param('id');
    const { approved } = await c.req.json();

    const seller = await kv.get(`sellers:${sellerId}`);
    if (!seller) {
      return c.json({ error: 'Seller not found' }, 404);
    }

    seller.approved = approved;
    seller.approvedAt = new Date().toISOString();
    await kv.set(`sellers:${sellerId}`, seller);

    // Remove from pending list
    const pendingSellers = await kv.get('pending_sellers') || [];
    const updatedPending = pendingSellers.filter((id: string) => id !== sellerId);
    await kv.set('pending_sellers', updatedPending);

    return c.json({ success: true, seller, message: approved ? 'Seller approved' : 'Seller rejected' });

  } catch (error) {
    console.log('Error approving seller:', error);
    return c.json({ error: `Failed to approve seller: ${error.message}` }, 500);
  }
});

// Get all products (admin - including unapproved)
app.get("/make-server-9b2fc9a2/admin/products", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const products = await kv.getByPrefix('products:');

    return c.json({ success: true, products });

  } catch (error) {
    console.log('Error fetching all products:', error);
    return c.json({ error: `Failed to fetch products: ${error.message}` }, 500);
  }
});

// Approve/Reject product
app.put("/make-server-9b2fc9a2/admin/products/:id/approve", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const productId = c.req.param('id');
    const { approved, featured } = await c.req.json();

    const product = await kv.get(`products:${productId}`);
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    product.approved = approved;
    if (featured !== undefined) {
      product.featured = featured;
    }
    product.approvedAt = new Date().toISOString();
    await kv.set(`products:${productId}`, product);

    return c.json({ success: true, product, message: approved ? 'Product approved' : 'Product rejected' });

  } catch (error) {
    console.log('Error approving product:', error);
    return c.json({ error: `Failed to approve product: ${error.message}` }, 500);
  }
});

// Get all orders (admin)
app.get("/make-server-9b2fc9a2/admin/orders", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const orders = await kv.getByPrefix('orders:');
    orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json({ success: true, orders });

  } catch (error) {
    console.log('Error fetching all orders:', error);
    return c.json({ error: `Failed to fetch orders: ${error.message}` }, 500);
  }
});

// Get all users (admin)
app.get("/make-server-9b2fc9a2/admin/users", requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const userProfile = await kv.get(`users:${userId}`);

    if (userProfile.role !== 'admin') {
      return c.json({ error: 'Admin access required' }, 403);
    }

    const users = await kv.getByPrefix('users:');

    return c.json({ success: true, users });

  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: `Failed to fetch users: ${error.message}` }, 500);
  }
});

// ==================== SEED DATA ====================

// Initialize database with seed data
app.post("/make-server-9b2fc9a2/seed", async (c) => {
  try {
    // Check if already seeded
    const seeded = await kv.get('db_seeded');
    if (seeded) {
      return c.json({ success: false, message: 'Database already seeded' });
    }

    // Create admin user
    const adminEmail = 'admin@gamisaviya.lk';
    const adminPassword = 'admin123';
    
    const { data: adminAuth } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      user_metadata: { name: 'Admin', role: 'admin' },
      email_confirm: true,
    });

    if (adminAuth?.user) {
      await kv.set(`users:${adminAuth.user.id}`, {
        id: adminAuth.user.id,
        email: adminEmail,
        name: 'Admin',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
    }

    // Create test sellers
    const sellersData = [
      {
        email: 'ranjith@gamisaviya.lk',
        password: 'seller123',
        name: 'Ranjith Silva',
        phone: '+94 77 123 4567',
        location: 'Anuradhapura',
        story: 'I am a third-generation farmer from Anuradhapura, dedicated to preserving traditional organic farming methods.',
        storysin: 'මම අනුරාධපුරයේ තුන්වන පරම්පරාවේ ගොවියෙකි, සම්ප්‍රදායික කාබනික ගොවිතැන් ක්‍රම සංරක්ෂණය කිරීමට කැප වී සිටිමි.',
      },
      {
        email: 'kumari@gamisaviya.lk',
        password: 'seller123',
        name: 'Kumari Perera',
        phone: '+94 71 234 5678',
        location: 'Kurunegala',
        story: 'I started making coconut oil using my grandmother\'s traditional methods.',
        storysin: 'මම මගේ ආච්චිගේ සම්ප්‍රදායික ක්‍රම භාවිතයෙන් පොල් තෙල් සෑදීම ආරම්භ කළෙමි.',
      },
    ];

    const sellerIds: string[] = [];

    for (const sellerData of sellersData) {
      const { data: sellerAuth } = await supabase.auth.admin.createUser({
        email: sellerData.email,
        password: sellerData.password,
        user_metadata: { name: sellerData.name, role: 'seller' },
        email_confirm: true,
      });

      if (sellerAuth?.user) {
        const sellerId = sellerAuth.user.id;
        sellerIds.push(sellerId);

        await kv.set(`users:${sellerId}`, {
          id: sellerId,
          email: sellerData.email,
          name: sellerData.name,
          role: 'seller',
          phone: sellerData.phone,
          createdAt: new Date().toISOString(),
        });

        await kv.set(`sellers:${sellerId}`, {
          id: sellerId,
          name: sellerData.name,
          email: sellerData.email,
          phone: sellerData.phone,
          location: sellerData.location,
          story: sellerData.story,
          storysin: sellerData.storysin,
          image: '',
          approved: true,
          createdAt: new Date().toISOString(),
          products: 0,
          rating: 4.8,
        });

        await kv.set(`products_by_seller:${sellerId}`, []);
      }
    }

    // Create sample products
    const productsData = [
      {
        name: 'Organic Rice (Red Rice)',
        namesin: 'කාබනික සහල් (රතු සහල්)',
        description: 'Premium quality organic red rice from Anuradhapura.',
        descriptionsin: 'අනුරාධපුරයේ උසස් තත්ත්වයේ කාබනික රතු සහල්.',
        category: 'Grains & Rice',
        retailPrice: 250,
        wholesalePrice: 200,
        wholesaleThreshold: 10,
        stock: 500,
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800'],
        sellerIndex: 0,
      },
      {
        name: 'Fresh Coconut Oil',
        namesin: 'නැවුම් පොල් තෙල්',
        description: 'Pure virgin coconut oil extracted from fresh coconuts.',
        descriptionsin: 'නැවුම් පොල් වලින් නිස්සාරණය කරන ලද පිරිසිදු පොල් තෙල්.',
        category: 'Oils & Spices',
        retailPrice: 800,
        wholesalePrice: 650,
        wholesaleThreshold: 5,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800'],
        sellerIndex: 1,
      },
      {
        name: 'Natural Honey',
        namesin: 'ස්වාභාවික මී පැණි',
        description: 'Raw natural honey from forest beehives.',
        descriptionsin: 'වන මී මැස්සන්ගේ වල මී පැණි.',
        category: 'Honey & Sweeteners',
        retailPrice: 1200,
        wholesalePrice: 1000,
        wholesaleThreshold: 3,
        stock: 150,
        images: ['https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=800'],
        sellerIndex: 0,
      },
      {
        name: 'Ceylon Cinnamon Sticks',
        namesin: 'ලංකා කුරුඳු',
        description: 'Authentic Ceylon cinnamon from the hills of Sri Lanka.',
        descriptionsin: 'ශ්‍රී ලංකාවේ කඳුකරයේ සිට අව්‍යාජ ලංකා කුරුඳු.',
        category: 'Oils & Spices',
        retailPrice: 450,
        wholesalePrice: 350,
        wholesaleThreshold: 10,
        stock: 400,
        images: ['https://images.unsplash.com/photo-1599639957043-f3aa5c986398?w=800'],
        sellerIndex: 0,
      },
    ];

    for (const productData of productsData) {
      const sellerId = sellerIds[productData.sellerIndex];
      const sellerProfile = await kv.get(`sellers:${sellerId}`);
      const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const product = {
        id: productId,
        ...productData,
        sellerId,
        sellerName: sellerProfile.name,
        sellerLocation: sellerProfile.location,
        approved: true,
        featured: Math.random() > 0.5,
        rating: 4.5 + Math.random() * 0.5,
        reviews: Math.floor(Math.random() * 100) + 20,
        createdAt: new Date().toISOString(),
      };

      delete product.sellerIndex;

      await kv.set(`products:${productId}`, product);

      const sellerProducts = await kv.get(`products_by_seller:${sellerId}`) || [];
      sellerProducts.push(productId);
      await kv.set(`products_by_seller:${sellerId}`, sellerProducts);
    }

    await kv.set('db_seeded', true);

    return c.json({ 
      success: true, 
      message: 'Database seeded successfully',
      credentials: {
        admin: { email: adminEmail, password: adminPassword },
        sellers: sellersData.map(s => ({ email: s.email, password: s.password })),
      }
    });

  } catch (error) {
    console.log('Error seeding database:', error);
    return c.json({ error: `Failed to seed database: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
