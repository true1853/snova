import React, { createContext, useContext, useEffect, useState } from "react";
import { message } from "antd";

interface AuthContextType {
  token: string | null;
  refreshToken: () => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const logout = () => {
    console.log("🔴 Выполняется выход из системы");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    message.error("Сессия истекла, пожалуйста, войдите снова.");
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("⚠️ Отсутствует refreshToken");
        logout();
        return null;
      }

      console.log("🔄 Запрос обновления токена");
      const response = await fetch("/api/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        console.error("❌ Ошибка обновления токена, статус:", response.status);
        logout();
        return null;
      }

      const data = await response.json();
      console.log("✅ Новый токен получен:", data.token);
      localStorage.setItem("token", data.token);
      setToken(data.token);
      return data.token;
    } catch (error) {
      console.error("❌ Ошибка при обновлении токена:", error);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      console.log("🔍 Проверка наличия токена в localStorage");
      if (!token) {
        console.warn("⚠️ Токен отсутствует, пробую обновить");
        await refreshToken();
      } else {
        console.log("✅ Токен найден, проверка успешна");
      }
    };

    checkToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, refreshToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
