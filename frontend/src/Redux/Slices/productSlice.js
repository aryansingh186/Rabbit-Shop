import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;


export const fetchProductsByCollection = createAsyncThunk(
  "products/fetchByCollection",
  async (filters, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      for (const key in filters) {
        if (filters[key]) query.append(key, filters[key]);
      }

      const response = await axios.get(`${BASE_URL}/api/products?${query.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);


export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details");
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/products/similar/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch similar products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    filters: {
      category: "",
      brand: "",
      size: "",
      color: "",
      gender: "",
      minimumPrice: "",
      maximumPrice: "",
      sortby: "",
      search: "",
      material: "",
      collection: "",
    },
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        brand: "",
        size: "",
        color: "",
        gender: "",
        minimumPrice: "",
        maximumPrice: "",
        sortby: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      //  Fetch Products
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Fetch Product By ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })

      
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarProducts = action.payload;
      })

      //  Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload;
        state.products = state.products.map((p) =>
          p._id === updated._id ? updated : p
        );
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
