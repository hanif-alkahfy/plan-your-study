import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import AddReminderPage from "../pages/AddReminderPage";
import EditReminderPage from "../pages/EditReminderPage";
import ProfilePage from "../pages/ProfilePage";

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleLogout = () => {
    console.log("Logging out..."); // Debugging 1
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
  
    console.log("isAuthenticated in localStorage:", localStorage.getItem("isAuthenticated")); // Debugging 2
  
    setIsAuthenticated(false);
    console.log("State isAuthenticated setelah logout:", isAuthenticated); // Debugging 3
  
    window.location.href = "/"; // Paksa reload agar state benar-benar direset
  };
  

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
      <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />} />
      <Route path="/add-reminder" element={isAuthenticated ? <AddReminderPage /> : <Navigate to="/" replace />} />
      <Route path="/edit-reminder/:id" element={isAuthenticated ? <EditReminderPage /> : <Navigate to="/" replace />} />
      <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
