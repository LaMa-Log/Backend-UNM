import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Entreprise({ lang }) {
  const [entreprises, setEntreprises] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    titre: "",
    historiques: "",
    theme: "",
    piliers: [{ titre: "", description: "" }],
    identite: ["", "", ""],
    photoIdentite: null,
    photoPiliers: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputIdentite = useRef(null); 
  const fileInputPiliers = useRef(null); 

  // Charger les entreprises selon la langue
  const fetchEntreprises = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/entreprise?lang=${lang}`
      );

      setEntreprises(res.data);

      if (res.data.length > 0) {
        const ent = res.data[0];
        setFormData({
          id: ent.id,
          titre: ent.titre,
          historiques: ent.historiques,
          theme: ent.theme,
          piliers: ent.piliers.length
            ? ent.piliers
            : [{ titre: "", description: "" }],
          identite: ent.identite.length ? ent.identite : ["", "", ""],
          photoIdentite: null,
          photoPiliers: null,
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Erreur fetch entreprises :", err);
    }
  };

  useEffect(() => {
    fetchEntreprises();
  }, [lang]);

  const handleChange = (e, index = null, type = null) => {
    if (!isEditing) return;

    const { name, value, files } = e.target;

    if (name === "photoIdentite" || name === "photoPiliers") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "pilier") {
      const newPiliers = [...formData.piliers];
      newPiliers[index][name] = value;
      setFormData({ ...formData, piliers: newPiliers });
    } else if (type === "identite") {
      const newIdentite = [...formData.identite];
      newIdentite[index] = value;
      setFormData({ ...formData, identite: newIdentite });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addPilier = () => {
    if (formData.piliers.length < 3) {
      setFormData({
        ...formData,
        piliers: [...formData.piliers, { titre: "", description: "" }],
      });
    }
  };

  const removePilier = (index) => {
    if (formData.piliers.length > 1) {
      const newPiliers = formData.piliers.filter((_, i) => i !== index);
      setFormData({ ...formData, piliers: newPiliers });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const data = new FormData();
    data.append("id", formData.id || "");
    data.append("lang", lang);
    data.append("titre", formData.titre);
    data.append("historiques", formData.historiques);
    data.append("theme", formData.theme);
    data.append("piliers", JSON.stringify(formData.piliers));
    data.append("identite", JSON.stringify(formData.identite));

    if (formData.photoIdentite)
      data.append("photoIdentite", formData.photoIdentite);

    if (formData.photoPiliers)
      data.append("photoPiliers", formData.photoPiliers);

    try {
      if (formData.id) {
        await axios.put("http://localhost:3000/api/entreprise", data);
      } else {
        await axios.post("http://localhost:3000/api/entreprise", data);
      }
      setIsEditing(false);
      fetchEntreprises();
    } catch (err) {
      console.error("Erreur submit entreprise :", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* FORMULAIRE */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        
        {/* Titre */}
        <input
          type="text"
          name="titre"
          placeholder="Titre de l'entreprise"
          value={formData.titre}
          onChange={handleChange}
          disabled={!isEditing}
          className={`border p-2 rounded w-full ${
            !isEditing ? "bg-gray-200" : ""
          }`}
        />

        {/* Historiques */}
        <textarea
          name="historiques"
          placeholder="Histoire de l'entreprise"
          value={formData.historiques}
          onChange={handleChange}
          disabled={!isEditing}
          rows={8}
          className={`border p-2 rounded w-full ${
            !isEditing ? "bg-gray-200" : ""
          }`}
        />

        {/* IDENTITE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {formData.identite.map((val, i) => (
            <input
              key={i}
              type="text"
              value={val}
              placeholder={`Identité ${i + 1}`}
              onChange={(e) => handleChange(e, i, "identite")}
              disabled={!isEditing}
              className={`border p-2 rounded w-full ${
                !isEditing ? "bg-gray-200" : ""
              }`}
            />
          ))}
        </div>

        {/* Thème */}
        <input
          type="text"
          name="theme"
          placeholder="Thème"
          value={formData.theme}
          onChange={handleChange}
          disabled={!isEditing}
          className={`border p-2 rounded w-full ${
            !isEditing ? "bg-gray-200" : ""
          }`}
        />

         {/* Aperçu image Piliers */}
        <div className="flex justify-evenly items-center">
         <div className="flex items-center gap-3">
         
           <img
             src={
               formData.photoPiliers
                 ? URL.createObjectURL(formData.photoPiliers)
                 : entreprises[0]?.photoPiliers
                 ? `http://localhost:3000${entreprises[0].photoPiliers}`
                 : "/uploads.png"
             }
             alt="Photo Identité"
             className={`w-32 h-32 object-cover rounded border cursor-pointer ${
               !isEditing ? "opacity-50 cursor-not-allowed" : ""
             }`}
             onClick={() => isEditing && fileInputPiliers.current.click()}
          />
         
           <input
             type="file"
             name="photoIdentite"
             accept="image/*"
             ref={fileInputPiliers}
             onChange={handleChange}
             className="hidden"
           />
         
         </div>

          {/* Aperçu image Identité */}
          <div className="flex items-center gap-3">
         
           <img
             src={
               formData.photoIdentite
                 ? URL.createObjectURL(formData.photoIdentite)
                 : entreprises[0]?.photoIdentite
                 ? `http://localhost:3000${entreprises[0].photoIdentite}`
                 : "/uploads.png"
             }
             alt="Photo Identité"
             className={`w-32 h-32 object-cover rounded border cursor-pointer ${
               !isEditing ? "opacity-50 cursor-not-allowed" : ""
             }`}
             onClick={() => isEditing && fileInputIdentite.current.click()}
          />
         
           <input
             type="file"
             name="photoIdentite"
             accept="image/*"
             ref={fileInputIdentite}
             onChange={handleChange}
             className="hidden"
           />
         
         </div>
         </div>



        {/* PILIERS */}
        <div className="mb-4 ">
          <div className="space-y-4">
            {formData.piliers.map((pilier, idx) => (
              <div
                key={idx}
                className="border p-3 rounded-lg shadow-sm bg-gray-50 relative"
              >
                {/* Titre pilier */}
                <input
                  type="text"
                  name="titre"
                  placeholder="Titre du pilier"
                  value={pilier.titre}
                  onChange={(e) => handleChange(e, idx, "pilier")}
                  disabled={!isEditing}
                  className={`border p-2 rounded w-full mb-2 ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                />

                {/* Description pilier */}
                <textarea
                  name="description"
                  placeholder="Description du pilier"
                  value={pilier.description}
                  onChange={(e) => handleChange(e, idx, "pilier")}
                  disabled={!isEditing}
                  className={`border p-2 rounded w-full ${
                    !isEditing ? "bg-gray-200" : ""
                  }`}
                />
                <div className="flex justify-end items-start space-x-1">
                  
                {/* Bouton supprimer */}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removePilier(idx)}
                    className ="bg-gray-100 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <img src="/delete.svg" alt="supprimer" className="w-4 h-4 transition-all hover:cursor-pointer" />
                  </button>
                )}

                {/* Bouton + */}
                  {isEditing && formData.piliers.length < 3 && (
                    <div className="flex justify-end ">
                      <button
                        type="button"
                        onClick={addPilier}
                        className ="bg-gray-100 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                      >
                        <img src="/add.svg" alt="ajoute" className="w-4 h-4 transition-all hover:cursor-pointer" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Bouton principal */}
        <button
          type="submit"
          className={`px-4 py-2 rounded ${
            isEditing
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isEditing ? "Sauvegarder" : "Modifier"}
        </button>
      </form>

      {/* LISTE ENTREPRISES */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {entreprises.map((ent) => (
            <div
              key={ent.id}
              className="border p-5 rounded-xl shadow-lg bg-white hover:shadow-xl transition"
            >
              <h4 className="text-lg font-bold mb-2">{ent.titre}</h4>
              <p className="text-gray-700 mb-3">{ent.historiques}</p>
              <p className="font-semibold text-indigo-600 mb-4">
                Thème: {ent.theme}
              </p>

              {/* Identité */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {ent.identite.map((id, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                      {id}
                    </span>
                  ))}
                </div>
              </div>

              {/* Boutons actions */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setFormData({
                      id: ent.id,
                      titre: ent.titre,
                      historiques: ent.historiques,
                      theme: ent.theme,
                      piliers: ent.piliers,
                      identite: ent.identite,
                      photoIdentite: null,
                      photoPiliers: null,
                    });
                    setIsEditing(false);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Modifier
                </button>

                <button
                  onClick={async () => {
                    try {
                      await axios.delete(
                        `http://localhost:3000/api/entreprise/${ent.id}`
                      );
                      fetchEntreprises();
                    } catch (err) {
                      console.error("Erreur delete entreprise :", err);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
