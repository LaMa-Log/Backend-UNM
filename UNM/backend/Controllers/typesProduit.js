// controllers/typeProduitController.js
const TypeProduit = require('../models/modeltypesProduit');

// ➡️ Créer un type produit
exports.createTypeProduit = async (req, res) => {
  try {

    const { titreProduit, descProduit, contenus } = req.body;

    const newTypeProduit = new TypeProduit({
      titreProduit,
      descProduit,
      photoProduit: req.file ? req.file.filename : null,
      contenus: contenus ? JSON.parse(contenus) : []
    });

    await newTypeProduit.save();
    res.status(201).json(newTypeProduit);
  } catch (error) {
    console.error("❌ Erreur createTypeProduit :", error);
    res.status(500).json({ error: error.message , newTypeProduit });
  }
};

// ➡️ Récupérer tous les types produits
exports.getAllTypeProduits = async (req, res) => {
  try {
    console.log("\n📥 GET /api/typesproduit");
    const produits = await TypeProduit.find();
    res.json(produits);
  } catch (error) {
    console.error("❌ Erreur getAllTypeProduits :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer un type produit par ID
exports.getTypeProduitById = async (req, res) => {
  try {
    console.log(`\n📥 GET /api/typesproduit/${req.params.id}`);

    const produit = await TypeProduit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    res.json(produit);
  } catch (error) {
    console.error("❌ Erreur getTypeProduitById :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Mettre à jour
exports.updateTypeProduit = async (req, res) => {
  try {
    console.log(`\n📥 PUT /api/typesproduit/${req.params.id}`);
    console.log("➡️ Body reçu :", req.body);
    console.log("➡️ Fichier reçu :", req.file);

    const { titreProduit, descProduit, contenus } = req.body;

    const updatedData = {
      titreProduit,
      descProduit,
      contenus: contenus ? JSON.parse(contenus) : []
    };

    if (req.file) updatedData.photoProduit = req.file.filename;

    const produit = await TypeProduit.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    res.json(produit);
  } catch (error) {
    console.error("❌ Erreur updateTypeProduit :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Supprimer
exports.deleteTypeProduit = async (req, res) => {
  try {
    console.log(`\n📥 DELETE /api/typesproduit/${req.params.id}`);

    const produit = await TypeProduit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteTypeProduit :", error);
    res.status(500).json({ error: error.message });
  }
};
