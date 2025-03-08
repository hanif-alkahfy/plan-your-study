import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReminderForm from "../components/ReminderForm";

const EditReminderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = `https://your-api:5000/api/reminders/${id}`;
  const [reminderData, setReminderData] = useState(null);

  useEffect(() => {
    const fetchReminder = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      setReminderData(data);
    };
    fetchReminder();
  }, [id]);

  const handleUpdateReminder = async (updatedReminder) => {
    await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReminder),
    });
    navigate("/dashboard");
  };

  return <ReminderForm reminderData={reminderData} onSubmit={handleUpdateReminder} onBack={() => navigate("/dashboard")} />;
};

export default EditReminderPage;
