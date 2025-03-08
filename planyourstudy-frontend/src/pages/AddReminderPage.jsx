import { useNavigate } from "react-router-dom";
import ReminderForm from "../components/ReminderForm";

const AddReminderPage = () => {
  const navigate = useNavigate();
  const API_URL = "http://182.2.70.69:5000/api/reminders";

  const handleAddReminder = async (newReminder) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReminder),
    });
    navigate("/dashboard");
  };

  return <ReminderForm onSubmit={handleAddReminder} onBack={() => navigate("/dashboard")} />;
};

export default AddReminderPage;
