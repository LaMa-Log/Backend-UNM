import Gallery from "../models/modelGallery.js";

// Ajouter une photo
export const createPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Fichier requis" });

    const newPhoto = new Gallery({
      photo: req.file.filename,
    });

    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    console.error("❌ Erreur createPhoto :", err);
    res.status(500).json({ error: err.message });
  }
};

// Récupérer toutes les photos
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.json(photos);
  } catch (err) {
    console.error("❌ Erreur getAllPhotos :", err);
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une photo
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Gallery.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: "Photo non trouvée" });

    res.json({ message: "Photo supprimée avec succès" });
  } catch (err) {
    console.error("❌ Erreur deletePhoto :", err);
    res.status(500).json({ error: err.message });
  }
};
