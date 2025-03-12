import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import JadwalForm from "../components/JadwalForm";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";

const EditJadwalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = `${import.meta.env.VITE_BASE_API_URL}/jadwal/${id}`;
  const [jadwalData, setJadwalData] = useState(null);

  useEffect(() => {
    const fetchJadwal = async () => {
      const response = await fetch(API_URL);
      const data = await response.json();
      setJadwalData(data);
    };
    fetchJadwal();
  }, [id]);

  const handleUpdateJadwal = async (updatedJadwal) => {
    await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedJadwal),
    });
    showSuccessToast("Jadwal berhasil diperbaharui!")
    navigate("/dashboard/jadwal");
  }

  return (
    <JadwalForm jadwalData={jadwalData} onSubmit={handleUpdateJadwal} onBack={() => navigate("/dashboard/jadwal")} />
  );
};

export default EditJadwalPage;
