const Preparation = require("../models/modelPreparation");

// CREATE
exports.createPreparation = async (req, res) => {
  try {
    const { lang = "fr", title, title_desc } = req.body;
    let preparation = JSON.parse(req.body.preparation);

    // Gérer les photos uploadées
    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
      // Adapter les champs multilingues
      item.photo_title = { [lang]: item.photo_title };
      item.photo_desc = { [lang]: item.photo_desc };
    });

    const newPrep = new Preparation({
      title: { [lang]: title },
      title_desc: { [lang]: title_desc },
      preparation,
    });

    await newPrep.save();
    res.status(201).json(newPrep);
  } catch (error) {
    res.status(500).json({ error: error.message});
  }
};

// READ
exports.getPreparations = async (req, res) => {
  try {
    const lang = req.query.lang || "fr";
    const data = await Preparation.find();

    // Localiser les champs selon la langue demandée
    const localized = data.map((prep) => ({
      id: prep._id,
      title: prep.title[lang] || prep.title.fr,
      title_desc: prep.title_desc[lang] || prep.title_desc.fr,
      preparation: prep.preparation.map((item) => ({
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
exports.updatePreparation = async (req, res) => {
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

    const updated = await Preparation.findByIdAndUpdate(
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
exports.deletePreparation = async (req, res) => {
  try {
    const { id } = req.params;
    await Preparation.findByIdAndDelete(id);
    res.json({ message: "Supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
