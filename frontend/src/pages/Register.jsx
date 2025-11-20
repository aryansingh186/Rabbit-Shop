import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../Redux/Slices/authSlice";
import { toast } from "sonner";
import registerImg from "../assets/register.webp";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await dispatch(registerUser({ name, email, password })).unwrap();
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error || "Registration failed");
    }
  };

  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border-2 shadow-xl"
        >
          <h2 className="text-xl font-medium text-center mb-2">Rabbit</h2>
          <h3 className="text-2xl font-bold text-center mb-4">
            Create an Account
          </h3>
          <p className="text-center mb-6 text-gray-600">
            Enter your details to register
          </p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
          >
            Register
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      <div className="hidden md:block w-fit h-full mr-4 bg-gray-800">
        <div className="flex justify-center items-center">
          <img
            src={registerImg}
            alt="Register"
            className="h-[650px] w-[700px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
