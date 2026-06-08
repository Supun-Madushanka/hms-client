"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer() {
  const { setAuth, user } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setAuth(parsedUser, token);
      }
    }
  }, []);

  return null;
}