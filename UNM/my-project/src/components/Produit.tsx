import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        const res = await axios.get(
          `http://localhost:3000/api/produit?lang=${lang}`
        );

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
        toast.error("Erreur lors du chargement !");
      }
    };

    fetchData();
  }, [lang]);

  const handleChange = (i: number, field: keyof PrepItem, value: string) => {
    if (locked) return;
    const updated = [...form.preparation];
    updated[i][field] = value;
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

      toast.success("Enregistré !");
      setLocked(true);

    } catch (err) {
      console.error("Erreur submit produit :", err);
      toast.error("Erreur lors de l'enregistrement !");
    }
  };

  return (
    <div className="p-4 mx-auto max-w-5xl">
      {/* TITRE */}
      <input
        disabled={locked}
        className="border p-2 w-full mt-3 rounded bg-gray-200"
        placeholder="Titre"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* DESCRIPTION */}
      <textarea
        disabled={locked}
        className="border p-2 w-full mt-3 rounded bg-gray-200"
        placeholder="Description"
        rows={4}
        value={form.title_desc}
        onChange={(e) => setForm({ ...form, title_desc: e.target.value })}
      />

      {/* ITEMS */}
      {form.preparation.map((item, i) => (
        <div
          key={i}
          className="border p-4 rounded mt-5 bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* PHOTO */}
          <div className="flex flex-col items-center justify-start">
            <input
              id={`file_${i}`}
              type="file"
              className="hidden"
              accept="image/*"
              disabled={locked}
              onChange={(e) => handlePhoto(i, e.target.files?.[0] as File)}
            />

            <div
              className={`w-32 h-32 rounded-lg border flex items-center justify-center cursor-pointer overflow-hidden ${
                locked ? "opacity-50 cursor-not-allowed" : "hover:scale-105 transition"
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
                <img src="/upload.png" className="w-14 h-14 opacity-50" alt="upload" />
              )}
            </div>
          </div>

          {/* TEXTES */}
          <div className="md:col-span-2 flex flex-col space-y-3">
            <input
              disabled={locked}
              className="border p-2 w-full rounded bg-gray-200"
              placeholder="Titre de la photo"
              value={item.photo_title}
              onChange={(e) => handleChange(i, "photo_title", e.target.value)}
            />

            <textarea
              disabled={locked}
              className="border p-2 w-full rounded bg-gray-200"
              placeholder="Description"
              value={item.photo_desc}
              rows={4}
              onChange={(e) => handleChange(i, "photo_desc", e.target.value)}
            />
          </div>
        </div>
      ))}

      {/* BUTTONS */}
      {locked ? (
        <button
          onClick={() => setLocked(false)}
          className="bg-green-600 w-full text-white p-2 mt-5 rounded"
        >
          Modifier
        </button>
      ) : (
        <button
          onClick={submit}
          className="bg-blue-500 w-full text-white p-2 mt-5 rounded"
        >
          Sauvegarder
        </button>
      )}

      {/* TOASTIFY */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
}
