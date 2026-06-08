import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,

  setAuth: (user: User, token: string) => {
    // Store in cookies
    document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours
    document.cookie = `role=${user.role}; path=/; max-age=86400`;
    // Also keep in localStorage for easy access
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token });
  },

  clearAuth: () => {
    // Clear cookies
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },

  isAuthenticated: () => {
    return !!get().token;
  },
}));