import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoginOut: false,
  isLoginIn: false,
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, isSigningUp: false });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed");
      set({ isSigningUp: false, user: null });
    }
  },
  login: async (credentials) => {
    set({ isLoginIn: true });
    try {
      const response = await axios.post("/api/v1/auth/login", credentials);
      set({ user: response.data.user, isLoginIn: false });
    } catch (error) {
      set({ isLoginIn: false, user: null });
      toast.error(error.response.data.message || "Login failed");
    }
  },
  logout: async () => {
    set({ isLoginOut: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, isLoginOut: false });
      toast.success("Logged out successfully");
    } catch (error) {
      set({ isLoginOut: false });
      toast.error(error.response.data.message || "Logout failed");
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      console.log("Calling authCheck API...");
      const response = await axios.get("/api/v1/auth/authCheck");
      set({ user: response.data.user, isCheckingAuth: false });
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      //toast.error(error.response.data.message || "An error occurred");
      set({ isCheckingAuth: false, user: null });
    }
  },
}));
