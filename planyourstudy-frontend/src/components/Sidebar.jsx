import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaBell, FaChevronDown, FaHourglassHalf, FaBars, FaHome, FaList, FaPlus } from "react-icons/fa";


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [reminderDropdownOpen, setReminderDropdownOpen] = useState(false);
  const [jadwalDropdownOpen, setJadwalDropdownOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-blue-100/20 backdrop-blur-md border border-white/30 text-[#01579B] shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 rounded-r-2xl z-50`} // Tambahkan z-50
    >
      {/* Tombol hamburger hanya muncul saat Sidebar terbuka */}
      {isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-13 left-6 text-[#01579B]"
        >
          <FaBars size={24} />
        </button>
      )}

      <ul className="mt-30">
      <li className="px-6 py-3 flex items-center hover:bg-blue-200/40 rounded-lg">
        <FaHome className="mr-2" />
        <Link to="/dashboard">Dashboard</Link>
      </li>
        <li className="px-6 py-3 flex items-center justify-between hover:bg-blue-200/40 rounded-lg cursor-pointer" onClick={() => setReminderDropdownOpen(!reminderDropdownOpen)}>
          <div className="flex items-center">
            <FaBell className="mr-2" />
            <span>Reminders</span>
          </div>
          <FaChevronDown className={`transition-transform duration-300 ${reminderDropdownOpen ? "rotate-180" : ""}`} />
        </li>
        {reminderDropdownOpen && (
          <ul className="ml-6">
            <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
              <FaList className="mr-2" />
              <Link to="/dashboard/reminders">Reminder List</Link>
            </li>
            <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
              <FaPlus className="mr-2" />
              <Link to="/add-reminder">Add Reminder</Link>
            </li>
          </ul>
        )}
      </ul>
      <ul>
      <li className="px-6 py-3 flex items-center justify-between hover:bg-blue-200/40 rounded-lg cursor-pointer" 
          onClick={() => setJadwalDropdownOpen(!jadwalDropdownOpen)}>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2" />
          <span>Jadwal Kuliah</span>
        </div>
        <FaChevronDown className={`transition-transform duration-300 ${jadwalDropdownOpen ? "rotate-180" : ""}`} />
      </li>
      {jadwalDropdownOpen && (
        <ul className="ml-6">
          <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
            <FaList className="mr-2" />
            <Link to="/dashboard/jadwal">List Jadwal</Link>
          </li>
          <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
            <FaPlus className="mr-2" />
            <Link to="/add-jadwal">Add Jadwal</Link>
          </li>
        </ul>
      )}
      <li className="px-6 py-3 flex items-center hover:bg-blue-200/40 rounded-lg">
        <FaHourglassHalf className="mr-2" />
        <span>Coming Soon</span>
      </li>
      <li className="px-6 py-3 flex items-center hover:bg-blue-200/40 rounded-lg">
        <FaHourglassHalf className="mr-2" />
        <span>Coming Soon</span>
      </li>
      </ul>
    </div>
  );
};

export default Sidebar;
