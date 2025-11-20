import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../Redux/Slices/authSlice';
import { clearCart } from '../Redux/Slices/cartSlice';
import { toast } from 'sonner';
import MyOrderPage from './MyOrderPage';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!userInfo) {
        toast.error("Please login to view your profile");
        navigate('/login');
      } else {
        setIsCheckingAuth(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userInfo, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    toast.success('Logged out successfully!');
    navigate('/');
  };

 
  if (isCheckingAuth || !userInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          {/* Profile Info */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {userInfo.name || 'User'}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {userInfo.email || 'No email'}
            </p>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition active:scale-95"
            >
              Logout
            </button>
          </div>

          {/* Order Table */}
          <div className="w-full md:w-2/3 lg:w-3/4 bg-white shadow-md rounded-lg p-6">
            <MyOrderPage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;