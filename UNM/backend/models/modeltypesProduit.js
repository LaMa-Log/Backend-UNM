const mongoose = require("mongoose");

// Schéma pour une qualité de produit
const qualiteSchema = new mongoose.Schema({
  titreContenu: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  descContenu: {
    fr: { type: String },
    en: { type: String },
    zh: { type: String }
  },
  items: [{
    fr: { type: String },
    en: { type: String },
    zh: { type: String }
  }],
  photoContenu: { type: String } // photo spécifique à cette qualité
});

// Schéma principal TypeProduit
const typeProduitSchema = new mongoose.Schema({
  titreProduit: {
    fr: { type: String, required: true },
    en: { type: String },
    zh: { type: String }
  },
  descProduit: {
    fr: { type: String },
    en: { type: String },
    zh: { type: String }
  },
  qualites: {
    type: [qualiteSchema],
    validate: {
      validator: (val) => val.length === 2, // exactement deux qualités
      message: "Le produit doit contenir exactement 2 qualités."
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("TypeProduit", typeProduitSchema);
