import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function TypesProduit({ produitId, lang }) {
  const { register, handleSubmit, reset } = useForm();
  const [produit, setProduit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Deux qualités avec leurs champs
  const [qualites, setQualites] = useState([
    { titreContenu: "", descContenu: "", items: [""], photoContenu: null },
    { titreContenu: "", descContenu: "", items: [""], photoContenu: null },
  ]);

  // Charger les données existantes
  useEffect(() => {
    if (produitId) {
      axios
        .get(`http://localhost:3000/api/typesproduit/${produitId}?lang=${lang}`)
        .then((res) => {
          setProduit(res.data);
          reset(res.data);

          if (res.data.qualites && res.data.qualites.length === 2) {
            setQualites(
              res.data.qualites.map((q) => ({
                titreContenu: q.titreContenu,
                descContenu: q.descContenu,
                items: q.items.length > 0 ? q.items : [""],
                photoContenu: q.photoContenu || null,
              }))
            );
          }
        })
        .catch((err) => console.error(err));
    }
  }, [produitId, lang, reset]);

  // Gestion des items
  const addItem = (qIndex) => {
    const newQualites = [...qualites];
    newQualites[qIndex].items.push("");
    setQualites(newQualites);
  };

  const updateItem = (qIndex, iIndex, value) => {
    const newQualites = [...qualites];
    newQualites[qIndex].items[iIndex] = value;
    setQualites(newQualites);
  };

  const removeItem = (qIndex, iIndex) => {
    const newQualites = [...qualites];
    newQualites[qIndex].items = newQualites[qIndex].items.filter((_, i) => i !== iIndex);
    setQualites(newQualites);
  };

  const handlePhoto = (qIndex, file) => {
    const newQualites = [...qualites];
    newQualites[qIndex].photoContenu = file;
    setQualites(newQualites);
  };

  // Envoi formulaire
  const onSubmit = async (data) => {
    try {
      if (!data.titreProduit || !qualites[0].titreContenu || !qualites[1].titreContenu) {
        alert("Veuillez remplir le titre principal et les titres des deux qualités");
        return;
      }

      const formData = new FormData();
      formData.append("lang", lang);
      formData.append("titreProduit", data.titreProduit);
      formData.append("descProduit", data.descProduit);

      formData.append(
        "qualites",
        JSON.stringify(
          qualites.map((q) => ({
            titreContenu: q.titreContenu,
            descContenu: q.descContenu,
            items: Array.isArray(q.items) ? q.items : [],
          }))
        )
      );

      qualites.forEach((q) => {
        if (q.photoContenu instanceof File) {
          formData.append("photos", q.photoContenu);
        }
      });

      if (produitId) {
        await axios.put(`http://localhost:3000/api/typesproduit/${produitId}`, formData);
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
    <div className="mx-auto p-6 shadow-lg rounded-lg mt-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* TITRE PRINCIPAL */}
        <input
          type="text"
          {...register("titreProduit")}
          disabled={!isEditing}
          placeholder="Titre principal"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* DESCRIPTION PRINCIPALE */}
        <textarea
          {...register("descProduit")}
          disabled={!isEditing}
          placeholder="Description principale"
          className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200"
        />

        {/* GRID 2 colonnes pour les deux qualités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {qualites.map((q, qIndex) => (
            <div key={qIndex} className="p-4 rounded-lg border bg-green-50 shadow">
              <h3 className="text-lg text-center font-bold text-green-700 mb-3">
                {qIndex === 0 ? "Qualité 1" : "Qualité 2"}
              </h3>

              <input
                type="text"
                value={q.titreContenu}
                disabled={!isEditing}
                onChange={(e) => {
                  const newQualites = [...qualites];
                  newQualites[qIndex].titreContenu = e.target.value;
                  setQualites(newQualites);
                }}
                placeholder="Titre de contenu"
                className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200 mb-2"
              />

              <textarea
                value={q.descContenu}
                disabled={!isEditing}
                onChange={(e) => {
                  const newQualites = [...qualites];
                  newQualites[qIndex].descContenu = e.target.value;
                  setQualites(newQualites);
                }}
                placeholder="Description de contenu"
                className="w-full border p-2 rounded bg-gray-700/10 disabled:bg-gray-200 mb-2"
              />

              {/* Items dynamiques */}
              {q.items.map((item, iIndex) => (
                <div key={iIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    disabled={!isEditing}
                    onChange={(e) => updateItem(qIndex, iIndex, e.target.value)}
                    placeholder={`Item ${iIndex + 1}`}
                    className="flex-1 border px-2 py-1 text-sm rounded bg-gray-700/10 disabled:bg-gray-200"
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeItem(qIndex, iIndex)}
                      className="text-white bg-red-500 px-3 py-1 rounded"
                    >
                      <img src="/delete.svg" alt="supprimer" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {isEditing && (
                <button
                  type="button"
                  onClick={() => addItem(qIndex)}
                  className="bg-green-600 text-white px-3 py-1 rounded mt-2"
                >
                  <img src="/add.svg" alt="ajoute" className="w-4 h-4" />
                </button>
              )}

              {/* Photo de la qualité */}
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={
                    q.photoContenu instanceof File
                      ? URL.createObjectURL(q.photoContenu)
                      : q.photoContenu
                      ? `http://localhost:3000${q.photoContenu}`
                      : "/uploads.png"
                  }
                  alt={`Photo Qualité ${qIndex + 1}`}
                  className={`w-32 h-32 object-cover rounded border ${
                    !isEditing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={() => isEditing && document.getElementById(`fileInput-${qIndex}`).click()}
                />

                <input
                  type="file"
                  id={`fileInput-${qIndex}`}
                  accept="image/*"
                  disabled={!isEditing}
                  className="hidden"
                  onChange={(e) => handlePhoto(qIndex, e.target.files[0])}
                />
              </div>
            </div>
          ))}
        </div>

        {/* BOUTONS */}
        <div className="flex justify-between pt-4">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-500 text-white px-4 py-2 rounded"
            >
              Modifier
            </button>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-600  text-white px-4 py-2 rounded"
            >
              Sauvegarder
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
