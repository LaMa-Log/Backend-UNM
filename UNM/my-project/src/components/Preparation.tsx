import { useState, useEffect } from "react";
import axios from "axios";

interface PrepItem {
  photo: File | string | null;
  photo_title: string;
  photo_desc: string;
}

export default function Preparation({ lang }: { lang: string }) {
  const [form, setForm] = useState({
    id: null as number | null,
    title: "",
    title_desc: "",
    preparation: [{ photo: null, photo_title: "", photo_desc: "" }] as PrepItem[],
  });

  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données depuis API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:3000/api/preparation?lang=${lang}`
        );

        if (res.data.length > 0) {
          const data = res.data[0];

          setForm({
            id: data.id,
            title: data.title,
            title_desc: data.title_desc,
            preparation: data.preparation.map((p: any) => ({
              photo: p.photo,
              photo_title: p.photo_title,
              photo_desc: p.photo_desc,
            })),
          });
        }
      } catch (err) {
        setError("Erreur de récupération des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);


  // Modification d’un champ texte
  const handleChange = (i: number, field: keyof PrepItem, value: string) => {
    if (locked) return;
    const updated = [...form.preparation];
    updated[i][field] = value;
    setForm({ ...form, preparation: updated });
  };

  // Upload d’une image
  const handlePhoto = (i: number, file: File) => {
    if (locked) return;
    const updated = [...form.preparation];
    updated[i].photo = file;
    setForm({ ...form, preparation: updated });
  };

  // Ajouter un item (max 5)
  const addItem = () => {
    if (form.preparation.length < 5) {
      setForm({
        ...form,
        preparation: [...form.preparation,
          { photo: null, photo_title: "", photo_desc: "" }
        ],
      });
    }
  };

  // Supprimer un item
  const removeItem = (i: number) => {
    const updated = form.preparation.filter((_, idx) => idx !== i);
    setForm({ ...form, preparation: updated });
  };

  // Sauvegarde API
  const submit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();

      fd.append("id", form.id || "");
      fd.append("lang", lang);
      fd.append("title", form.title);
      fd.append("title_desc", form.title_desc);
      fd.append("preparation", JSON.stringify(form.preparation));

      // Ajouter les fichiers
      form.preparation.forEach((item) => {
        if (item.photo instanceof File) {
          fd.append("photos", item.photo);
        }
      });

      if (form.id) {
        await axios.put("http://localhost:3000/api/preparation", fd);
      } else {
        await axios.post("http://localhost:3000/api/preparation", fd);
      }

      alert("Enregistré !");
      setLocked(true);
    } catch (err) {
      setError("Erreur lors de l’enregistrement");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 space-y-6">

      {/* TITRE */}
      <input
        disabled={locked}
        className="w-full border p-2 rounded-md bg-gray-200 outline-none"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* DESCRIPTION */}
      <textarea
        disabled={locked}
        className="w-full border p-2 rounded-md bg-gray-200 outline-none"
        placeholder="Description"
        rows={4}
        value={form.title_desc}
        onChange={(e) => setForm({ ...form, title_desc: e.target.value })}
      />

      {/* ITEMS */}
      {form.preparation.map((item, i) => (
        <div
          key={i}
          className="border p-4 rounded bg-gray-100 space-y-3 md:grid md:grid-cols-2 md:gap-4"
        >
          {/* IMAGE PREVIEW + UPLOAD */}
          <div className="flex flex-col items-start">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id={`file_${i}`}
              disabled={locked}
              onChange={(e) => handlePhoto(i, e.target.files?.[0] as File)}
            />

            <div
              className={`w-32 h-32 rounded border flex items-center justify-center overflow-hidden ${
                locked ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105 transition"
              }`}
              onClick={() =>
                !locked && document.getElementById(`file_${i}`)?.click()
              }
            >
              {item.photo ? (
                <img
                  src={
                    item.photo instanceof File
                      ? URL.createObjectURL(item.photo)
                      : `http://localhost:3000${item.photo}`
                  }
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img src="/upload.png" className="w-16 h-16 opacity-60" />
              )}
            </div>
          </div>

          {/* TEXTES */}
          <div className="flex flex-col space-y-2">
            <input
              disabled={locked}
              className="w-full border p-2 rounded-md bg-gray-200 outline-none"
              placeholder="Photo Titre"
              value={item.photo_title}
              onChange={(e) => handleChange(i, "photo_title", e.target.value)}
            />

            <textarea
              disabled={locked}
              className="w-full border p-2 rounded-md bg-gray-200 outline-none"
              placeholder="Photo Description"
              rows={5}
              value={item.photo_desc}
              onChange={(e) => handleChange(i, "photo_desc", e.target.value)}
            />

            {/* BOUTONS AJOUT / SUPPRESSION */}
            {!locked && (
              <div className="flex justify-end gap-3">

                {/* Supprimer */}
                {form.preparation.length > 1 && (
                  <button
                    onClick={() => removeItem(i)}
                    className="p-2 bg-red-600 rounded hover:bg-red-700"
                  >
                    <img src="/delete.svg" className="w-4 h-4" />
                  </button>
                )}

                {/* Ajouter */}
                {i === form.preparation.length - 1 && form.preparation.length < 5 && (
                  <button
                    onClick={addItem}
                    className="p-2 bg-green-600 rounded hover:bg-green-700"
                  >
                    <img src="/add.svg" className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* BOUTON FINAL */}
      <div className="flex justify-center">
        {locked ? (
          <button
            onClick={() => setLocked(false)}
            className="bg-green-600 w-full text-white px-6 py-2 rounded"
          >
            Modifier
          </button>
        ) : (
          <button
            onClick={submit}
            className="bg-blue-600 w-full text-white px-6 py-2 rounded"
          >
            Sauvegarder
          </button>
        )}
      </div>
    </div>
  );
}
