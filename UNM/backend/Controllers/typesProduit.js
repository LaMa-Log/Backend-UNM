const TypeProduit = require("../models/TypeProduit");

// ➡️ Créer un type produit
exports.createTypeProduit = async (req, res) => {
  try {
    const { lang = "fr", titreProduit, descProduit, qualites } = req.body;

    const parsedQualites = qualites ? JSON.parse(qualites) : [];

    // Adapter chaque qualité
    const qualitesMultilang = parsedQualites.map((q, index) => ({
      titreContenu: { [lang]: q.titreContenu },
      descContenu: { [lang]: q.descContenu },
      items: q.items.map((item) => ({ [lang]: item })),
      photoContenu:
        req.files && req.files[index] ? `/uploads/${req.files[index].filename}` : null,
    }));

    const newTypeProduit = new TypeProduit({
      titreProduit: { [lang]: titreProduit },
      descProduit: { [lang]: descProduit },
      qualites: qualitesMultilang,
    });

    await newTypeProduit.save();
    res.status(201).json(newTypeProduit);
  } catch (error) {
    console.error("❌ Erreur createTypeProduit :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer tous les types produits
exports.getAllTypeProduits = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const produits = await TypeProduit.find();

    const localized = produits.map((p) => ({
      id: p._id,
      titreProduit: p.titreProduit[lang] || p.titreProduit.fr,
      descProduit: p.descProduit[lang] || p.descProduit.fr,
      qualites: p.qualites.map((q) => ({
        titreContenu: q.titreContenu[lang] || q.titreContenu.fr,
        descContenu: q.descContenu[lang] || q.descContenu.fr,
        items: q.items.map((item) => item[lang] || item.fr),
        photoContenu: q.photoContenu,
      })),
    }));

    res.json(localized);
  } catch (error) {
    console.error("❌ Erreur getAllTypeProduits :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Récupérer un type produit par ID
exports.getTypeProduitById = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const produit = await TypeProduit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    const localized = {
      id: produit._id,
      titreProduit: produit.titreProduit[lang] || produit.titreProduit.fr,
      descProduit: produit.descProduit[lang] || produit.descProduit.fr,
      qualites: produit.qualites.map((q) => ({
        titreContenu: q.titreContenu[lang] || q.titreContenu.fr,
        descContenu: q.descContenu[lang] || q.descContenu.fr,
        items: q.items.map((item) => item[lang] || item.fr),
        photoContenu: q.photoContenu,
      })),
    };

    res.json(localized);
  } catch (error) {
    console.error("❌ Erreur getTypeProduitById :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Mettre à jour un type produit
exports.updateTypeProduit = async (req, res) => {
  try {
    const { lang = "fr", titreProduit, descProduit, qualites } = req.body;

    const updateData = {};
    if (titreProduit) updateData[`titreProduit.${lang}`] = titreProduit;
    if (descProduit) updateData[`descProduit.${lang}`] = descProduit;

    if (qualites) {
      const parsedQualites = JSON.parse(qualites);
      updateData.qualites = parsedQualites.map((q, index) => ({
        titreContenu: { [lang]: q.titreContenu },
        descContenu: { [lang]: q.descContenu },
        items: q.items.map((item) => ({ [lang]: item })),
        photoContenu:
          req.files && req.files[index] ? `/uploads/${req.files[index].filename}` : q.photoContenu,
      }));
    }

    const produit = await TypeProduit.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    res.json(produit);
  } catch (error) {
    console.error("❌ Erreur updateTypeProduit :", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Supprimer un type produit
exports.deleteTypeProduit = async (req, res) => {
  try {
    const produit = await TypeProduit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });

    res.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteTypeProduit :", error);
    res.status(500).json({ error: error.message });
  }
};
