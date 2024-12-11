import { AuthProvider } from "@refinedev/core";
import api from "./axios";
import { notifications } from "@mantine/notifications";
import { User } from "./types";

const authProvider: AuthProvider = {
  login: async (values) => {
    try {
      const user = await api.post<User>("auth/login", values);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      notifications.show({
        title: "Ошибка",
        message: "Ошибка при авторизации",
        color: "red",
      });
      return {
        success: false,
        error: {
          name: "Ошибка",
          message: "Ошибка при авторизации",
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
