import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/auth/login`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(API_URL, { email, password });
  
      console.log("Login response:", response.data); // Debugging
  
      if (response.status === 200 && response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Simpan user
  
        onLogin();
        navigate("/dashboard");
      } else {
        setError("Login gagal: Data user tidak tersedia.");
      }
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi nanti.");
      console.error("Login error:", err);
    }
  };  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="backdrop-glass p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-900 text-center mb-6">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-glass"
            required
          />
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
