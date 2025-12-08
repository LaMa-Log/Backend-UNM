import { useState, useEffect } from "react";
import axios from "axios";

interface PrepItem {
  photo: File | string | null;
  photo_title: string;
  photo_desc: string;
}

export default function Preparation({ lang }: { lang: string }) {
  const [form, setForm] = useState({
    id: null,
    title: "",
    title_desc: "",
    preparation: [{ photo: null, photo_title: "", photo_desc: "" }] as PrepItem[],
  });

  const [locked, setLocked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données selon la langue
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/preparation?lang=${lang}`);
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

  const handleChange = (i: number, field: keyof PrepItem, value: string) => {
    if (locked) return;
    const updated = [...form.preparation];
    (updated[i] as any)[field] = value;
    setForm({ ...form, preparation: updated });
  };

  const handlePhoto = (i: number, file: File) => {
    if (locked) return;
    const updated = [...form.preparation];
    updated[i].photo = file;
    setForm({ ...form, preparation: updated });
  };

  const addItem = () => {
    if (form.preparation.length < 5) {
      setForm({
        ...form,
        preparation: [...form.preparation, { photo: null, photo_title: "", photo_desc: "" }],
      });
    }
  };

  const removeItem = (i: number) => {
    const updated = form.preparation.filter((_, idx) => idx !== i);
    setForm({ ...form, preparation: updated });
  };

  const submit = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("id", form.id || "");
      fd.append("lang", lang); // 🔑 envoyer la langue active
      fd.append("title", form.title);
      fd.append("title_desc", form.title_desc);
      fd.append("preparation", JSON.stringify(form.preparation));

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
      {/* {loading && <p className="text-green-600">Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>} */}

      <input
        disabled={locked}
        className="w-full border p-2 rounded-md bg-gray-200 text-gray-900 outline-none"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        disabled={locked}
        className="w-full border p-2 rounded-md bg-gray-200 text-gray-900 outline-none"
        placeholder="Description"
        value={form.title_desc}
        rows={4}
        onChange={(e) => setForm({ ...form, title_desc: e.target.value })}
      />

      {form.preparation.map((item, i) => (
        <div
          key={i}
          className="border p-4 rounded bg-gray-100 space-y-3 md:grid md:grid-cols-2 md:gap-4"
        >
          <div className="flex flex-col items-start">
            {/* Aperçu image */}
            {item.photo && (
              <img
                src={item.photo instanceof File ? URL.createObjectURL(item.photo) : `http://localhost:3000${item.photo}`}
                alt="photo"
                className="w-32 h-32 object-cover mb-2 rounded border"
              />
            )}
            {!locked && (
              <input
                type="file"
                onChange={(e) => handlePhoto(i, e.target.files?.[0] as File)}
                className="mb-2"
              />
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <input
              disabled={locked}
              className="w-full border outline-none p-2 rounded-md bg-gray-200 text-gray-900"
              placeholder="Photo Titre"
              value={item.photo_title}
              onChange={(e) => handleChange(i, "photo_title", e.target.value)}
            />

            <textarea
              disabled={locked}
              className="w-full border outline-none p-2 rounded-md bg-gray-200 text-gray-900"
              placeholder="Photo Desc"
              value={item.photo_desc}
              rows={5}
              onChange={(e) => handleChange(i, "photo_desc", e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              {!locked && (
                <button
                  onClick={() => removeItem(i)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Effacer
                </button>
              )}
              {!locked && form.preparation.length < 5 && (
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Ajouter
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        {locked ? (
          <button
            onClick={() => setLocked(false)}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Modifier
          </button>
        ) : (
          <button
            onClick={submit}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Enregistrer
          </button>
        )}
      </div>
    </div>
  );
}
