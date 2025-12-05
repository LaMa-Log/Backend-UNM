import { useState, useEffect } from "react";
import axios from "axios";

export default function Entreprise() {
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

  // Charger les entreprises au montage
  useEffect(() => {
    fetchEntreprises();
  }, []);

  const fetchEntreprises = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/entreprise");
      setEntreprises(res.data);
    } catch (err) {
      console.error("Erreur fetch entreprises :", err);
    }
  };

  const handleChange = (e, index = null, type = null) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("id", formData.id || "");
    data.append("titre", formData.titre);
    data.append("historiques", formData.historiques);
    data.append("theme", formData.theme);
    data.append("piliers", JSON.stringify(formData.piliers));
    data.append("identite", JSON.stringify(formData.identite));
    if (formData.photoIdentite) data.append("photoIdentite", formData.photoIdentite);
    if (formData.photoPiliers) data.append("photoPiliers", formData.photoPiliers);

    try {
      if (formData.id) {
        await axios.put("http://localhost:3000/api/entreprise", data);
      } else {
        await axios.post("http://localhost:3000/api/entreprise", data);
      }
      // Reset formulaire
      setFormData({
        id: null,
        titre: "",
        historiques: "",
        theme: "",
        piliers: [{ titre: "", description: "" }],
        identite: ["", "", ""],
        photoIdentite: null,
        photoPiliers: null,
      });
      fetchEntreprises();
    } catch (err) {
      console.error("Erreur submit entreprise :", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/entreprise/${id}`);
      fetchEntreprises();
    } catch (err) {
      console.error("Erreur delete entreprise :", err);
    }
  };

  const handleEdit = (ent) => {
    setFormData({
      id: ent._id,
      titre: ent.titre,
      historiques: ent.historiques,
      theme: ent.theme,
      piliers: ent.piliers.length ? ent.piliers : [{ titre: "", description: "" }],
      identite: ent.identite.length ? ent.identite : ["", "", ""],
      photoIdentite: null,
      photoPiliers: null,
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Formulaire */}
      <h2 className="text-2xl font-bold mb-4">
        {formData.id ? "Modifier Entreprise" : "Créer Entreprise"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">

        <input
          type="text"
          name="titre"
          placeholder="Titre de l'entreprise"
          value={formData.titre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <textarea
          name="historiques"
          placeholder="Racontez l'histoire de l'entreprise"
          value={formData.historiques}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Identité */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {formData.identite.map((val, i) => (
            <input
              key={i}
              type="text"
              value={val}
              placeholder={`Identité ${i + 1}`}
              onChange={(e) => handleChange(e, i, "identite")}
              className="border p-2 rounded w-full"
            />
          ))}
        </div>

        <input
          type="text"
          name="theme"
          placeholder="Thème de l'entreprise"
          value={formData.theme}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* Upload photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div>
            <label className="block font-medium mb-1">Photo Identité</label>
            <input type="file" name="photoIdentite" onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
          <div>
            <label className="block font-medium mb-1">Photo Piliers</label>
            <input type="file" name="photoPiliers" onChange={handleChange} className="border p-2 rounded w-full" />
          </div>
        </div>

        <button
          type="button"
          onClick={addPilier}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition self-start"
        >
          Ajouter Pilier (max 3)
        </button>

        {/* Piliers */}
        {formData.piliers.map((pilier, i) => (
          <div key={i} className="border p-2 rounded mb-2">
            <input
              type="text"
              name="titre"
              placeholder="Titre du pilier"
              value={pilier.titre}
              onChange={(e) => handleChange(e, i, "pilier")}
              className="border p-2 rounded w-full mb-1"
            />
            <textarea
              name="description"
              placeholder="Description du pilier"
              value={pilier.description}
              onChange={(e) => handleChange(e, i, "pilier")}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {formData.id ? "Modifier" : "Enregistrer"}
        </button>
      </form>

      {/* Liste des entreprises */}
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Entreprises existantes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entreprises.map((ent) => (
          <div key={ent._id} className="border border-gray-200 p-5 rounded-xl shadow-lg bg-white hover:shadow-xl transition">

            <h4 className="text-lg font-bold text-gray-900 mb-2">{ent.titre}</h4>
            <p className="text-gray-700 mb-3">{ent.historiques}</p>
            <p className="text-indigo-600 font-semibold mb-4">Thème: {ent.theme}</p>

            {/* Identités */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {ent.identite.map((id, idx) => (
                  <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">{id}</span>
                ))}
              </div>
              {ent.photoIdentite && (
                <img
                  src={`http://localhost:3000${ent.photoIdentite}`}
                  alt="Identité"
                  className="w-full h-40 object-cover rounded-lg shadow mt-3 border border-gray-200"
                />
              )}
            </div>

            {/* Piliers */}
            <div className="mb-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {ent.piliers.map((p, idx) => (
                  <div key={idx} className="border border-gray-200 p-3 rounded-lg shadow-sm bg-gray-50">
                    <div className="font-semibold text-gray-800 mb-1">{p.titre}</div>
                    <div className="text-gray-700 text-sm">{p.description}</div>
                  </div>
                ))}
              </div>
              {ent.photoPiliers && (
                <img
                  src={`http://localhost:3000${ent.photoPiliers}`}
                  alt="Piliers"
                  className="w-full h-40 object-cover rounded-lg shadow mt-3 border border-gray-200"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(ent)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(ent._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
