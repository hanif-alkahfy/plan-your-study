import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ReminderList from "../components/ReminderList";

const Dashboard = ({ onLogout }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen w-screen flex transition-all duration-300">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 p-6 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
      <Navbar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onLogout={onLogout}/>
      <div className="">
        <ReminderList />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
