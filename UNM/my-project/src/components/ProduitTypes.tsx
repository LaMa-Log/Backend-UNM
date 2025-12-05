// TypesProduit.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function TypesProduit({ produitId }) {
  const { register, handleSubmit, reset } = useForm();
  const [produit, setProduit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [contenus, setContenus] = useState([""]); // items dynamiques

  // Charger les données existantes
  useEffect(() => {
    if (produitId) {
      axios
        .get(`http://localhost:3000/api/typesproduit/${produitId}`)
        .then((res) => {
          setProduit(res.data);
          reset(res.data);

          // Contenus correctement initialisés
          setContenus(
            res.data.contenus && res.data.contenus.length > 0
              ? res.data.contenus
              : [""]
          );
        })
        .catch((err) => console.error(err));
    }
  }, [produitId, reset]);

  // Ajouter un item
  const addContenu = () => setContenus([...contenus, ""]);

  // Modifier un item
  const updateContenu = (index, value) => {
    const newList = [...contenus];
    newList[index] = value;
    setContenus(newList);
  };

  // Supprimer un item
  const removeContenu = (index) =>
    setContenus(contenus.filter((_, i) => i !== index));

  // Envoi formulaire
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("titreProduit", data.titreProduit);
      formData.append("descProduit", data.descProduit);

      if (data.photoProduit && data.photoProduit[0]) {
        formData.append("photoProduit", data.photoProduit[0]);
      }

      // Contenus envoyé en JSON
      formData.append(
  "contenus",
  JSON.stringify(contenus.map(item => ({ titreContenu: item, items: [] })))
);


      if (produitId) {
        await axios.put(
          `http://localhost:3000/api/typesproduit/${produitId}`,
          formData
        );
      } else {
        await axios.post(`http://localhost:3000/api/typesproduit`, formData);
      }

      alert("Données sauvegardées !");
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur envoi :", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-2xl font-bold text-center mb-4">
        Gestion des Types de Produits
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TITRE */}
        <div>
          <label className="block font-medium">Titre principal</label>
          <input
            type="text"
            {...register("titreProduit")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("descProduit")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* PHOTO */}
        <div>
          <label className="block font-medium">Image du produit</label>
          <input
            type="file"
            {...register("photoProduit")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />

          {produit?.photoProduit && (
            <img
              src={`http://localhost:3000/uploads/${produit.photoProduit}`}
              alt="Produit"
              className="mt-3 w-40 h-40 object-cover rounded shadow"
            />
          )}
        </div>

        {/* CONTENUS DYNAMIQUES */}
        <div>
          <label className="block font-medium">Items du contenu</label>

          {contenus.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                disabled={!isEditing}
                onChange={(e) => updateContenu(index, e.target.value)}
                className="flex-1 border p-2 rounded disabled:bg-gray-100"
                placeholder={`Item ${index + 1}`}
              />

              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeContenu(index)}
                  className="text-white bg-red-500 px-3 py-1 rounded"
                >
                  X
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <button
              type="button"
              onClick={addContenu}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              + Ajouter un contenu
            </button>
          )}
        </div>

        {/* BOUTONS */}
        <div className="flex justify-between pt-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Modifier
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Sauvegarder
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
