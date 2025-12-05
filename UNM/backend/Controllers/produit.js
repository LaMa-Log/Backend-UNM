const Produit = require("../models/modelProduit"); // on change le modèle

// CREATE
exports.createProduit = async (req, res) => {
  try {
    const { title, title_desc } = req.body;
    const preparation = JSON.parse(req.body.preparation); // on garde la logique

    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
    });

    const newProduit = new Produit({ title, title_desc, preparation });
    await newProduit.save();

    res.status(201).json(newProduit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ
exports.getProduits = async (req, res) => {
  try {
    const data = await Produit.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, title_desc } = req.body;
    let preparation = JSON.parse(req.body.preparation);

    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
    });

    const updated = await Produit.findByIdAndUpdate(
      id,
      { title, title_desc, preparation },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;
    await Produit.findByIdAndDelete(id);
    res.json({ message: "Supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
