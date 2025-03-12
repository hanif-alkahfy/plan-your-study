import { useNavigate } from "react-router-dom";
import ReminderForm from "../components/ReminderForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const AddReminderPage = () => {
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/reminders`;

  const handleAddReminder = async (newReminder) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    });
    //showSuccessToast("Alert berhasil ditambahkan!")
    navigate("/dashboard/reminders");
  };

  return <ReminderForm onSubmit={handleAddReminder} onBack={() => navigate("/dashboard/reminders")} />;
};

export default AddReminderPage;
