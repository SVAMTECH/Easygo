import React from "react";
import { HashRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Vehicles from "./pages/Vehicles";
import AddVehicle from "./pages/AddVehicle";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";

function AppRoutes() {
  const navigate = useNavigate();

  const setCurrentPage = (pageName) => {
    const map = {
      home: "/home",
      login: "/login",
      register: "/register",
      vehicles: "/vehicles",
      "add-vehicle": "/add-vehicle",
      dashboard: "/dashboard",
      payment: "/payment",
      contact: "/contact",
    };

    const path = map[pageName] || "/home";
    navigate(path);
  };

  return (
    <div className="app">
      <Header setCurrentPage={setCurrentPage} />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/home" element={<Home setCurrentPage={setCurrentPage} />} />
          <Route path="/login" element={<Login setCurrentPage={setCurrentPage} />} />
          <Route path="/register" element={<Register setCurrentPage={setCurrentPage} />} />
          <Route path="/vehicles" element={<Vehicles setCurrentPage={setCurrentPage} />} />
          <Route path="/add-vehicle" element={<AddVehicle setCurrentPage={setCurrentPage} />} />
          <Route path="/dashboard" element={<Dashboard setCurrentPage={setCurrentPage} />} />
          <Route path="/payment" element={<Payment setCurrentPage={setCurrentPage} />} />
          <Route path="/contact" element={<Contact setCurrentPage={setCurrentPage} />} />

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
