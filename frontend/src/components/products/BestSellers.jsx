import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiMinus } from "react-icons/fi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../Redux/Slices/cartSlice";

const BestSeller = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Get or create guest ID
  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  useEffect(() => {
    const fetchBestSeller = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-sellers`
        );
        if (data.length > 0) {
          const firstProduct = data[0]; // pick the first bestseller
          setProduct(firstProduct);
          setSelectedImage(firstProduct.images?.[0] || "");
          setSelectedColor(firstProduct.colors?.[0] || "");
          setSelectedSize(firstProduct.sizes?.[0] || "");
        }
      } catch (err) {
        console.error("Error fetching bestseller:", err);
        toast.error("Failed to load bestseller");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSeller();
  }, []);

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);

  const handleAddTocart = async () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color!");
      return;
    }

    try {
      const guestId = getGuestId();
      const userId = user?._id;

      await dispatch(
        addToCart({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId,
        })
      ).unwrap();

      toast.success("Item added to cart!");
      setQuantity(1);
    } catch (error) {
      toast.error(error || "Failed to add to cart");
      console.error("Add to cart error:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10 text-red-500">No bestseller found</p>;

  return (
    <div className="p-6">
      {/* Product Details */}
      <div className="max-w-6xl mx-auto rounded-sm p-6 flex flex-col md:flex-row">
        {/* LEFT: Images */}
        <div className="flex flex-col-reverse md:flex-row gap-6 md:w-1/2">
          <div className="flex gap-4 sm:flex-row-reverse md:flex-col sm:space-x-4 md:space-y-4">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Product image ${index + 1}`}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 object-cover cursor-pointer rounded-sm border-3 border-gray-400 transition ${
                  selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-400"
                }`}
              />
            ))}
          </div>

          <div className="flex-1">
            <img
              src={selectedImage || product.images?.[0] || ""}
              alt={product.name || "Product"}
              className="w-full h-[450px] object-cover rounded-lg"
            />
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="md:w-1/2 mt-6 md:mt-0 md:pl-8">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <p className="text-gray-500 mb-4">Brand: {product.brand || "Unknown"}</p>
          <p className="text-gray-700 text-lg mb-4">{product.description || "No description available"}</p>
          <p className="text-2xl font-semibold text-black mb-6">₹{product.price || "-"}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Color:</h3>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1 border rounded-md transition ${
                      selectedColor === color ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Select Size:</h3>
              <div className="flex gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1 border rounded-md transition ${
                      selectedSize === size ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleDecrement} className="p-2 border rounded-md hover:bg-gray-100">
              <FiMinus />
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button onClick={handleIncrement} className="p-2 border rounded-md hover:bg-gray-100">
              <FiPlus />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddTocart}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition active:scale-95"
            >
              Add to Cart
            </button>

            <button className="border border-black text-black px-6 py-2 rounded-md hover:bg-black hover:text-white transition active:scale-95">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
