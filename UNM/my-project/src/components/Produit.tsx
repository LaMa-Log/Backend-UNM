import { useState, useEffect } from "react";
import axios from "axios";

interface PrepItem {
  photo: File | string | null;
  photo_title: string;
  photo_desc: string;
}

export default function Produit({ lang }: { lang: string }) {
  const EMPTY_ITEMS: PrepItem[] = [
    { photo: null, photo_title: "", photo_desc: "" },
    { photo: null, photo_title: "", photo_desc: "" },
    { photo: null, photo_title: "", photo_desc: "" },
    { photo: null, photo_title: "", photo_desc: "" },
  ];

  const [form, setForm] = useState({
    title: "",
    title_desc: "",
    preparation: EMPTY_ITEMS,
  });

  const [locked, setLocked] = useState(true);
  const [dbId, setDbId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/produit?lang=${lang}`);
        if (res.data.length > 0) {
          const data = res.data[0];
          setDbId(data.id);

          const prepared = [...EMPTY_ITEMS];
          data.preparation.forEach((item: PrepItem, i: number) => {
            prepared[i] = item;
          });

          setForm({
            title: data.title,
            title_desc: data.title_desc,
            preparation: prepared,
          });
        }
      } catch (err) {
        console.error("Erreur fetch produit :", err);
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

  const submit = async () => {
    const fd = new FormData();
    fd.append("lang", lang);
    fd.append("title", form.title);
    fd.append("title_desc", form.title_desc);
    fd.append("preparation", JSON.stringify(form.preparation));

    form.preparation.forEach((item) => {
      if (item.photo instanceof File) {
        fd.append("photos", item.photo);
      }
    });

    try {
      if (dbId) {
        await axios.put(`http://localhost:3000/api/produit/${dbId}`, fd);
      } else {
        await axios.post("http://localhost:3000/api/produit", fd);
      }
      alert("Enregistré !");
      setLocked(true);
    } catch (err) {
      console.error("Erreur submit produit :", err);
    }
  };

  return (
    <div className="p-4 mx-auto">
        <input
        disabled={locked}
        className="border p-2 w-full mt-3 rounded bg-gray-700/10"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        disabled={locked}
        className="border p-2 w-full mt-3 rounded bg-gray-700/10"
        placeholder="Description"
        value={form.title_desc}
        rows={4}
        onChange={(e) => setForm({ ...form, title_desc: e.target.value })}
      />

      {form.preparation.map((item, i) => (
        <div key={i} className="border p-3 rounded mt-4 bg-gray-50">
          {item.photo && (
            <img
              src={
                item.photo instanceof File
                  ? URL.createObjectURL(item.photo)
                  : `http://localhost:3000${item.photo}`
              }
              alt="photo"
              className="w-32 h-32 object-cover mb-2 rounded border"
            />
          )}

          {!locked && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhoto(i, e.target.files?.[0] as File)}
              className="border p-2 w-full mt-2 rounded bg-gray-700/10"
            />
          )}

          <input
            disabled={locked}
            className="border p-2 w-full mt-2 rounded bg-gray-700/10"
            placeholder="Photo Titre"
            value={item.photo_title}
            onChange={(e) => handleChange(i, "photo_title", e.target.value)}
          />

          <textarea
            disabled={locked}
            className="border p-2 w-full mt-2 rounded bg-gray-700/10"
            placeholder="Photo Desc"
            value={item.photo_desc}
            rows={4}
            onChange={(e) => handleChange(i, "photo_desc", e.target.value)}
          />
        </div>
      ))}

      {locked ? (
        <button
          onClick={() => setLocked(false)}
          className="bg-blue-500 text-white p-2 mt-4 rounded"
        >
          Modifier
        </button>
      ) : (
        <button
          onClick={submit}
          className="bg-green-600 text-white p-2 mt-4 rounded"
        >
          Enregistrer
        </button>
      )}
    </div>
  );
}
