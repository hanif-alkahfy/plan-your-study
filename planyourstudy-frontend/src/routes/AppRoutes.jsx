import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Dashboard from "../pages/Dashboard";
import DashboardView from "../components/DashboardView";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import ReminderList from "../components/ReminderList";
import AddReminderPage from "../pages/AddReminderPage";
import EditReminderPage from "../pages/EditReminderPage";
import JadwalList from "../components/JadwalList";
import AddJadwalPage from "../pages/AddJadwalPage";
import EditJadwalPage from "../pages/EditjadwalPage";
import SetUpBot from "../pages/SetUpBot";

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
    <>
      <ToastContainer autoClose={2000} /> {/* Notifikasi toast */}

      <Routes>
        {/* Redirect "/" ke "/dashboard" jika sudah login */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />

        <Route path="/register" element={<RegisterPage />} />

        {/* Dashboard sebagai parent untuk nested routes */}
        <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" replace />}>
          <Route index element={<DashboardView />} /> {/* Default saat masuk "/dashboard" */}
          <Route path="reminders" element={<ReminderList />} />
          <Route path="add-reminder" element={<AddReminderPage />} />
          <Route path="edit-reminder/:id" element={<EditReminderPage />} />
          <Route path="jadwal" element={<JadwalList />} />
          <Route path="add-jadwal" element={<AddJadwalPage />} />
          <Route path="edit-jadwal/:id" element={<EditJadwalPage />} />
          <Route path="setup-bot" element={<SetUpBot />} />
        </Route>

        {/* Halaman Profile */}
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />} />

        {/* Catch-all route untuk 404 Not Found */}
        <Route path="*" element={<h1 className="text-center text-red-500 text-3xl">404 - Page Not Found</h1>} />
      </Routes>
    </>
  );
};

export default AppRoutes;
