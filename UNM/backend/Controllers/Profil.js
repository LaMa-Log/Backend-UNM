import Profile from "../models/modelProfil.js";

// CREATE
export const createProfile = async (req, res) => {
  try {
    const { lang = "fr", title, title_desc } = req.body;

    const profile = new Profile({
      title: { [lang]: title }, // ex: { fr: "Titre en français" }
      title_desc: { [lang]: title_desc },
      profilePhoto: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error("Erreur de création :", err);
    res.status(500).json({ error: "Erreur lors de la création du profil" });
  }
};

// READ all (avec langue)
export const getProfiles = async (req, res) => {
  try {
    const lang = req.query.lang || "fr"; // langue demandée
    const profiles = await Profile.find().sort({ createdAt: -1 });

    // On renvoie uniquement la langue demandée
    const localizedProfiles = profiles.map((p) => ({
      id: p._id,
      title: p.title[lang] || p.title.fr, // fallback français
      title_desc: p.title_desc[lang] || p.title_desc.fr,
      profilePhoto: p.profilePhoto,
    }));

    res.json(localizedProfiles);
  } catch (err) {
    console.error("Erreur récupération :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des profils" });
  }
};

// UPDATE
export const updateProfile = async (req, res) => {
  try {
    const { id, lang = "fr", title, title_desc, profilePhoto } = req.body;

    const updateData = {};
    if (title) updateData[`title.${lang}`] = title;
    if (title_desc) updateData[`title_desc.${lang}`] = title_desc;
    if (req.file) {
      updateData.profilePhoto = `/uploads/${req.file.filename}`;
    } else if (profilePhoto) {
      updateData.profilePhoto = profilePhoto;
    }

    const updatedProfile = await Profile.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProfile) return res.status(404).json({ error: "Profil non trouvé" });
    res.json(updatedProfile);
  } catch (err) {
    console.error("Erreur update :", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};

// DELETE
export const deleteProfile = async (req, res) => {
  try {
    const deleted = await Profile.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Profil non trouvé" });
    res.json({ message: "Profil supprimé avec succès" });
  } catch (err) {
    console.error("Erreur delete :", err);
    res.status(500).json({ error: "Erreur lors de la suppression du profil" });
  }
};
