import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔑 Supprimer les données de session
    localStorage.removeItem("token"); // ou sessionStorage.removeItem("token")
    localStorage.removeItem("user");  // si tu stockes l'utilisateur

    // Redirection vers la page de login
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 w-full text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Déconnexion
    </button>
  );
}
