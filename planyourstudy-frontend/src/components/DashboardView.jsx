import { useEffect, useState } from "react";

const DashboardView = () => {
  const [user, setUser] = useState({ username: "Guest" });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        setUser(JSON.parse(storedUser));
      } else {
        localStorage.removeItem("user"); // Hapus jika invalid
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user"); // Hapus jika error
    }
  }, []);

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">🎉 Halo, {user.username}</h2>
      <div className="space-y-4">
        <div className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-4 rounded-xl flex justify-between items-center">
          <p>ON DEVELOPMENT</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
