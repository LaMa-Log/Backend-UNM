import Entreprise from "../models/modelIdentity.js";

// CREATE ou UPDATE
export const createOrUpdateEntreprise = async (req, res) => {
  try {
    const { id, titre, historiques, theme, piliers, identite } = req.body;

    const entrepriseData = {
      titre,
      historiques,
      theme,
      piliers: piliers ? JSON.parse(piliers) : [],
      identite: identite ? JSON.parse(identite) : []
    };

    if (req.files) {
      if (req.files.photoIdentite) entrepriseData.photoIdentite = `/uploads/${req.files.photoIdentite[0].filename}`;
      if (req.files.photoPiliers) entrepriseData.photoPiliers = `/uploads/${req.files.photoPiliers[0].filename}`;
    }

    let entreprise;
    if (id) {
      entreprise = await Entreprise.findByIdAndUpdate(id, entrepriseData, { new: true });
    } else {
      entreprise = new Entreprise(entrepriseData);
      await entreprise.save();
    }

    res.json(entreprise);
  } catch (err) {
    console.error("Erreur create/update :", err);
    res.status(500).json({ error: "Erreur lors de la création ou mise à jour de l'entreprise" });
  }
};

// READ all
export const getEntreprises = async (req, res) => {
  try {
    const entreprises = await Entreprise.find().sort({ createdAt: -1 });
    res.json(entreprises);
  } catch (err) {
    console.error("Erreur get :", err);
    res.status(500).json({ error: "Erreur lors de la récupération des entreprises" });
  }
};

// DELETE
export const deleteEntreprise = async (req, res) => {
  try {
    const deleted = await Entreprise.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Entreprise non trouvée" });
    res.json({ message: "Entreprise supprimée avec succès" });
  } catch (err) {
    console.error("Erreur delete :", err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};
