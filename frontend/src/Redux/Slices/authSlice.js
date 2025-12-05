import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get user info from localStorage
const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const tokenFromStorage = localStorage.getItem("userToken") || null;

// Handle guest ID
let guestId = localStorage.getItem("guestId");
if (!guestId) {
  guestId = `guest_${Date.now()}`;
  localStorage.setItem("guestId", guestId);
}

const initialState = {
  user: userFromStorage,      // ← Changed from 'userInfo' to 'user'
  userInfo: userFromStorage,   // ← Keep both for backwards compatibility
  token: tokenFromStorage,     // ← Added token to state
  guestId,
  loading: false,
  error: null,
};

// --- Login User ---
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);
      return { user: res.data.user, token: res.data.token }; // ← Return both
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// --- Register User ---
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data.user));
      localStorage.setItem("userToken", res.data.token);
      return { user: res.data.user, token: res.data.token }; // ← Return both
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;          // ← Clear user
      state.userInfo = null;      // ← Clear userInfo
      state.token = null;         // ← Clear token
      state.guestId = `guest_${Date.now()}`;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.setItem("guestId", state.guestId);
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${Date.now()}`;
      localStorage.setItem("guestId", state.guestId);
    },
    // ← NEW: Restore user from localStorage on page refresh
    restoreAuth: (state) => {
      const userInfo = localStorage.getItem("userInfo");
      const token = localStorage.getItem("userToken");
      if (userInfo && token) {
        state.user = JSON.parse(userInfo);
        state.userInfo = JSON.parse(userInfo);
        state.token = token;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;         // ← Update user
        state.userInfo = action.payload.user;     // ← Update userInfo
        state.token = action.payload.token;       // ← Update token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;         // ← Update user
        state.userInfo = action.payload.user;     // ← Update userInfo
        state.token = action.payload.token;       // ← Update token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, generateNewGuestId, restoreAuth } = authSlice.actions;
export default authSlice.reducer;