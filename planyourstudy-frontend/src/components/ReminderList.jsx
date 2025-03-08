import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const ReminderList = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState([]);
  const API_URL = "http://192.168.43.66:5000/api/reminders";

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setReminders(data);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };
    fetchReminders();
  }, []);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setReminders(reminders.filter((reminder) => reminder.id !== id));
  };

  return (
    <div className="mt-5">
      <h2 className="text-3xl font-bold text-[#01579B] mb-6">📌 Reminder List</h2>
      <div className="space-y-4">
        {reminders.map((reminder) => (
          <div 
          key={reminder.id} 
          className={`bg-white/30 backdrop-blur-md border border-white/30 shadow-lg p-4 rounded-xl flex justify-between items-center 
          ${reminder.status === "sent" ? "border-l-4 border-[#43A047]" : "border-l-4 border-[#29B6F6]"}`}
        >        
            <div>
              <h3 className="text-lg font-semibold">{reminder.mataKuliah}</h3>
              <p>{reminder.tugas}</p>
              <p className="text-sm text-gray-500">📅 {new Date(reminder.deadline).toLocaleDateString("id-ID")}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/edit-reminder/${reminder.id}`)} 
                className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:bg-[#F9A825] shadow-md"
              >
                <FaEdit className="mr-0" />
              </button>
              <button 
                onClick={() => handleDelete(reminder.id)} 
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

export default ReminderList;
