import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { items: [] };
  } catch (error) {
    return { items: [] };
  }
};

//  Fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (guestId) params.append("guestId", guestId);

      const response = await axios.get(`${BASE_URL}/api/cart?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

//  Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, size, color, guestId, userId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${BASE_URL}/api/cart/add`,
        {
          productId,
          quantity,
          size,
          color,
          guestId, 
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data.cart;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to add item");
    }
  }
);

//  Update item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ cartItemId, quantity, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${BASE_URL}/api/cart/update`,
        {
          productId: cartItemId,
          quantity,
          size,
          color,
          guestId,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update item");
    }
  }
);

//  Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ cartItemId, userId, guestId, size, color }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${BASE_URL}/api/cart/remove`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        data: { productId: cartItemId, size, color, guestId },
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove item");
    }
  }
);

//  Merge guest cart with logged-in user cart
export const mergeGuestCart = createAsyncThunk(
  "cart/mergeGuestCart",
  async ({ guestCartId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/cart/merge`,
        { guestCartId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to merge cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromLocalStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { items: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Add to cart response:", action.payload);
        
        
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error("Add to cart error:", action.payload);
      })

     
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      })

      
      .addCase(removeFromCart.fulfilled, (state, action) => {
        
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      })

      // Merge guest cart
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.cart));
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;