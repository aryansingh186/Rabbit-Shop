import React, { useState } from "react";
import { TbBrandMeta } from "react-icons/tb";
import { FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";
import { toast } from "sonner";
import axios from "axios";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9000/api/subscribe", { email });

      if (response.status === 201) {
        toast.success("Subscribed successfully!");
        setEmail("");
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message || "Already subscribed!");
      } else {
        toast.error("Server error, please try again.");
      }
    }
  };

  return (
    <footer className="border-t bg-gray-50 p-8 md:p-12">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Newsletter */}
        <div>
          <h3 className="text-lg text-gray-800 font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-2">
            Be the first to hear about new products, exclusive events, and offers.
          </p>
          <p className="text-gray-500 mb-4">
            Sign up and get 10% off your first purchase.
          </p>
          <form 
            className="flex flex-col sm:flex-row gap-2 sm:gap-0"
            onSubmit={handleSubscribe}
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 p-2 border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-1 focus:ring-black"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button 
              type="submit" 
              className="bg-black text-white p-2 rounded-md sm:rounded-l-none hover:bg-gray-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg text-gray-800 font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-black transition">Men</a></li>
            <li><a href="#" className="hover:text-black transition">Women</a></li>
            <li><a href="#" className="hover:text-black transition">Top Wear</a></li>
            <li><a href="#" className="hover:text-black transition">Bottom Wear</a></li>
            <li><a href="#" className="hover:text-black transition">New Arrivals</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg text-gray-800 font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-black transition">Contact Us</a></li>
            <li><a href="#" className="hover:text-black transition">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-black transition">FAQ</a></li>
            <li><a href="#" className="hover:text-black transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-black transition">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg text-gray-800 font-semibold mb-4">Follow Us</h3>
          <p className="text-gray-500 mb-4">Stay connected with us on social media</p>
          <div className="flex space-x-4 text-2xl">
            <a href="#" className="text-gray-600 hover:text-black transition"><TbBrandMeta /></a>
            <a href="#" className="text-gray-600 hover:text-black transition"><FaInstagram /></a>
            <a href="#" className="text-gray-600 hover:text-black transition"><FaTwitter /></a>
            <a href="#" className="text-gray-600 hover:text-black transition"><FaPinterest /></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="mt-12 border-t pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Rabbit. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
