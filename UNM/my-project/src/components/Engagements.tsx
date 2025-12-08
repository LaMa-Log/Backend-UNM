import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Engagement({ engagementId, lang }) {
  const { register, handleSubmit, reset } = useForm();
  const [engagement, setEngagement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([""]);

  // Charger données existantes selon la langue
  useEffect(() => {
    if (engagementId) {
      axios
        .get(`http://localhost:3000/api/engagement/${engagementId}?lang=${lang}`)
        .then((res) => {
          setEngagement(res.data);
          reset(res.data);
          setItems(res.data.items && res.data.items.length > 0 ? res.data.items : [""]);
        })
        .catch((err) => console.error(err));
    }
  }, [engagementId, lang, reset]);

  // Gestion items dynamiques
  const addItem = () => setItems([...items, ""]);
  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  // Envoi formulaire
  const onSubmit = async (data) => {
    try {
      const payload = {
        lang, // 🔑 langue active
        titre1: data.titre1,
        descTitre1: data.descTitre1,
        titre2: data.titre2,
        descTitre2: data.descTitre2,
        items: items,
      };

      if (engagementId) {
        await axios.put(`http://localhost:3000/api/engagement/${engagementId}`, payload);
      } else {
        await axios.post("http://localhost:3000/api/engagement", payload);
      }

      alert("Données sauvegardées !");
      setIsEditing(false);
    } catch (err) {
      console.error("Erreur envoi :", err);
    }
  };

  return (
    <div className=" mx-auto p-6 shadow-lg rounded-lg mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TITRE 1 */}
        <input
          type="text"
          {...register("titre1")}
          disabled={!isEditing}
          placeholder="Titre 1"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* DESCRIPTION TITRE 1 */}
        <textarea
          {...register("descTitre1")}
          disabled={!isEditing}
          placeholder="Description Titre 1"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* TITRE 2 */}
        <input
          type="text"
          {...register("titre2")}
          disabled={!isEditing}
          placeholder="Titre 2"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* DESCRIPTION TITRE 2 */}
        <textarea
          {...register("descTitre2")}
          disabled={!isEditing}
          placeholder="Description Titre 2"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* ITEMS DYNAMIQUES */}
        <div>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                disabled={!isEditing}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="flex-1 border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
              />
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
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
              onClick={addItem}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
            >
              + Ajouter un item
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
