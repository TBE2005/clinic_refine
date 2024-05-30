import { AuthProvider } from "@refinedev/core";
import api from "./axios";

const authProvider: AuthProvider = {
  login: async (values) => {
    try {
      await api.post("auth/login", values);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid username or password",
        },
      };
    }
  },
  logout: async () => {
    try {
      await api.post("auth/logout");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  },
  check: async () => {
    try {
      await api.get("users/me");
      return {
        authenticated: true,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    try {
      const res = await api.get("users/me");
      return res.data;
    } catch (error) {
      return null;
    }
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};

export default authProvider;
