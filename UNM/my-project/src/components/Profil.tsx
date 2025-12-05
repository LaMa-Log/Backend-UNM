import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Profil({ lang }) {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    title_desc: "",
    profilePhoto: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef(null);

  // Charger les profils selon la langue
  const fetchProfiles = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/profiles?lang=${lang}`);
      setProfiles(res.data);

      if (res.data.length > 0) {
        const profile = res.data[0];
        setFormData({
          id: profile.id,
          title: profile.title,
          title_desc: profile.title_desc,
          profilePhoto: null,
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [lang]); // recharge quand la langue change

  // Gérer les changements
  const handleChange = (e) => {
    if (!isEditing) return;

    if (e.target.name === "profilePhoto") {
      const file = e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        setFormData({ ...formData, profilePhoto: file });
      } else {
        alert("Veuillez sélectionner uniquement une image !");
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const data = new FormData();
    data.append("id", formData.id);
    data.append("lang", lang); // 🔑 envoyer la langue active
    data.append("title", formData.title);
    data.append("title_desc", formData.title_desc);
    if (formData.profilePhoto) data.append("profilePhoto", formData.profilePhoto);

    try {
      if (formData.id) {
        await axios.put("http://localhost:3000/api/profiles", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("http://localhost:3000/api/profiles", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setIsEditing(false);
      fetchProfiles();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          disabled={!isEditing}
          required
          className={`border p-2 rounded ${!isEditing ? "bg-gray-200" : ""}`}
        />
        <textarea
          name="title_desc"
          placeholder="Description"
          value={formData.title_desc}
          onChange={handleChange}
          disabled={!isEditing}
          required
          rows={5}
          className={`border p-2 rounded ${!isEditing ? "bg-gray-200" : ""}`}
        />

        {/* Aperçu image */}
        <div className="flex items-center gap-3">
          <img
            src={
              formData.profilePhoto
                ? URL.createObjectURL(formData.profilePhoto)
                : "/uploads.png"
            }
            alt="Upload"
            className={`w-32 h-32 object-cover rounded border cursor-pointer ${
              !isEditing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => isEditing && fileInputRef.current.click()}
          />
          <input
            type="file"
            name="profilePhoto"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {isEditing ? "Sauvegarder" : "Modifier"}
        </button>
      </form>

      {!isEditing && (
        <div className="grid grid-cols-1 gap-4">
          {profiles.map((profile, index) => (
            <div key={profile._id || index} className="border p-4 rounded shadow flex bg-green-700">
              <div>
                {profile.profilePhoto && (
                  <img
                    src={`http://localhost:3000${profile.profilePhoto}`}
                    alt={profile.title}
                    className="mb-2 max-w-xl object-cover pr-10 rounded"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-5 items-center justify-center text-white">
                <h4 className="font-bold">{profile.title}</h4>
                <p className="mb-2">{profile.title_desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
