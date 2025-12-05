import { useState } from "react";
import Profil from "./Profil";
import Entreprise from "./QuiSommesNous";
import Preparation from "./Preparation";
import Produit from "./Produit";
import TypesProduit from "./ProduitTypes";
import Engagement from "./Engagements";
import Gallery from "./Gallery"




// Liste des menus
const menuItems = [
  { id: 1, label: "Accueil", text: "Gérer votre page d'accueil", content: (lang) => <Profil lang={lang} /> },
  { id: 2, label: "Qui sommes-nous", content: () => <Entreprise /> },
  { id: 3, label: "Préparation", content: () => <Preparation /> },
  { id: 4, label: "Produits", content: () => <Produit /> },
  { id: 5, label: "Types Produits", content: () => <TypesProduit /> },
  { id: 6, label: "Visions et Valeurs", content: () => <Engagement /> },
  { id: 7, label: "Mes galleries", content: () => <Gallery /> }
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
      <div className="w-60 bg-white shadow-md border-r">
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
        <div className="bloc top-0 left-0 right-0 w-full h-12">
          <ul className="flex justify-evenly items-center text-xl h-full ">
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

        <h1 className="text-3xl font-bold text-center my-10">
          {activeMenu.text}
        </h1>

       <div className="text-gray-700 text-lg">
          {typeof activeMenu.content === "function"
            ? activeMenu.content(activeLangue)
            : activeMenu.content()}
        </div>
      </div>
    </div>
  );
}
