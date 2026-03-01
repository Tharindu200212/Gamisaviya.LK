// Backend API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('gamisaviya_token');
};

// Set auth token to localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('gamisaviya_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('gamisaviya_token');
};

// Generic API request handler
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();

  const headers: any = {
    ...options.headers,
  };

  // Only set Content-Type to application/json if body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      data = {};
    }

    if (!response.ok) {
      console.error(`API Error [${endpoint}]:`, data.error || 'Unknown error');
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Request Failed [${endpoint}]:`, error.message);
    throw error;
  }
};

// ==================== AUTH API ====================

export const authAPI = {
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    location?: string;
    story?: string;
    storysin?: string;
  }) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  signin: async (email: string, password: string) => {
    const data = await apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.accessToken) {
      setAuthToken(data.accessToken);
    }

    return data;
  },

  signout: async () => {
    try {
      await apiRequest('/auth/signout', {
        method: 'POST',
      });
    } finally {
      removeAuthToken();
    }
  },

  getSession: async () => {
    return apiRequest('/auth/session', {
      method: 'GET',
    });
  },
};

// ==================== PRODUCT API ====================

export const productAPI = {
  getAll: async (filters?: { category?: string; featured?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.featured) params.append('featured', 'true');

    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/products${query}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'GET',
    });
  },

  create: async (productData: any) => {
    return apiRequest('/products', {
      method: 'POST',
      body: productData instanceof FormData ? productData : JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData instanceof FormData ? productData : JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getSellerProducts: async () => {
    return apiRequest('/products/seller/my-products', {
      method: 'GET',
    });
  },
};

// ==================== ORDER API ====================

export const orderAPI = {
  create: async (orderData: {
    items: any[];
    totalAmount?: number; // Made optional as backend calculates it
    shippingAddress: string;
    paymentMethod: string;
    phone?: string;
  }) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getById: async (id: string) => {
    return apiRequest(`/orders/${id}`, {
      method: 'GET',
    });
  },

  getBuyerOrders: async () => {
    return apiRequest('/orders/buyer/my-orders', {
      method: 'GET',
    });
  },

  getSellerOrders: async () => {
    return apiRequest('/orders/seller/my-orders', {
      method: 'GET',
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== SELLER API ====================

export const sellerAPI = {
  getAll: async () => {
    return apiRequest('/sellers', {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiRequest(`/sellers/${id}`, {
      method: 'GET',
    });
  },
};

// ==================== ADMIN API ====================

export const adminAPI = {
  getPendingSellers: async () => {
    return apiRequest('/admin/pending-sellers', {
      method: 'GET',
    });
  },

  approveSeller: async (id: string, approved: boolean) => {
    return apiRequest(`/admin/sellers/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved }),
    });
  },

  getAllProducts: async () => {
    return apiRequest('/admin/products', {
      method: 'GET',
    });
  },

  approveProduct: async (id: string, approved: boolean, featured?: boolean) => {
    return apiRequest(`/admin/products/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approved, featured }),
    });
  },

  getAllOrders: async () => {
    return apiRequest('/admin/orders', {
      method: 'GET',
    });
  },

  getAllUsers: async () => {
    return apiRequest('/admin/users', {
      method: 'GET',
    });
  },

  getPlatformStats: async () => {
    return apiRequest('/admin/stats', {
      method: 'GET',
    });
  },
};

// ==================== SEED API ====================

export const seedAPI = {
  seedDatabase: async () => {
    return apiRequest('/seed', {
      method: 'POST',
    });
  },
};
