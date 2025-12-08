const mongoose = require("mongoose");

// Schéma des items du produit avec champs multilingues
const produitItemSchema = new mongoose.Schema({
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

// Schéma principal Produit
const produitSchema = new mongoose.Schema({
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
    type: [produitItemSchema],
    validate: {
      validator: (val) => val.length <= 4,
      message: "Le produit ne peut contenir que 4 éléments maximum."
    },
    default: []
  }
});

module.exports = mongoose.model("Produit", produitSchema);
