import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    // Sign up    
    signUp: async ({ email, password, name }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
            });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({
                isAuthenticated: false,
                isLoading: false,
                error: error.response.data.message || "Error signing up",
            });
            throw error;
        }
    },
    verifyEmail: async ({ verificationCode }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { verificationCode });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
            return response.data;
        } catch (error) {
            set({ isAuthenticated: false, isLoading: false, error: error.response.data.message || "Error verifying email" });
            throw error;
        }
    },

    //   check if user is authenticated
    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
            return response.data;
        } catch (error) {
            set({ isAuthenticated: false, isCheckingAuth: false, error: null });
        }
    },

    // Sign in
    login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null });
            return response.data;
        } catch (error) {
            set({ isAuthenticated: false, isLoading: false, error: error.response.data.message || "Error signing in" });
            throw error;
        }
    },

    // Logout
    logout: async () => {
        set({ user: null, isAuthenticated: false, error: null });
        await axios.post(`${API_URL}/logout`);
    },

    // Forgot password
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            set({ isLoading: false, error: null, message: response.data.message });
            return response.data;
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Error forgot password" });
            throw error;
        }
    },

    // Reset password
    resetPassword: async (password, token) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, {password });
            set({ isLoading: false, error: null, message: response.data.message });
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Error resetting password" });
            throw error;
        }
    }
}));
