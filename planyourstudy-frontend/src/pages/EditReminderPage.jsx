import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ReminderForm from "../components/ReminderForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const EditReminderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/reminders/${id}`;
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
    //showSuccessToast("Alert berhasil diperbaharui!")
    navigate("/dashboard/reminders");
  };

  return <ReminderForm reminderData={reminderData} onSubmit={handleUpdateReminder} onBack={() => navigate("/dashboard/reminders")} />;
};

export default EditReminderPage;
