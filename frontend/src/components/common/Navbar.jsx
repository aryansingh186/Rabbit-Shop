import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiMiniXMark
} from 'react-icons/hi2';
import Searchbar from './Searchbar';
import CartDrawer from '../layout/CartDrawer';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);

  const cartItemCount = cart?.items?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => setNavDrawerOpen(!navDrawerOpen);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-medium">Rabbit</Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/collections/all?gender=Men" className="hover:text-black text-gray-700 text-sm font-medium uppercase">Men</Link>
          <Link to="/collections/all?gender=Women" className="hover:text-black text-gray-700 text-sm font-medium uppercase">Women</Link>
          <Link to="/collections/all?category=Top wear" className="hover:text-black text-gray-700 text-sm font-medium uppercase">Top wear</Link>
          <Link to="/collections/all?category=Bottom wear" className="hover:text-black text-gray-700 text-sm font-medium uppercase">Bottom wear</Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/admin" className="bg-black text-white px-2 rounded text-sm">
            Admin
          </Link>

          <Link to="/profile">
            <HiOutlineUser className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer" />
          </Link>

          <button onClick={toggleDrawer} className="relative">
            <HiOutlineShoppingBag className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#ea2e0e] text-xs text-white rounded-full px-1.5 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          <Searchbar />

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="w-6 h-6 text-gray-700 hover:text-black cursor-pointer" />
          </button>
        </div>
      </nav>

      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      <div className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <HiMiniXMark className="h-6 w-6 text-gray-600 hover:text-black" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="flex flex-col space-y-2">
            <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-lg font-medium uppercase">Men</Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-lg font-medium uppercase">Women</Link>
            <Link to="/collections/all?category=Top wear" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-lg font-medium uppercase">Top wear</Link>
            <Link to="/collections/all?category=Bottom wear" onClick={toggleNavDrawer} className="text-gray-700 hover:text-black text-lg font-medium uppercase">Bottom wear</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;