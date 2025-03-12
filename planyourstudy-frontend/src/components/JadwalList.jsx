import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const JadwalList = () => {
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState([]);
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/jadwal`;

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setJadwal(data);
      } catch (error) {
        console.error("Error fetching jadwal:", error);
      }
    };
    fetchJadwal();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setJadwal(jadwal.filter((item) => item.id !== id));
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">📅 Jadwal Kuliah</h2>
      <div className="grid lg:grid-cols-3 gap-4">
        {jadwal.map((item) => (
          <div 
            key={item.id} 
            className="bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-4 rounded-xl flex justify-between items-center border-l-4 border-[#29B6F6]"
          >        
            <div>
              <h3 className="text-lg font-semibold">{item.mataKuliah}</h3>
              <p>🕒 {item.jamKuliah}</p>
              <p>🏫 {item.ruang}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/edit-jadwal/${item.id}`)} 
                className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#F9A825] shadow-md"
              >
                <FaEdit className="mr-0" />
              </button>
              <button 
                onClick={() => handleDelete(item.id)} 
                className="bg-[#E53935] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#D32F2F] shadow-md"
              >
                <FaTrash className="mr-0" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JadwalList;
