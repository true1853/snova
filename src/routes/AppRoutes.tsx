import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Analytics from "../pages/Analytics";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Recommendations from "../pages/Recommendations";
import Account from "../pages/Account";
import AIHelp from "../pages/AIHelp";
import Auth from "../pages/Auth";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Авторизация (без основного лейаута) */}
      <Route path="/auth" element={<Auth />} />

      {/* Основной лейаут для всех остальных страниц */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/account" element={<Account />} />
        <Route path="/ai-help" element={<AIHelp />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
