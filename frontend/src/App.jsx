import React, { useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner"; 
import { restoreAuth } from "./Redux/Slices/authSlice";
import "./index.css";

// Layouts
import UserLayout from "./components/layout/UserLayout";
import AdminLayout from "./components/Admin/AdminLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import CollectionPage from "./pages/CollectionPage";
import CheckOutPage from "./components/cart/CheckOutPage";
import PaymentPage from "./components/cart/PaymentPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Productdetails from "./components/products/Productdetails";

// Admin Pages
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import AddProductPage from "./components/Admin/AddProductPage"; 
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";

// NotFound component
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="text-9xl font-bold text-gray-300">404</div>
    <h1 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h1>
    <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
    <Link 
      to="/" 
      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Go Back Home
    </Link>
  </div>
);

const App = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return (
    <>
    <Toaster 
  position="top-center" 
  richColors
  closeButton   
/>

      <BrowserRouter>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collections/:collection" element={<CollectionPage />} />
            <Route path="checkoutpage" element={<CheckOutPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="product/:id" element={<Productdetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="add-product" element={<AddProductPage />} /> 
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;