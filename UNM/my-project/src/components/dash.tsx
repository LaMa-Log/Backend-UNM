import { useState } from "react";
import Profil from "./Profil";
import Entreprise from "./QuiSommesNous";
import Preparation from "./Preparation";
import Produit from "./Produit";
import TypesProduit from "./ProduitTypes";
import Engagement from "./Engagements";
import Gallery from "./Gallery";

// Liste des menus
const menuItems = [
  { id: 1, label: "Accueil", text: "Gérer votre page d'accueil", content: (lang) => <Profil lang={lang} /> },
  { id: 2, label: "Qui sommes-nous", text: "Présentation de l'entreprise", content: (lang) => <Entreprise lang={lang} /> },
  { id: 3, label: "Préparation", text: "Nos étapes de préparation", content: (lang) => <Preparation lang={lang} /> },
  { id: 4, label: "Produits", text: "Catalogue de produits", content: (lang) => <Produit lang={lang} /> },
  { id: 5, label: "Types Produits", text: "Classification des produits", content: (lang) => <TypesProduit lang={lang} /> },
  { id: 6, label: "Visions et Valeurs", text: "Nos engagements", content: (lang) => <Engagement lang={lang} /> },
  { id: 7, label: "Mes galleries", text: "Galerie photos", content: (lang) => <Gallery lang={lang} /> }
];

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState(menuItems[0]);
  const [activeLangue, setActiveLangue] = useState("fr");

  const langues = [
    { code: "fr", label: "Français" },
    { code: "en", label: "Anglais" },
    { code: "zh", label: "Mandarin" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r">
        <h2 className="text-xl font-bold text-center py-4 border-b">Tableau de bord</h2>
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveMenu(item)}
                className={`w-full text-left px-5 py-3 hover:bg-gray-200 transition 
                  ${activeMenu.id === item.id ? "bg-gray-200 font-semibold" : ""}`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        {/* Barre langues */}
        <div className="bloc top-0 left-0 right-0 w-full h-12 shadow bg-white flex">
          <ul className="flex justify-evenly items-center text-xl h-full w-full">
            {langues.map((lang) => (
              <li
                key={lang.code}
                onClick={() => setActiveLangue(lang.code)}
                className={`cursor-pointer w-full relative text-center 
                  transition-all duration-300 ease-in-out 
                  ${
                    activeLangue === lang.code
                      ? "bg-green-500 text-white border-b-4 border-green-700"
                      : "bg-yellow-500 text-black border-b-4 border-transparent"
                }`}
              >
                {lang.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-center my-10">
          {activeMenu.text}
        </h1>

        {/* Contenu dynamique */}
        <div className="text-gray-700 text-lg px-6">
          {typeof activeMenu.content === "function"
            ? activeMenu.content(activeLangue)
            : activeMenu.content()}
        </div>
      </div>
    </div>
  );
}
