const mongoose = require("mongoose");

// Schéma des items de préparation avec champs multilingues
const preparationItemSchema = new mongoose.Schema({
  photo: { type: String, required: false },
  photo_title: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  photo_desc: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  }
});

// Schéma principal Preparation
const preparationSchema = new mongoose.Schema({
  title: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  title_desc: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  preparation: {
    type: [preparationItemSchema],
    validate: {
      validator: (val) => val.length <= 6,
      message: "La préparation ne peut contenir que 4 éléments maximum."
    },
    default: []
  }
});

module.exports = mongoose.model("Preparation", preparationSchema);
