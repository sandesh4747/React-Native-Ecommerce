import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/clerk-react";
import axiosInstance from "./lib/axios";
import { Navigate, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CustomersPage from "./pages/CustomersPage";
import OrdersPage from "./pages/OrdersPage";
import DashboardLayout from "./layouts/DashboardLayout";
import { LoaderIcon } from "lucide-react";
import PageLoader from "./components/PageLoader";

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <PageLoader />;

  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />}
      />
      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}
      >
        <Route index element={<Navigate to={"/dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
}
