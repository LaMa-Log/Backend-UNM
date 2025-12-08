import Entreprise from "../models/modelIdentity.js";

// CREATE ou UPDATE
export const createOrUpdateEntreprise = async (req, res) => {
  try {
    const { id, lang = "fr", titre, historiques, theme, piliers, identite } = req.body;

    // Préparer les données multilingues
    const entrepriseData = {};
    if (titre) entrepriseData[`titre.${lang}`] = titre;
    if (historiques) entrepriseData[`historiques.${lang}`] = historiques;
    if (theme) entrepriseData[`theme.${lang}`] = theme;

    if (piliers) {
      // piliers envoyés en JSON [{ titre: "...", description: "..." }]
      const parsedPiliers = JSON.parse(piliers);
      entrepriseData.piliers = parsedPiliers.map(p => ({
        titre: { [lang]: p.titre },
        description: { [lang]: p.description }
      }));
    }

    if (identite) {
      // identite envoyée en JSON ["valeur1", "valeur2"]
      const parsedIdentite = JSON.parse(identite);
      entrepriseData[`identite.${lang}`] = parsedIdentite;
    }

    // Gestion des fichiers uploadés
    if (req.files) {
      if (req.files.photoIdentite) {
        entrepriseData.photoIdentite = `/uploads/${req.files.photoIdentite[0].filename}`;
      }
      if (req.files.photoPiliers) {
        entrepriseData.photoPiliers = `/uploads/${req.files.photoPiliers[0].filename}`;
      }
    }

    let entreprise;
    if (id) {
      // 🔑 Utiliser $set pour ne pas écraser les autres langues
      entreprise = await Entreprise.findByIdAndUpdate(
        id,
        { $set: entrepriseData },
        { new: true }
      );
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

// READ all (avec langue)
export const getEntreprises = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const entreprises = await Entreprise.find().sort({ createdAt: -1 });

    // Renvoie uniquement la langue demandée
    const localized = entreprises.map(e => ({
      id: e._id,
      titre: e.titre[lang] || e.titre.fr,
      historiques: e.historiques[lang] || e.historiques.fr,
      theme: e.theme[lang] || e.theme.fr,
      photoIdentite: e.photoIdentite,
      photoPiliers: e.photoPiliers,
      piliers: e.piliers.map(p => ({
        titre: p.titre[lang] || p.titre.fr,
        description: p.description[lang] || p.description.fr
      })),
      identite: e.identite[lang] || e.identite.fr
    }));

    res.json(localized);
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
