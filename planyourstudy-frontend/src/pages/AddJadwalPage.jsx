import { useNavigate } from "react-router-dom";
import JadwalForm from "../components/JadwalForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const AddJadwalPage = () => {
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/jadwal`;

  const handleAddJadwal = async (newJadwal) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJadwal),
    });
    showSuccessToast("Jadwal berhasil ditambahkan!")
    navigate("/dashboard/jadwal"); // Redirect ke List Jadwal setelah submit
  };

  return (
    <JadwalForm onSubmit={handleAddJadwal} onBack={() => navigate("/dashboard/jadwal")} jadwalData={null} />
  );
};

export default AddJadwalPage;
