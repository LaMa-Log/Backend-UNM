const Produit = require("../models/modelProduit");

// CREATE
exports.createProduit = async (req, res) => {
  try {
    const { lang = "fr", title, title_desc } = req.body;
    let preparation = JSON.parse(req.body.preparation);

    // Gérer les photos et adapter les champs multilingues
    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
      item.photo_title = { [lang]: item.photo_title };
      item.photo_desc = { [lang]: item.photo_desc };
    });

    const newProduit = new Produit({
      title: { [lang]: title },
      title_desc: { [lang]: title_desc },
      preparation,
    });

    await newProduit.save();
    res.status(201).json(newProduit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ
exports.getProduits = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const data = await Produit.find();

    // Localiser les champs selon la langue demandée
    const localized = data.map((prod) => ({
      id: prod._id,
      title: prod.title[lang] || prod.title.fr,
      title_desc: prod.title_desc[lang] || prod.title_desc.fr,
      preparation: prod.preparation.map((item) => ({
        photo: item.photo,
        photo_title: item.photo_title[lang] || item.photo_title.fr,
        photo_desc: item.photo_desc[lang] || item.photo_desc.fr,
      })),
    }));

    res.json(localized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang = "fr", title, title_desc } = req.body;
    let preparation = JSON.parse(req.body.preparation);

    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
      item.photo_title = { [lang]: item.photo_title };
      item.photo_desc = { [lang]: item.photo_desc };
    });

    const updateData = {};
    if (title) updateData[`title.${lang}`] = title;
    if (title_desc) updateData[`title_desc.${lang}`] = title_desc;
    updateData.preparation = preparation;

    const updated = await Produit.findByIdAndUpdate(
      id,
      { $set: updateData },
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
