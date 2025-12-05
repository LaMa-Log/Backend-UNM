import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Engagement({ engagementId }) {
  const { register, handleSubmit, reset } = useForm();
  const [engagement, setEngagement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState([{ name: "" }]);

  // Charger données existantes
  useEffect(() => {
    if (engagementId) {
      axios
        .get(`http://localhost:3000/api/engagement/${engagementId}`)
        .then((res) => {
          setEngagement(res.data);
          reset(res.data);
          setItems(
            res.data.items && res.data.items.length > 0
              ? res.data.items.map((i) => ({ name: i }))
              : [{ name: "" }]
          );
        })
        .catch((err) => console.error(err));
    }
  }, [engagementId, reset]);

  // Gestion items dynamiques
  const addItem = () => setItems([...items, { name: "" }]);
  const updateItem = (index, value) => {
    const newItems = [...items];
    newItems[index].name = value;
    setItems(newItems);
  };
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  // Envoi formulaire
  const onSubmit = async (data) => {
    try {
      const payload = {
        titre1: data.titre1,
        descTitre1: data.descTitre1,
        titre2: data.titre2,
        descTitre2: data.descTitre2,
        items: items.map((i) => i.name),
      };

      if (engagementId) {
        await axios.put(
          `http://localhost:3000/api/engagement/${engagementId}`,
          payload
        );
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-5">
      <h2 className="text-2xl font-bold text-center mb-4">
        Gestion Engagements
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TITRE 1 */}
        <div>
          <label className="block font-medium">Titre 1</label>
          <input
            type="text"
            {...register("titre1")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* DESCRIPTION TITRE 1 */}
        <div>
          <label className="block font-medium">Description Titre 1</label>
          <textarea
            {...register("descTitre1")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* TITRE 2 */}
        <div>
          <label className="block font-medium">Titre 2</label>
          <input
            type="text"
            {...register("titre2")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* DESCRIPTION TITRE 2 */}
        <div>
          <label className="block font-medium">Description Titre 2</label>
          <textarea
            {...register("descTitre2")}
            disabled={!isEditing}
            className="w-full border p-2 rounded disabled:bg-gray-100"
          />
        </div>

        {/* ITEMS DYNAMIQUES */}
        <div>
          <label className="block font-medium">Items</label>
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item.name}
                disabled={!isEditing}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 border p-2 rounded disabled:bg-gray-100"
                placeholder={`Item ${index + 1}`}
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
