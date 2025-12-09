import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState<File | null>(null);

  // Charger les photos depuis l'API
  const fetchPhotos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/gallery");
      setPhotos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des photos !");
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Ajouter une photo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.warning("Veuillez choisir une image.");

    const formData = new FormData();
    formData.append("photo", file);

    try {
      await axios.post("http://localhost:3000/api/gallery", formData);
      setFile(null);
      toast.success("Photo ajoutée !");
      fetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'ajout !");
    }
  };

  // Supprimer une photo
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/gallery/${id}`);
      toast.success("Photo supprimée !");
      fetchPhotos();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div className="mx-auto p-6 mt-5 max-w-5xl">
      {/* Formulaire ajout */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full border p-2 rounded"
        />

        {/* Aperçu image avant ajout */}
        {file && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-64 h-64 object-cover border rounded"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ajouter
        </button>
      </form>

      {/* Liste des photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((p) => (
          <div key={p._id} className="relative border rounded overflow-hidden group">
            <img
              src={`http://localhost:3000/uploads/${p.photo}`}
              alt="gallery"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={() => handleDelete(p._id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 p-2 rounded transition"
            >
              <img src="/delete.svg" alt="supprimer" className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
