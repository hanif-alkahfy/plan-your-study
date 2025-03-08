import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBell, FaChevronDown, FaHourglassHalf, FaBars, FaList, FaPlus } from "react-icons/fa";


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-blue-100/20 backdrop-blur-md border border-white/30 text-[#01579B] shadow-xl transform ${
        isOpen ? "translate-x-0" : "-translate-x-64"
      } transition-transform duration-300 rounded-r-2xl`}
    >
      {/* Tombol hamburger hanya muncul saat Sidebar terbuka */}
      {isOpen && (
        <button
          onClick={toggleSidebar}
          className="absolute top-6 left-6 text-[#01579B]"
        >
          <FaBars size={24} />
        </button>
      )}

      <div className="p-4 mt-15">
        <h2 className="text-lg font-bold">Menu</h2>
      </div>
      <ul className="mt-4">
        <li className="px-6 py-3 flex items-center justify-between hover:bg-blue-200/40 rounded-lg cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <div className="flex items-center">
            <FaBell className="mr-2" />
            <span>Reminders</span>
          </div>
          <FaChevronDown className={`transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
        </li>
        {dropdownOpen && (
          <ul className="ml-6">
            <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
              <FaList className="mr-2" />
              <Link to="/dashboard">Reminder List</Link>
            </li>
            <li className="px-6 py-2 flex items-center hover:bg-blue-200/40 rounded-lg">
              <FaPlus className="mr-2" />
              <Link to="/add-reminder">Add Reminder</Link>
            </li>
          </ul>
        )}
      </ul>
      <ul>
      <li className="px-6 py-3 flex items-center hover:bg-blue-200/40 rounded-lg">
        <FaHourglassHalf className="mr-2" />
        <span>Coming Soon</span>
      </li>
      <li className="px-6 py-3 flex items-center hover:bg-blue-200/40 rounded-lg">
        <FaHourglassHalf className="mr-2" />
        <span>Coming Soon</span>
      </li>
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
