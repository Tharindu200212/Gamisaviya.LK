import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,

} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { DatabaseInitializer } from "./components/DatabaseInitializer";

// Public Pages
import { HomePage } from "./pages/HomePage";
import { ProductListingPage } from "./pages/ProductListingPage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BecomeSellerPage } from "./pages/BecomeSellerPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { SearchResultsPage } from "./pages/SearchResultsPage";

// Buyer Pages
import { BuyerDashboard } from "./pages/buyer/BuyerDashboard";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { MyOrdersPage } from "./pages/buyer/MyOrdersPage";
import { OrderDetailsPage } from "./pages/buyer/OrderDetailsPage";

// Seller Pages
import { SellerDashboard } from "./pages/seller/SellerDashboard";
import { AddProductPage } from "./pages/seller/AddProductPage";
import { SellerProductsPage } from "./pages/seller/SellerProductsPage";
import { SellerOrdersPage } from "./pages/seller/SellerOrdersPage";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { SellerApprovalPage } from "./pages/admin/SellerApprovalPage";
import { ApprovalsPage } from "./pages/admin/ApprovalsPage";
import DatabaseViewerPage from "./pages/admin/DatabaseViewerPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import ProductsManagementPage from "./pages/admin/ProductsManagementPage";
import OrdersManagementPage from "./pages/admin/OrdersManagementPage";

// Placeholder
import { PlaceholderPage } from "./pages/PlaceholderPage";

// Protected Route Components
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <DatabaseInitializer />
      <Navigation />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={<ProductListingPage />}
        />
        <Route
          path="/products/:id"
          element={<ProductDetailsPage />}
        />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/become-seller"
          element={<BecomeSellerPage />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Buyer Routes */}
        <Route
          path="/buyer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/orders"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <OrderDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/profile"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <PlaceholderPage
                title="Buyer Profile"
                description="Manage your profile settings"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer/addresses"
          element={
            <ProtectedRoute allowedRoles={["buyer"]}>
              <PlaceholderPage
                title="Address Management"
                description="Manage delivery addresses"
              />
            </ProtectedRoute>
          }
        />

        {/* Seller Routes */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/add-product"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <AddProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <PlaceholderPage
                title="Seller Profile"
                description="Update your seller information"
              />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seller-approval"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SellerApprovalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product-approval"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UsersManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductsManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <OrdersManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PlaceholderPage
                title="Admin Profile"
                description="Admin account settings"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PlaceholderPage
                title="System Settings"
                description="Platform configuration"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/database-viewer"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DatabaseViewerPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <PlaceholderPage
              title="Page Not Found"
              description="The page you're looking for doesn't exist"
            />
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;