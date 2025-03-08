import { useNavigate } from "react-router-dom";
import Profile from "../components/Profile";

const ProfilePage = ({ user }) => {
  const navigate = useNavigate();

  const handleUpdateProfile = (updatedData) => {
    console.log("Profile updated:", updatedData);
    // TODO: Kirim data ke backend untuk update profil user
  };

  return <Profile userData={user} onBack={() => navigate("/dashboard")} onUpdate={handleUpdateProfile} />;
};

export default ProfilePage;
