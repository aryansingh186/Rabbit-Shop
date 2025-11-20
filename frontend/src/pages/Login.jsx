import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux"; 
import { toast } from "sonner";
import loginImg from "../assets/login.webp";
import { loginUser } from "../Redux/Slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      toast.success("Login successful!");
      
      const redirectTo = searchParams.get("redirect");
      
setTimeout(() => {
  
  let safeRedirect = redirectTo?.startsWith("/") ? redirectTo : `/${redirectTo}`;

  if (!redirectTo || redirectTo === "" || redirectTo === "undefined") {
    safeRedirect = "/";
  }

  if (redirectTo === "checkout") {
    safeRedirect = "/CheckOutPage";
  }

  navigate(safeRedirect, { replace: true });
}, 200);

      
    } catch (error) {
      toast.error(error || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border-2 shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium">Rabbit</h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">Enter your email and password</p>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      {/* Image */}
      <div className="hidden md:block w-fit h-full mr-4 bg-gray-800">
        <div className="flex flex-col justify-center items-center">
          <img
            src={loginImg}
            alt="Login to an account"
            className="h-[650px] w-[700px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;