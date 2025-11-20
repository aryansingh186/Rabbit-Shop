import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner"; 
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
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./components/Admin/UserManagement";
import ProductManagement from "./components/Admin/ProductManagement";
import EditProductPage from "./components/Admin/EditProductPage";
import OrderManagement from "./components/Admin/OrderManagement";

// NotFound component
const NotFound = () => (
  <div className="text-center mt-20 text-2xl font-bold text-red-500">
    404 - Page Not Found
  </div>
);

const App = () => {
  return (
    <>
      
      <Toaster position="top-right" richColors />

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

            {/*  for all user routes */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="edit-product/:id" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />

            {/*  admin routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
