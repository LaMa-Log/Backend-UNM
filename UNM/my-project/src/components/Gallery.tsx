import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);

  // Charger les photos
  const fetchPhotos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/gallery");
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Ajouter une photo
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Veuillez choisir une image.");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.post("http://localhost:3000/api/gallery", formData);
      setFile(null);
      fetchPhotos(); // rafraîchir la liste
    } catch (err) {
      console.error(err);
    }
  };

  // Supprimer une photo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/gallery/${id}`);
      fetchPhotos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto p-6 mt-5">
      {/* Formulaire ajout */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </form>

      {/* Liste des photos */}
      <div className="grid grid-cols-2 gap-4">
        {photos.map((p) => (
          <div key={p._id} className="relative border rounded overflow-hidden">
            <img
              src={`http://localhost:3000/uploads/${p.photo}`}
              alt="gallery"
              className="w-full h-80 object-cover"
            />
            <button
              onClick={() => handleDelete(p._id)}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
