const Preparation = require("../models/modelPreparation");

// CREATE
exports.createPreparation = async (req, res) => {
  try {
    const { title, title_desc } = req.body;
    const preparation = JSON.parse(req.body.preparation);

    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
    });

    const newPrep = new Preparation({ title, title_desc, preparation });
    await newPrep.save();

    res.status(201).json(newPrep);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ
exports.getPreparations = async (req, res) => {
  try {
    const data = await Preparation.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updatePreparation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, title_desc } = req.body;
    let preparation = JSON.parse(req.body.preparation);

    preparation.forEach((item, index) => {
      if (req.files && req.files[index]) {
        item.photo = `/uploads/${req.files[index].filename}`;
      }
    });

    const updated = await Preparation.findByIdAndUpdate(
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
exports.deletePreparation = async (req, res) => {
  try {
    const { id } = req.params;
    await Preparation.findByIdAndDelete(id);
    res.json({ message: "Supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};