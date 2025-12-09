import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profil from "./Profil";
import Entreprise from "./QuiSommesNous";
import Preparation from "./Preparation";
import Produit from "./Produit";
import TypesProduit from "./ProduitTypes";
import Engagement from "./Engagements";
import Gallery from "./Gallery";
import LogoutButton from "./logout";

// Liste des menus
const menuItems = [
  { id: 1, label: "Accueil", text: "Gérer votre page d'accueil", content: (lang) => <Profil lang={lang} /> },
  { id: 2, label: "Qui sommes-nous", text: "Présentation de l'entreprise", content: (lang) => <Entreprise lang={lang} /> },
  { id: 3, label: "Préparation", text: "Nos étapes de préparation", content: (lang) => <Preparation lang={lang} /> },
  { id: 4, label: "Produits", text: "Catalogue de produits", content: (lang) => <Produit lang={lang} /> },
  { id: 5, label: "Types Produits", text: "Classification des produits", content: (lang) => <TypesProduit lang={lang} /> },
  { id: 6, label: "Visions et Valeurs", text: "Vision et Valeurs", content: (lang) => <Engagement lang={lang} /> },
  { id: 7, label: "Mes galleries", text: "Galerie photos", content: (lang) => <Gallery lang={lang} /> }
];

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState(menuItems[0]);
  const [activeLangue, setActiveLangue] = useState("fr");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const langues = [
    { code: "fr", label: "Français" },
    { code: "en", label: "Anglais" },
    { code: "zh", label: "Mandarin" },
  ];

  // 🔒 Vérification du token au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // redirection si pas connecté
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar desktop */}
      <div className="hidden md:flex flex-col justify-between w-64 bg-gray-100 shadow-md border-r-2 border-gray-600/50">
        <div>
          <h2 className="text-2xl font-bold text-center bg-gray-200/40 py-4 uppercase">
            Tableau de bord
          </h2>
          <ul className="py-4">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item)}
                  className={`w-full text-left px-5 py-3 hover:bg-gray-200 transition 
                    ${activeMenu.id === item.id ? "bg-green-600 text-white font-semibold" : ""}`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full border-t border-gray-300 ">
          <LogoutButton />
        </div>
      </div>

      {/* Sidebar mobile */}
      <div
        className={`fixed inset-0 z-20 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        ></div>

        <div
          className={`absolute left-0 top-0 h-full w-64 bg-white shadow-md flex flex-col justify-between transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-4 text-red-600 font-bold"
            >
              ✖ Fermer
            </button>
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveMenu(item);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 hover:bg-gray-200 transition 
                      ${activeMenu.id === item.id ? "bg-gray-200 font-semibold" : ""}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full border-t border-gray-300">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto relative">
        <div className="md:hidden p-4 fixed right-0 bottom-0 z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`bg-green-600 text-white px-4 py-2 rounded ${sidebarOpen ? "hidden" : ""}`}
          >
            ☰
          </button>
        </div>

        <div className="sticky top-0 left-0 right-0 shadow bg-white flex">
          <ul className="flex justify-evenly items-center text-xl h-full w-full">
            {langues.map((lang) => (
              <li
                key={lang.code}
                onClick={() => setActiveLangue(lang.code)}
                className={`cursor-pointer w-full relative text-center p-4 transition-all duration-300 ease-in-out 
                  ${activeLangue === lang.code
                    ? "bg-green-500 text-white uppercase font-bold border-b-4 border-green-700"
                    : "bg-gray-100 text-black uppercase font-bold border-b-4 border-transparent"}`}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-10">
          <h1 className="text-3xl font-bold text-center">
            {activeMenu.text}
          </h1>
          <div className="text-gray-700 text-lg px-6">
            {typeof activeMenu.content === "function"
              ? activeMenu.content(activeLangue)
              : activeMenu.content()}
          </div>
        </div>
      </div>
    </div>
  );
}
