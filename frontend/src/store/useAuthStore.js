import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isAdmin: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("error in checkauth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  google: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/google", data);
      set({ authUser: res.data });
      toast.success("connected with google account");
    } catch (err) {
      toast.error("failed in connecting with google");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("logged out successfully");
    } catch (error) {
      toast.error("cannot log out", error);
    }
  },

  
}));
