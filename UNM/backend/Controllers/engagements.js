const Engagement = require("../models/modelEngagements");

// ➡️ Créer un engagement
exports.createEngagement = async (req, res) => {
  try {
    const { titre1, descTitre1, titre2, descTitre2, items } = req.body;

    const newEngagement = new Engagement({
      titre1,
      descTitre1,
      titre2,
      descTitre2,
      items,
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
    const engagements = await Engagement.find();
    res.json(engagements);
  } catch (error) {
    console.error("❌ Erreur getAllEngagements :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer un engagement par ID
exports.getEngagementById = async (req, res) => {
  try {
    const engagement = await Engagement.findById(req.params.id);
    if (!engagement)
      return res.status(404).json({ message: "Engagement non trouvé" });
    res.json(engagement);
  } catch (error) {
    console.error("❌ Erreur getEngagementById :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Mettre à jour
exports.updateEngagement = async (req, res) => {
  try {
    const { titre1, descTitre1, titre2, descTitre2, items } = req.body;

    const updatedEngagement = await Engagement.findByIdAndUpdate(
      req.params.id,
      { titre1, descTitre1, titre2, descTitre2, items },
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
