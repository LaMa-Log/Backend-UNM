const Engagement = require("../models/modelEngagements");

// ➡️ Créer un engagement
exports.createEngagement = async (req, res) => {
  try {
    const { lang = "fr", titre1, descTitre1, titre2, descTitre2, items } = req.body;

    const newEngagement = new Engagement({
      titre1: { [lang]: titre1 },
      descTitre1: { [lang]: descTitre1 },
      titre2: { [lang]: titre2 },
      descTitre2: { [lang]: descTitre2 },
      items: items ? items.map((item) => ({ [lang]: item })) : []
    });

    await newEngagement.save();
    res.status(201).json(newEngagement);
  } catch (error) {
    console.error("❌ Erreur createEngagement :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer tous les engagements
exports.getAllEngagements = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const engagements = await Engagement.find();

    const localized = engagements.map((e) => ({
      id: e._id,
      titre1: e.titre1[lang] || e.titre1.fr,
      descTitre1: e.descTitre1[lang] || e.descTitre1.fr,
      titre2: e.titre2[lang] || e.titre2.fr,
      descTitre2: e.descTitre2[lang] || e.descTitre2.fr,
      items: e.items.map((item) => item[lang] || item.fr)
    }));

    res.json(localized);
  } catch (error) {
    console.error("❌ Erreur getAllEngagements :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer un engagement par ID
exports.getEngagementById = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const engagement = await Engagement.findById(req.params.id);
    if (!engagement)
      return res.status(404).json({ message: "Engagement non trouvé" });

    const localized = {
      id: engagement._id,
      titre1: engagement.titre1[lang] || engagement.titre1.fr,
      descTitre1: engagement.descTitre1[lang] || engagement.descTitre1.fr,
      titre2: engagement.titre2[lang] || engagement.titre2.fr,
      descTitre2: engagement.descTitre2[lang] || engagement.descTitre2.fr,
      items: engagement.items.map((item) => item[lang] || item.fr)
    };

    res.json(localized);
  } catch (error) {
    console.error("❌ Erreur getEngagementById :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Mettre à jour
exports.updateEngagement = async (req, res) => {
  try {
    const { lang = "fr", titre1, descTitre1, titre2, descTitre2, items } = req.body;

    const updateData = {};
    if (titre1) updateData[`titre1.${lang}`] = titre1;
    if (descTitre1) updateData[`descTitre1.${lang}`] = descTitre1;
    if (titre2) updateData[`titre2.${lang}`] = titre2;
    if (descTitre2) updateData[`descTitre2.${lang}`] = descTitre2;
    if (items) {
      updateData.items = items.map((item) => ({ [lang]: item }));
    }

    const updatedEngagement = await Engagement.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedEngagement)
      return res.status(404).json({ message: "Engagement non trouvé" });

    res.json(updatedEngagement);
  } catch (error) {
    console.error("❌ Erreur updateEngagement :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Supprimer
exports.deleteEngagement = async (req, res) => {
  try {
    const engagement = await Engagement.findByIdAndDelete(req.params.id);
    if (!engagement)
      return res.status(404).json({ message: "Engagement non trouvé" });

    res.json({ message: "Engagement supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteEngagement :", error);
    res.status(500).json({ error: error.message });
  }
};
